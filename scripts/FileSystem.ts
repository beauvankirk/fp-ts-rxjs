import * as TE from 'fp-ts/lib/TaskEither'
import { flow } from 'fp-ts/lib/function'
import * as fs from 'fs'
import G from 'glob'

export interface FileSystem {
  readonly readFile: (path: string) => TE.TaskEither<Error, string>
  readonly writeFile: (path: string, content: string) => TE.TaskEither<Error, void>
  readonly copyFile: (from: string, to: string) => TE.TaskEither<Error, void>
  readonly glob: (pattern: string) => TE.TaskEither<Error, ReadonlyArray<string>>
  readonly mkdir: (path: string) => TE.TaskEither<Error, void>
  readonly moveFile: (from: string, to: string) => TE.TaskEither<Error, void>
}
// type ReadFileCB = (err: NodeJS.ErrnoException | null, data: string) => void
type EncodingOptions = { encoding: BufferEncoding; flag?: string | undefined }
// const utf8String: BufferEncoding = 'utf8'
// const readFile2 = (path: string, encoding: BufferEncoding, cb: ReadFileCB) => 
//     fs.readFile(path, { encoding: encoding },cb)
const readFile = 
  TE.taskify<fs.PathOrFileDescriptor, EncodingOptions, NodeJS.ErrnoException, string>(fs.readFile)
const writeFile = TE.taskify<fs.PathLike, string, NodeJS.ErrnoException, void>(fs.writeFile)
const copyFile = TE.taskify<fs.PathLike, fs.PathLike, NodeJS.ErrnoException, void>(fs.copyFile)
const glob = TE.taskify<string, Error, ReadonlyArray<string>>(G)
const mkdirTE = TE.taskify(fs.mkdir)
const moveFile = TE.taskify<fs.PathLike, fs.PathLike, NodeJS.ErrnoException, void>(fs.rename)

export const fileSystem: FileSystem = {
  readFile: (path) => readFile(path, { encoding: 'utf8'} ),
  writeFile,
  copyFile,
  glob,
  mkdir: flow(
    mkdirTE,
    TE.map(() => undefined)
  ),
  moveFile
}