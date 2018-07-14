/**
 * Defines the output of a Processor#process method.
 *
 * If `path` is not specified, the default path will be used, which depends on the configuration. Generally,
 * this means the output will be saved into the configured output directory, with the same file name and tree
 * structure (relative to 'processDir') as the source file.
 *
 * If `path` is specified and is relative ( does not start with '/' ), it will be saved relative to the specified
 * output directory.
 *
 * If `path` is specified and is absolute, it will be used directly.
 */
export interface ProcessorOutput {
  readonly folderPath?: string;
  readonly fileName?: string;
  readonly content: string;
}
