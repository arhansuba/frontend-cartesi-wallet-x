

import { Argv } from "yargs";

export const command = "input <command>";
export const desc = "Operations with inputs";

export const builder = (yargs: Argv) =>
    yargs.commandDir("input_commands", { extensions: ["js", "ts"] });

export const handler = () => {};
