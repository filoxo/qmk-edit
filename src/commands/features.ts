import { Command } from "@oclif/command";
import { getPaths, getQmkFile } from "../utils";
import prompt from "../prompt";

// https://docs.qmk.fm/#/config_options?id=the-rulesmk-file
// https://docs.qmk.fm/#/config_options?id=feature-options
// https://docs.qmk.fm/#/getting_started_make_guide?id=rulesmk-options

const SUPPORTED_FEATURES = {
  // API_SYSEX_ENABLE: ["no", "yes"],
  AUDIO_ENABLE: ["no", "yes"],
  BACKLIGHT_ENABLE: ["no", "yes"],
  BLUETOOTH: ["no", "yes"],
  BOOTMAGIC_ENABLE: ["no", "lite", "full"],
  COMBO_ENABLE: ["no", "yes"],
  COMMAND_ENABLE: ["no", "yes"],
  CONSOLE_ENABLE: ["no", "yes"],
  CUSTOM_MATRIX: ["no", "yes"],
  DEBOUNCE_TYPE: ["no", "yes"],
  EXTRAKEY_ENABLE: ["no", "yes"],
  FAUXCLICKY_ENABLE: ["no", "yes"],
  KEY_LOCK_ENABLE: ["no", "yes"],
  LEADER_ENABLE: ["no", "yes"],
  MIDI_ENABLE: ["no", "yes"],
  MOUSEKEY_ENABLE: ["no", "yes"],
  NKRO_ENABLE: ["no", "yes"],
  NO_USB_STARTUP_CHECK: ["no", "yes"],
  RGBLIGHT_ENABLE: ["no", "yes"],
  SLEEP_LED_ENABLE: ["no", "yes"],
  SPLIT_KEYBOARD: ["no", "yes"],
  // SPLIT_TRANSPORT: ["no", "yes"],  
  STENO_ENABLE: ["no", "yes"],
  // UCIS_ENABLE: ["no", "yes"],
  UNICODE_ENABLE: ["no", "yes"],
  UNICODEMAP_ENABLE: ["no", "yes"],
  // VARIABLE_TRACE: ["no", "yes"],
  VELOCIKEY_ENABLE: ["no", "yes"],
  WAIT_FOR_USB: ["no", "yes"],
};

export default class Features extends Command {
  static description = "Edit features and their options";

  static examples = [`$ qmk-edit features [KEYBOARD_NAME:KEYMAP_NAME]`];

  static args = [
    {
      name: "keyboard",
      required: false,
      description: "output file",
    },
  ];

  async run() {
    const [keyboard, keymap = "default"] = this.parse(Features).args.keyboard.split(":");
    const paths = await getPaths(keyboard, keymap);
    const keyboardFeatures = await this.parseFeatures(paths["keyboard/rules.mk"]);
    const keymapFeatures = await this.parseFeatures(paths["keymap/rules.mk"]);
    const featuresPrompts = this.createSupportedFeaturesPrompts({
      ...keyboardFeatures,
      ...keymapFeatures,
    });
    const changes = await prompt([
      {
        type: "search-list",
        message: "Select a feature to modify",
        name: "feature",
        choices: Object.keys(SUPPORTED_FEATURES),
        required: true,
      },
      ...featuresPrompts,
    ]);

    console.log(changes);
  }

  async parseFeatures(file: string): Promise<{[key: string]: string}> {
    if(!file) return Promise.resolve({})
    const features = await getQmkFile(file);
    return Object.fromEntries(features.map((r) => r.split("=")));
  }

  createSupportedFeaturesPrompts(features) {
    const prompts = Object.entries(SUPPORTED_FEATURES).map(
      ([featureName, choices]) => ({
        type: "list",
        message: `Edit ${featureName}`,
        name: featureName,
        default: features[featureName],
        choices,
        when: (answers) => answers.feature === featureName,
      })
    );
    return prompts;
  }
}
