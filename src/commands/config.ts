import { Command, flags } from "@oclif/command";

export default class Config extends Command {
  static description = "Edit config.h values";

  static examples = [`$ qmk-edit config [KEYBOARD_NAME/KEYMAP_NAME]`];

  static args = [{ name: "file" }];

  async run() {
    const { args, flags } = this.parse(Config);

    const name = flags.name ?? "world";
    this.log(`hello ${name} from ./src/commands/hello.ts`);
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`);
    }
  }
}
