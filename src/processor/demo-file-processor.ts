import {ProcessorOutput} from "../file-watcher/model/processor-output.model"
import {FileInfo} from "../util/io/file-info"
import {FileProcessor} from "./file-processor"

export class DemoFileProcessor extends FileProcessor {


  acceptPath(fileInfo: FileInfo): boolean {
    return true
  }

  async process(info: FileInfo, contents: string): Promise<ProcessorOutput[]> {
    // do stuff with file contents here.
    const lines = contents.split("\n")
    console.log("FileProcessor#process", "found: " + lines.length + " lines in file contents")
    return [{content: lines.join("\n")}]
  }
}
