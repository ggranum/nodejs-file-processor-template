import {FileWatcher} from "./file-watcher"
import {injector} from "./injector"

export class Main {

  constructor(private readonly fileWatcher: FileWatcher) {
    console.log("[Info]", "Starting App")
  }

  async start() {
    console.log("Main#start", "Starting File Watcher")
    try {
      await this.fileWatcher.start()
    } catch (e) {
      console.error("[Fatal]", "Main#start", "Something bad happened!", e)
    }
  }
}


const fileWatcher = injector.get(FileWatcher)

const promise = new Main(fileWatcher).start()
promise.then(() => console.log("Application Completed. Goodbye."))
