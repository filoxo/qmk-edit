import * as inquirer from "inquirer";
import * as SearchBox from "inquirer-search-list";

inquirer.registerPrompt("search-list", SearchBox);

export default inquirer.prompt;
