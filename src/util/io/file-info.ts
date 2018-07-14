import {Stats} from "fs"

export interface FileInfo {
  fileName: string;
  fullPath: string
  folderPath: string
  stats: Stats
}
