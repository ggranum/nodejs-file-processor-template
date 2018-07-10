import {Provider, ReflectiveInjector} from "injection-js"
import "reflect-metadata"
import {FileProcessor} from "../processor/file-processor"
import {CustomFileProcessor} from "../processor/custom-file-processor"
import {Perf} from "../util/logging/perf"

Perf.enabled = true

const provide: Provider[] = [
  {provide: FileProcessor, useClass: CustomFileProcessor},
]

const injector = ReflectiveInjector.resolveAndCreate(provide)

export {injector}
