

import { Argv } from "yargs";

export const command = "notice <command>";
export const desc = "Operations with notices";

export const builder = (yargs: Argv) =>
    yargs.commandDir("notice_commands", { extensions: ["js", "ts"] });

export const handler = () => {};
