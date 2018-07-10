import {Stats} from "fs"

export interface FileInfo {
  name: string;
  path: string
  stats: Stats
}
