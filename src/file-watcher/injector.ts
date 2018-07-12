import {Provider, ReflectiveInjector} from "injection-js"
import "reflect-metadata"
import {DemoFileProcessor} from "../processor/demo-file-processor"
import {FileProcessor} from "../processor/file-processor"
import {LogLevel} from "../util/logging/log-level"
import {Perf} from "../util/logging/perf"
import {FileWatcher} from "./file-watcher"
import {WatcherConfiguration} from "./watcher-configuration"

const provide: Provider[] = [
  {provide: WatcherConfiguration, useClass: WatcherConfiguration},
  {provide: FileProcessor, useClass: DemoFileProcessor},
  {provide: FileWatcher, useClass: FileWatcher},
]

const injector = ReflectiveInjector.resolveAndCreate(provide)

if (injector.get(WatcherConfiguration).logLevel !== LogLevel.Trace) {
  Perf.enabled = false
}

export {injector}
