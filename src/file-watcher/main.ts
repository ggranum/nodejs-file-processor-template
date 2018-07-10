import {FileProcessor} from "../processor/file-processor"
import {FileWatcher} from "./file-watcher"
import {injector} from "./injector.config"
import {WatcherConfig} from "./watcher-config"

export class Main {

  constructor(private readonly fileWatcher: FileWatcher) {
    console.log("[Info]", "Starting App")
  }

  async start() {
    console.log("Main#start", "Starting File Watcher")
    try {
      this.fileWatcher.start()
    } catch (e) {
      console.error("[Fatal]", "Main#start", "Something bad happened!", e)
    }
  }
}

const config: WatcherConfig = {
  processDirPath: "./temp/process",
  errorDirPath  : "./temp/errors",
  archiveDirPath: "./temp/archive",
}


const fileProcessor = injector.get(FileProcessor)

const fileWatcher = new FileWatcher(config, fileProcessor)

const promise = new Main(fileWatcher).start();
promise.then(() => console.log("Application Completed. Goodbye."))
