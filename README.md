qmk-edit
========

Edit QMK code directly

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/qmk-edit.svg)](https://npmjs.org/package/qmk-edit)
[![Downloads/week](https://img.shields.io/npm/dw/qmk-edit.svg)](https://npmjs.org/package/qmk-edit)
[![License](https://img.shields.io/npm/l/qmk-edit.svg)](https://github.com/filoxo/qmk-edit/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g qmk-edit
$ qmk-edit COMMAND
running command...
$ qmk-edit (-v|--version|version)
qmk-edit/0.0.0 darwin-x64 node-v12.8.1
$ qmk-edit --help [COMMAND]
USAGE
  $ qmk-edit COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`qmk-edit hello [FILE]`](#qmk-edit-hello-file)
* [`qmk-edit help [COMMAND]`](#qmk-edit-help-command)

## `qmk-edit hello [FILE]`

describe the command here

```
USAGE
  $ qmk-edit hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ qmk-edit hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/filoxo/qmk-edit/blob/v0.0.0/src/commands/hello.ts)_

## `qmk-edit help [COMMAND]`

display help for qmk-edit

```
USAGE
  $ qmk-edit help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_
<!-- commandsstop -->
