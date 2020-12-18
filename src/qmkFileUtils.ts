import { promises as fs, constants } from "fs";
import { join, resolve } from "path";
import * as pickBy from "lodash.pickby";

async function fileExists(file: string) {
  const result = await fs
    .access(file, constants.F_OK | constants.R_OK)
    .then(() => true)
    .catch(() => false);
  return result;
}

enum QmkFile {
  KeyboardH,
  KeyboardC,
  ConfigH,
  KeymapC,
  KeyboardRulesMk,
  KeymapRulesMk,
}

let KEYBOARD;
let KEYMAP;

export function setCurrentWorkingBoard(keyboard: string, keymap: string) {
  KEYBOARD = keyboard;
  KEYMAP = keymap;
}

function pathTo(qmkFile: QmkFile): string {
  const ROOT = "../qmk_firmware/keyboards"; // TODO: make configurable
  const keyboardPath = join(ROOT, KEYBOARD);
  const keymapPath = join(keyboardPath, "keymaps", KEYMAP);

  switch (qmkFile) {
    // Config files
    case QmkFile.KeyboardH:
      return resolve(join(keyboardPath, `${KEYBOARD}.h`));
    case QmkFile.KeyboardC:
      return resolve(join(keyboardPath, `${KEYBOARD}.c`));
    case QmkFile.ConfigH:
      return resolve(join(keymapPath, `config.h`));
    case QmkFile.KeymapC:
      return resolve(join(keymapPath, `keymap.c`));
    // Features files
    case QmkFile.KeyboardRulesMk:
      return resolve(join(keyboardPath, `rules.mk`));
    case QmkFile.KeymapRulesMk:
      return resolve(join(keymapPath, `rules.mk`));
  }
}

export async function getQmkFile(path: string): Promise<string[]> {
  try {
    const contents = await fs.readFile(path, "utf8");
    return contents
      .split("\n")
      .map(
        (r) =>
          r
            .split("#")[0] // remove C comments
            .replace(/\s+/g, "") // remove extra whitespace
      )
      .filter(Boolean);
  } catch (e) {
    return [];
  }
}

async function getFeatures(
  file: QmkFile.KeyboardRulesMk | QmkFile.KeymapRulesMk
) {
  return await getQmkFile(pathTo(file)).then((lines) =>
    Object.fromEntries(lines.map((r) => r.split("=")))
  );
}

export async function getQmkFeatures(): Promise<{ [key: string]: string }> {
  const keyboardFeatures = await getFeatures(QmkFile.KeyboardRulesMk);
  const keymapFeatures = await getFeatures(QmkFile.KeymapRulesMk);
  return {
    ...keyboardFeatures,
    ...keymapFeatures,
  };
}

export async function setQmkFeatures(updatedFeatures: {
  [key: string]: string;
}) {
  // reading them again in case they changed since the cli started
  // these need to be separate in order to distinguish which file to write to
  const keyboardFeatures = await getFeatures(QmkFile.KeyboardRulesMk);
  const keymapFeatures = await getFeatures(QmkFile.KeymapRulesMk);
  const changesToKbFeatures = pickBy(
    updatedFeatures,
    /* is in keyboard features AND is not in keymap features */
    (v, k) => !!keyboardFeatures[k] && !keymapFeatures[k]
  );
  const changesToKmFeatures = pickBy(
    updatedFeatures,
    /* is not in keyboard features */
    (v, k) => !keyboardFeatures[k]
  );

  let keyboardRules = await fs
    .readFile(pathTo(QmkFile.KeyboardRulesMk), "utf8")
    .catch(() => "");
  let keymapRules = await fs
    .readFile(pathTo(QmkFile.KeymapRulesMk), "utf8")
    .catch(() => "");

  for (let feature in changesToKbFeatures) {
    keyboardRules = writeRuleToContents(
      keyboardRules,
      feature,
      changesToKbFeatures[feature]
    );
  }
  for (let feature in changesToKmFeatures) {
    keymapRules = writeRuleToContents(
      keymapRules,
      feature,
      changesToKmFeatures[feature]
    );
  }

  await writeToQmkFile(QmkFile.KeyboardRulesMk, keyboardRules);
  await writeToQmkFile(QmkFile.KeymapRulesMk, keymapRules);
}

function writeRuleToContents(contents, feature, value) {
  const featureRegex = new RegExp(`${feature}\\s*=\\s*\\w*`);
  const updatedRule = `${feature} = ${value}`;
  if (contents.match(featureRegex)) {
    contents = contents.replace(featureRegex, updatedRule);
  } else {
    contents += "\n" + updatedRule;
  }
  return contents;
}

async function writeToQmkFile(file: QmkFile, contents: string) {
  return !!contents && fs.writeFile(pathTo(file), contents);
}
