import {FileInfo} from "../util/io/file-info"
import {FileProcessor} from "./file-processor"

export class CustomFileProcessor extends FileProcessor {

  /**
   * Return true if the file or directory represented by the provided fileInfo should be included for processing.
   * If the provided value is a directory and true is returned,
   * the contents of the directory will be scanned as well.
   */
  acceptPath(fileInfo: FileInfo): boolean {
    return true //fileInfo.stats.isFile()
  }

  async process(info: FileInfo, contents: string): Promise<string> {
    // do stuff with file contents here.
    const lines = contents.split("\n")
    console.log("FileProcessor#process", "found: " + lines.length + " lines in file contents")
    return lines.join("\n")
  }

  getOutputFileName(info: FileInfo): string {
    return info.name + '.out'
  }


}
