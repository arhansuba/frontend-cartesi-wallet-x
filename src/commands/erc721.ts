

import { Argv } from "yargs";

export const command = "erc721 <command>";
export const desc = "Operations with ERC-721 tokens";

export const builder = (yargs: Argv) =>
    yargs.commandDir("erc721_commands", { extensions: ["js", "ts"] });

export const handler = () => {};
