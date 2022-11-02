import {expect, jest, test} from '@jest/globals';
import {FileWatcher} from "../../src/file-watcher/file-watcher"
import {WatcherConfiguration} from "../../src/file-watcher/watcher-configuration"
import {DemoFileProcessor} from "../../src/processor/demo-file-processor"
import {LogLevel} from "../../src/util/logging/log-level"


/**
 * Admittedly sad testing. But it's a stub. Run with 'npm run test' or via WebStorm's runners.
 */
describe('File Watcher Basic Tests', () => {
  let watcher: FileWatcher = new FileWatcher(new WatcherConfiguration({
    errorDirPath            : "",
    flattenFileTree         : false,
    logLevel                : LogLevel.Info,
    maxSimultaneousProcesses: 1,
    outputDirPath           : "",
    processDirPath          : "",
    recursive               : false,
    allowFileOverWrites     : false
  }), new DemoFileProcessor());

  beforeAll(async () => {
  });


  it('accepts all files when we use the demo processor', () => {
    let files = watcher.determineFilesToProcess("./tests/unit");
    expect(files.length).toBe(2);
  })


  it('Accepts files in child folders when we use the demo processor (and does not include folders)', () => {
    let files = watcher.determineFilesToProcess("./tests");
    expect(files.length).toBe(2);
  })
})
