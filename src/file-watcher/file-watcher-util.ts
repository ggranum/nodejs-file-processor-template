import * as fs from 'fs'
import * as LineReader from 'line-reader'

export interface FileDetails {
  path: string
  fileName: string
  lastModified: number
  lineCount: number
}

export class FileWatcherUtil {

  static getFileInfo(path: string): Promise<FileDetails> {
    return new Promise((resolve, reject) => {
      const fileInfo: FileDetails = {
        path        : path,
        fileName    : FileWatcherUtil.getFileName(path),
        lineCount   : 0,
        lastModified: FileWatcherUtil.getLastModified(path)
      }
      LineReader.eachLine(path, (line, last) => {
        let done = last || fileInfo.lineCount++ > 10000
        if (done) {
          resolve(fileInfo)
        }
        return !done
      })
    })
  }

  private static getFileName(path: string) {
    let idx = path.lastIndexOf('/')
    idx = idx >= 0 ? idx : 0
    return path.substring(idx + 1)
  }

  private static getLastModified(path: string): number {
    //  stats.mtimeMs
    const stat = fs.statSync(path)
    return stat.mtimeMs
  }

}
