import {Stats} from "fs"

export interface FileInfo {
  name: string;
  fullPath: string
  folderPath: string
  stats: Stats
}
