import { Command } from "@oclif/command";
import { getPaths, getFileContents } from "../utils";
import prompt from "../prompt";

export default class Features extends Command {
  static description = "Edit features and their options";

  static examples = [`$ qmk-edit features [KEYBOARD_NAME:KEYMAP_NAME]`];

  static args = [
    {
      name: "keyboard",
      required: false,
      description: "output file",
      parse: (input: string) => {
        const [keyboard, keymap = "default"] = input.split(":");
        return [keyboard, keymap];
      },
    },
  ];

  async run() {
    const { args } = this.parse(Features);
    const [keyboard, keymap] = args.keyboard;
    const paths = await getPaths(keyboard, keymap);
    const features = await this._getFeatures(
      paths["keyboard/rules.mk"],
      paths["keymap/rules.mk"]
    );

    const response = await prompt([
      {
        type: "search-list",
        message: "Select a feature to modify",
        name: "feature",
        choices: Object.keys(features),
        required: true,
      },
      {
        type: "list",
        message: "Edit BOOTMAGIC_ENABLE",
        name: "BOOTMAGIC_ENABLE",
        default: features["BOOTMAGIC_ENABLE"],
        choices: ["no", "lite", "full"],
        when: (answers) => answers.feature === "BOOTMAGIC_ENABLE",
      },
      {
        type: "list",
        message: "Edit MOUSEKEY_ENABLE",
        name: "MOUSEKEY_ENABLE",
        default: features["MOUSEKEY_ENABLE"],
        choices: ["no", "yes"],
        when: (answers) => answers.feature === "MOUSEKEY_ENABLE",
      },
    ]);

    console.log(response);
  }

  async _getFeatures(keyboardRules, keymapRules) {
    keyboardRules = await getFileContents(keyboardRules);
    // keymapRules = await getFileContents(keymapRules);
    const parsedKeyboardRules = keyboardRules
      .split("\n")
      .map((r) => r.split("#")[0].replace(/\s+/g, "")) // remove C comments
      .filter(Boolean)
      .map((r) => r.split("="));
    return Object.fromEntries(parsedKeyboardRules);
  }
}
