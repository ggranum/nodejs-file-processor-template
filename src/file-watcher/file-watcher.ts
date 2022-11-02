import * as fs from "fs"
import {Injectable} from "injection-js"
import * as mkdirp from "mkdirp"
import numeral from "numeral"
import * as Path from "path"
import "reflect-metadata"
import {FileProcessor} from "../processor/file-processor"
import {FileInfo} from "../util/io/file-info"
import {ProcessorOutput} from "./model/processor-output.model"
import {WatcherConfiguration} from "./watcher-configuration"

const sleepTimeout = 50

@Injectable()
export class FileWatcher {

  private readonly fileQueue: FileInfo[] = []

  private processing: boolean = false
  private inProcess: FileInfo[] = []
  private cfg: WatcherConfiguration

  constructor(cfg: WatcherConfiguration, private readonly processor: FileProcessor) {
    this.cfg = cfg.clone({
      processDirPath: Path.normalize(cfg.processDirPath),
      archiveDirPath: cfg.archiveDirPath ? Path.normalize(cfg.archiveDirPath) : undefined,
      errorDirPath  : Path.normalize(cfg.errorDirPath),
      outputDirPath : Path.normalize(cfg.outputDirPath),
    })
  }

  async start(): Promise<void> {
    this.checkDirsExist()
    this.queueFiles().then(() => console.log("FileWatcher", "Done processing files."))
    await this.processNextBatch()
  }

  private async queueFiles(): Promise<void> {
    const filesToProcess: FileInfo[] = this.determineFilesToProcess(this.cfg.processDirPath)
    if (filesToProcess.length) {
      console.log("Found the following files to process: \n\t", filesToProcess.map(info => info.fullPath).join(",\n\t"))
      this.fileQueue.push(...filesToProcess)
    } else {
      console.warn("No files found for processing!!")
    }
  }

  /**
   *
   * @param folderPath
   * @VisibleForTesting
   */
  public determineFilesToProcess(folderPath: string): FileInfo[] {
    let result: FileInfo[] = []
    const fileNames: string[] = fs.readdirSync(folderPath)
    fileNames.forEach(name => {
      const path: string = Path.join(folderPath, name)
      const fileInfo: FileInfo = {
        fileName  : name,
        folderPath: folderPath,
        fullPath  : path,
        stats     : fs.statSync(path),
      }
      const accept = this.processor.acceptPath(fileInfo)
      if (accept) {
        if (fileInfo.stats.isDirectory()) {
          result = result.concat(this.determineFilesToProcess(fileInfo.fullPath))
        } else if (fileInfo.stats.isFile()) {
          result.push(fileInfo)
        } else {
          throw new Error(`Unhandled stats case for path: ${fileInfo.fullPath} (${fileInfo.stats})`)
        }
      }
    })
    return result
  }

  private checkDirsExist() {
    if (!fs.existsSync(this.cfg.processDirPath)) {
      throw new Error(`Directory to check for files for processing does not exist! '${this.cfg.processDirPath}'`)
    }
    if (this.cfg.archiveDirPath !== undefined && !fs.existsSync(this.cfg.archiveDirPath)) {
      console.log(`Directory to archive files after processing does not exist. Directory '${this.cfg.archiveDirPath}' will be  created`)
      fs.mkdirSync(this.cfg.archiveDirPath)
    }
    if (!fs.existsSync(this.cfg.errorDirPath)) {
      console.log(`Directory to archive failed files after processing does not exist. Directory '${this.cfg.errorDirPath}' will be  created`)
      fs.mkdirSync(this.cfg.errorDirPath)
    }

    if (!fs.existsSync(this.cfg.outputDirPath)) {
      console.log(`Output directory does not exist. Directory '${this.cfg.outputDirPath}' will be  created`)
      fs.mkdirSync(this.cfg.outputDirPath)
    }
  }

  /**
   * Processes the current queue until it's empty. It is possible to add files into the queue while this method is
   * running.
   *
   * The current implementation does not auto-scan the base directory for new additions, but this method would
   * accommodate such a change without modification.
   *
   */
  private async processNextBatch() {
    try {
      if (!this.processing) {
        this.processing = true
        while (this.fileQueue.length) {
          await this.blockOnProcessCount()
          const info = this.fileQueue.pop()!
          this.inProcess.push(info)
          this.processNextFile(info).then(success => {
            this.inProcess = this.inProcess.filter(i => i !== info)
          })
        }
        console.log("FileWatcher#processNext", "DONE")
        this.processing = false
      }
    } catch (e) {
      console.log("[Error]", "FileWatcher#processNext", e)
    }
  }


  private async processNextFile(info: FileInfo): Promise<boolean> {
    let success: boolean = false
    console.log("[Info]", "FileWatcher#processNext - BEGIN", info.fileName)
    const start = Date.now()
    try {
      const output = await this.processor.process(info)
      await this.handleProcessSuccess(info, output, start)
      const delta = Date.now() - start
      console.log("[Info]", "FileWatcher#processNext - COMPLETE", numeral(delta / 1000.0).format("0.000"))
      success = true
    } catch (e) {
      await this.handleProcessFailure(info, e, start)
      success = false
    }
    return success
  }

  private async handleProcessSuccess(info: FileInfo, output: ProcessorOutput[], start: number): Promise<void> {
    this.archive(info)
    await this.saveOutput(info, output)
  }

  private async handleProcessFailure(info: FileInfo, e: any, start: number) {
    const delta = Date.now() - start
    console.log("[Error]", "FileWatcher#process", "FAILED:", info.fullPath, numeral(delta / 1000.0).format("0.000"), e)
    await this.moveToErrorDir(info)
  }

  private blockOnProcessCount(): Promise<void> {
    let count = 0
    return new Promise((resolve, reject) => {
      const check = () => {
        if (count % (1000 / sleepTimeout) === 0) {
          console.log(`FileWatcher#check: Waiting on in process files (${count * sleepTimeout / 1000} seconds)`)
        }
        count++
        if (this.inProcess.length < this.cfg.maxSimultaneousProcesses) {
          resolve()
        } else {
          setTimeout(check, sleepTimeout)
        }
      }
      setTimeout(check, sleepTimeout)
    })
  }

  private getRelativeFolderPath(info: FileInfo, destinationRootPath: string) {
    destinationRootPath = Path.normalize(destinationRootPath)
    const targetFileProcessPath = Path.normalize(info.folderPath)
    /* The path from the root of process dir to the target file: */
    const relativeFolderPath = Path.normalize(targetFileProcessPath.replace(this.cfg.processDirPath, ''))
    return Path.join(destinationRootPath, relativeFolderPath)
  }

  private archive(info: FileInfo) {
    if (this.cfg.archiveDirPath) {
      try {
        const folderPath = this.getRelativeFolderPath(info, this.cfg.archiveDirPath)
        this.moveFileTo(info.fullPath, folderPath, info.fileName)
      } catch (e) {
        console.log("[Error]", "FileWatcher#archive", e)
      }
    }
  }

  private moveToErrorDir(info: FileInfo) {
    const folderPath = this.getRelativeFolderPath(info, this.cfg.errorDirPath)
    fs.mkdirSync(folderPath)
    this.moveFileTo(info.fullPath, folderPath, info.fileName)
  }

  private moveFileTo(path: string, newFolderPath: string, newName: string): void {
    const newPath = Path.join(newFolderPath, newName)
    try {
      mkdirp.sync(newFolderPath)
      if (!this.cfg.allowFileOverWrites && fs.existsSync(newPath)) {
        console.log("[Error]", "FileWatcher#moveFileTo", `File '${newPath}' already exists! Skipping move of file ${path}'`)
      } else {
        fs.renameSync(path, newPath)
        console.log("FileWatcher#moveFileTo/success:", newPath)
      }
    } catch (e) {
      console.log("[Error]", "FileWatcher#moveFileTo", `There has been an error creating a directory: ${newPath} could not be created.`)
    }
  }

  private async saveOutput(info: FileInfo, outputs: ProcessorOutput[]): Promise<void> {
    const defaultOutputFolderPath = this.getRelativeFolderPath(info, this.cfg.outputDirPath)
    outputs.forEach(output => {
      const folderPath = this.getOutputPath(output.folderPath, defaultOutputFolderPath)
      mkdirp.sync(folderPath)
      const filePath = Path.join(folderPath, output.fileName || info.fileName);
      fs.writeFile(filePath, output.content, (err) => {
        if (err) {
          console.log("[Error]", "FileWatcher#saveOutput",
            `Could not write output file to '${filePath}' for input file ${info.fullPath}`, err)
        } else {
          console.log(`FileWatcher#wrote output file to '${filePath}'`)
        }
      })

    })
  }

  private getOutputPath(providedOutPath: string | undefined, defaultOutputFolderPath: string): string {
    let result: string
    if (!providedOutPath) {
      result = defaultOutputFolderPath
    } else if (Path.isAbsolute(providedOutPath)) {
      result = providedOutPath
    } else {
      result = Path.join(this.cfg.outputDirPath, providedOutPath)
    }
    return result
  }
}
