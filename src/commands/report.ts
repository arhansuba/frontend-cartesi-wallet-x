

import { Argv } from "yargs";

export const command = "report <command>";
export const desc = "Operations with reports";

export const builder = (yargs: Argv) =>
    yargs.commandDir("report_commands", { extensions: ["js", "ts"] });

export const handler = () => {};
