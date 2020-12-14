import { promises as fs, constants } from "fs";
import { join, resolve } from "path";

async function fileExists(file: string) {
  const result = await fs
    .access(file, constants.F_OK | constants.R_OK)
    .then(() => true)
    .catch(() => false);
  return result;
}

async function resolveFilePath(fileName: string, filePath: string) {
  const exists = await fileExists(filePath);
  return {
    [fileName]: exists ? filePath : null,
  };
}

export async function getPaths(keyboard: string, keymap: string) {
  const ROOT = "../qmk_firmware/keyboards"; // TODO: make configurable
  const keyboardPath = join(ROOT, keyboard);
  const keymapPath = join(keyboardPath, "keymaps", keymap);
  const resolvedPaths = await Promise.all([
    resolveFilePath("keyboard.h", resolve(join(keyboardPath, `${keyboard}.h`))),
    resolveFilePath("keyboard.c", resolve(join(keyboardPath, `${keyboard}.c`))),
    resolveFilePath(
      "keyboard/rules.mk",
      resolve(join(keyboardPath, `rules.mk`))
    ),
    resolveFilePath("config.h", resolve(join(keymapPath, `config.h`))),
    resolveFilePath("keymap.c", resolve(join(keymapPath, `keymap.c`))),
    resolveFilePath("keymap/rules.mk", resolve(join(keymapPath, `rules.mk`))),
  ]);
  const filePaths = Object.assign({}, ...resolvedPaths);
  return filePaths;
}

export async function getFileContents(path: string) {
  return path ? fs.readFile(path, "utf8") : null;
}
