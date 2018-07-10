import * as fs from "fs"
import * as numeral from "numeral"
import * as Path from "path"

import {FileProcessor} from "../processor/file-processor"
import {FileInfo} from "../util/io/file-info"
import {WatcherConfig} from "./watcher-config"

export class FileWatcher {

  private readonly fileQueue: FileInfo[] = []

  private processing: boolean = false
  private readonly processDirPath: string
  private readonly archiveDirPath: string
  private readonly errorDirPath: string

  constructor(config: WatcherConfig, private readonly processor: FileProcessor) {
    this.processDirPath = config.processDirPath
    this.archiveDirPath = config.archiveDirPath
    this.errorDirPath = config.errorDirPath
  }

  start() {
    this.checkDirsExist()
    this.processFiles().then(() => console.log("FileWatcher", "Done processing files."))
  }

  private async processFiles(): Promise<void> {
    const filesToProcess: FileInfo[] = this.determineFilesToProcess(this.processDirPath)
    console.log("FileWatcher#processFiles",
      "Will proceed with files:\n\t",
      filesToProcess.map(info => info.path).join(",\n\t"))
    this.fileQueue.push(...filesToProcess)
    await this.processNext()
  }

  private determineFilesToProcess(dirPath: string): FileInfo[] {
    let result: FileInfo[] = []
    const fileNames: string[] = fs.readdirSync(dirPath)
    fileNames.forEach(name => {
      const path: string = Path.join(dirPath, name)
      const fileInfo: FileInfo = {name: name, path: path, stats: fs.statSync(path)}
      const accept = this.processor.acceptPath(fileInfo)
      if (accept) {
        if (fileInfo.stats.isDirectory()) {
          result = result.concat(this.determineFilesToProcess(fileInfo.path))
        } else if (fileInfo.stats.isFile()) {
          result.push(fileInfo)
        } else {
          throw new Error(`Unhandled stats case for path: ${fileInfo.path} (${fileInfo.stats})`)
        }
      }
    })
    return result
  }

  private checkDirsExist() {
    if (!fs.existsSync(this.processDirPath)) {
      throw new Error(`Directory to check for files for processing does not exist! '${this.processDirPath}'`)
    }
    if (!fs.existsSync(this.archiveDirPath)) {
      console.log(`Directory to archive files after processing does not exist. Directory '${this.archiveDirPath}' will be  created`)
      fs.mkdirSync(this.archiveDirPath)
    }
    if (!fs.existsSync(this.errorDirPath)) {
      console.log(`Directory to archive failed files after processing does not exist. Directory '${this.errorDirPath}' will be  created`)
      fs.mkdirSync(this.errorDirPath)
    }
  }

  private async processNext() {
    try {
      if (!this.processing) {
        this.processing = true
        while (this.fileQueue.length) {
          const info = this.fileQueue.pop()!
          console.log("[Info]", "FileWatcher#processNext - BEGIN", info.name)
          const start = Date.now()
          const success = await this.processNextFile(info)
          const delta = Date.now() - start
          if (success) {
            console.log("[Info]", "FileWatcher#processNext - COMPLETE", numeral(delta / 1000.0).format("0.000"))
            await this.archive(info)
          } else {
            console.log("[Warn]", "FileWatcher#processNext - COMPLETE (with error)", numeral(delta / 1000.0).format("0.000"))
            this.moveToErrorDir(info.path)
          }
        }
        console.log("FileWatcher#processNext", "DONE")
        this.processing = false
      }
    } catch (e) {
      console.log("[Error]", "FileWatcher#processNext", e)
    }
  }


  private archive(info: FileInfo) {
    try {
      const folder = this.archiveDirPath + Path.sep
      info.path = this.moveFileTo(info.path, folder + info.name)
    } catch (e) {
      console.log("[Error]", "FileWatcher#archive", e)
    }
  }

  private moveToErrorDir(path: string) {
    return this.moveFileTo(path, Path.join(this.errorDirPath, Path.basename(path)))
  }

  private moveFileTo(path: string, newPath: string): string {
    fs.renameSync(path, newPath)
    return newPath
  }

  private async processNextFile(info: FileInfo): Promise<boolean> {
    let success: boolean = false
    try {
      const rawContent = fs.readFileSync(info.path, {encoding: "UTF8"})
      const outputContent = await this.processor.process(info, rawContent)
      success = true
    } catch (e) {
      console.log("[Error]", "FileWatcher#process", "FAILED:", info.path)
      console.log("[Error]", e)
    }
    return success
  }


}
