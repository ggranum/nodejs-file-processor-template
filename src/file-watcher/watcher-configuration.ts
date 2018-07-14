import {Injectable} from "injection-js"
import {LogLevel} from "../util/logging/log-level"

export interface WatcherConfigurationJson {
  /**
   * While nodejs runs in one thread, it's possible to create situations where multiple files are 'in process'
   * simultaneously. If your files are hundreds of megabytes in size, that could break things.
   * @type {number} The maximum number of files to have 'in process' (open and read into memory') at once.
   */
  maxSimultaneousProcesses: number

  /**
   * The base directory which will be scanned for files to process.
   * This directory must exist. If it does not, an error will be thrown.
   * @type {string} The path, either relative to the directory this application is started from, or absolute.
   */
  processDirPath: string

  /**
   * If true, scan child directories of processDirPath.
   *
   * Note that each file path and it's fs.stats object will be passed into the FileProcessor#acceptFile method. If
   * `recursive` is set to false, file paths representing directories will simply not be passed to the acceptFile
   * method.
   *
   * @type {boolean} Set to false to simple skip processing child directories.
   */
  recursive: boolean

  /**
   * The (optional) path to move processed files into. Once successfully processed the source file will be moved into
   * this directory, if provided. If not provided the files will remain in place.
   *
   * If `flattenFileTree` is true, the directory hierarchy will be kept as well, otherwise all files
   * will be copied 'flat', which could potentially lead to file overwrites.
   *
   * If this path does not exist it will be created.
   *
   * If no value is provided the original files will not be moved.
   *
   * @type {string} A valid file path.
   */
  archiveDirPath?: string

  /**
   * The path to move files that error out during processing into.
   * When a file processor throws an error, the offending file will be moved into this directory.
   *
   * If `flattenFileTree` is true, the directory hierarchy will be kept as well, otherwise all files
   * will be copied 'flat', which could potentially lead to file overwrites.
   *
   * If this path does not exist it will be created.
   *
   * @type {string} A valid file path.
   */
  errorDirPath: string

  /**
   * The path to move the output from a processed file, assuming there is an output.
   *
   * Once successfully processed, the resulting output from the processing step will be saved into this directory.
   *
   * It is the responsibility of the processing method to return appropriate file paths for saving the content.
   *
   * If this path does not exist it will be created.
   *
   * @type {string} A valid file path.
   */
  outputDirPath: string


  /**
   * Write out processed files into the archive directory, without creating child directories to match the original
   * path of the source, relative to `processDirPath`.
   * Only makes sense if `recursive` is true and the processor accepts child directories.
   * @type {boolean}
   */
  flattenFileTree: boolean


  /**
   * If true, any file that exists in any of the output directories (archive, error, output) will be overwritten
   * silently in the event of a naming collision. If false, an error will be thrown and processing will stop.
   *
   * todo: Add auto rename.
   *
   * @type {boolean}
   */
  allowFileOverWrites: boolean
  logLevel: LogLevel
}

const defaultConfig: WatcherConfigurationJson = {
  processDirPath          : "./temp/process",
  archiveDirPath          : undefined,
  errorDirPath            : "./temp/errors",
  outputDirPath           : "./temp/output",
  recursive               : true,
  flattenFileTree         : false,
  maxSimultaneousProcesses: 1,
  allowFileOverWrites     : false,
  logLevel                : LogLevel.Trace,
}


@Injectable()
export class WatcherConfiguration {

  readonly processDirPath: string = "./temp/process"
  readonly archiveDirPath?: string
  readonly errorDirPath: string = "./temp/errors"
  readonly outputDirPath: string = "./temp/output"
  readonly recursive: boolean = true
  readonly flattenFileTree: boolean = false
  readonly maxSimultaneousProcesses: number = 1
  readonly allowFileOverWrites: boolean = false
  readonly logLevel: LogLevel = LogLevel.Trace


  constructor(cfg?: WatcherConfigurationJson) {
    const init: WatcherConfigurationJson = {...defaultConfig, ...cfg}
    this.processDirPath = init.processDirPath
    this.archiveDirPath = init.archiveDirPath
    this.errorDirPath = init.errorDirPath
    this.outputDirPath = init.outputDirPath
    this.recursive = init.recursive
    this.flattenFileTree = init.flattenFileTree
    this.maxSimultaneousProcesses = init.maxSimultaneousProcesses
    this.allowFileOverWrites = init.allowFileOverWrites
    this.logLevel = init.logLevel
  }

  clone(update?: Partial<WatcherConfigurationJson>): WatcherConfiguration {
    return new WatcherConfiguration({...this.toJson(), ...update})
  }

  toJson(): WatcherConfigurationJson {
    return {
      processDirPath          : this.processDirPath,
      archiveDirPath          : this.archiveDirPath,
      errorDirPath            : this.errorDirPath,
      outputDirPath           : this.outputDirPath,
      recursive               : this.recursive,
      flattenFileTree         : this.flattenFileTree,
      maxSimultaneousProcesses: this.maxSimultaneousProcesses,
      allowFileOverWrites     : this.allowFileOverWrites,
      logLevel                : this.logLevel,
    }
  }

}
