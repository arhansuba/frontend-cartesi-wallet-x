

import { Argv } from "yargs";

export const command = "erc20 <command>";
export const desc = "Operations with ERC-20 tokens";

export const builder = (yargs: Argv) =>
    yargs.commandDir("erc20_commands", { extensions: ["js", "ts"] });

export const handler = () => {};
