import * as inquirer from "inquirer";
import * as MultiChoice from "inquirer-multi-choice";

inquirer.registerPrompt("multi-choice", MultiChoice);

export default inquirer.prompt;
