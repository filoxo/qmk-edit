import { Command } from "@oclif/command";
import { setCurrentWorkingBoard, getQmkFeatures, setQmkFeatures } from "../qmkFileUtils";
import prompt from "../prompt";
import * as pickBy from 'lodash.pickby';

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
    },
  ];

  async run() {
    const [keyboard, keymap = "default"] = this.parse(Features).args.keyboard.split(":");
    setCurrentWorkingBoard(keyboard, keymap)
    const currentFeatures = await getQmkFeatures()
    const {changes} = await prompt([
      {
        type: 'multi-choice',
        name: 'changes',
        message: 'Change features settings',
        rows: Object.entries(SUPPORTED_FEATURES).map(
          ([featureName, choices]) => ({
            name: featureName,
            default: currentFeatures[featureName],
            choices,
          })
        )
      }
    ])
    const changesToApply = pickBy(changes, (v, k) => v !== undefined && currentFeatures[k] !== v);
    await setQmkFeatures(changesToApply)
    console.log('\nRules updated! ✨⌨️')
  }
}
