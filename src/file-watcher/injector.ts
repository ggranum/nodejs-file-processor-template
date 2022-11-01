import {Provider, ReflectiveInjector} from "injection-js"
import "reflect-metadata"
import {DemoFileProcessor} from "../processor/demo-file-processor"
import {FileProcessor} from "../processor/file-processor"
import {LogLevel} from "../util/logging/log-level"
import {Perf} from "../util/logging/perf"
import {FileWatcher} from "./file-watcher"
import {WatcherConfiguration} from "./watcher-configuration"

const watcherConfig = new WatcherConfiguration({
  processDirPath          : "./temp/process",
  errorDirPath            : "./temp/errors",
  outputDirPath           : "./temp/output",
  // Disable archiving by virtue of not setting a path.
  archiveDirPath          : undefined,
  recursive               : true,
  flattenFileTree         : false,
  maxSimultaneousProcesses: 1,
  allowFileOverWrites     : false,
  logLevel                : LogLevel.Trace,
})


const provide: Provider[] = [
  {provide: WatcherConfiguration, useValue: watcherConfig},
  {provide: FileProcessor, useClass: DemoFileProcessor},
  {provide: FileWatcher, useClass: FileWatcher},
]

const injector = ReflectiveInjector.resolveAndCreate(provide)

if (injector.get(WatcherConfiguration).logLevel !== LogLevel.Trace) {
  Perf.enabled = false
}

export {injector}
