import {FileInfo} from "../util/io/file-info"

export abstract class FileProcessor {

  /**
   * Return true if the file or directory represented by the provided fileInfo should be included for processing.
   * If the provided value is a directory and true is returned,
   * the contents of the directory will be scanned as well.
   */
  abstract acceptPath(fileInfo: FileInfo): boolean


  /**
   * do stuff with file contents here.
   * @param info
   * @param contents
   */
  abstract async process(info: FileInfo, contents: string): Promise<string>


  abstract getOutputFileName(info: FileInfo): string


}
