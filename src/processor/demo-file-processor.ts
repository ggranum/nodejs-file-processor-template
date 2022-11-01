import * as crypto from "crypto"
import * as fs from "fs"
import {ProcessorOutput} from "../file-watcher/model/processor-output.model"
import {FileInfo} from "../util/io/file-info"
import {FileProcessor} from "./file-processor"

export class DemoFileProcessor extends FileProcessor {


  acceptPath(fileInfo: FileInfo): boolean {
    return true
  }

  async process(info: FileInfo): Promise<ProcessorOutput[]> {
    // do stuff with file contents here.
    const contents = fs.readFileSync(info.fullPath, {encoding: "UTF8"})
    const lines = contents.split("\n")
    console.log("FileProcessor#process", "found: " + lines.length + " lines in file contents")

    const fd = fs.createReadStream(info.fullPath)
    const hash = crypto.createHash("sha256")
    hash.setEncoding("hex")
    fd.on("end", () => {
      hash.end()
      let hex = hash.read()
      console.log("File has sha256 of: ", hex)
    })
    fd.pipe(hash);
    return [{content: lines.join("\n")}]
  }
}
