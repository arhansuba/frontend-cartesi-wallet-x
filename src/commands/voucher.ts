

import { Argv } from "yargs";

export const command = "voucher <command>";
export const desc = "Operations with vouchers";

export const builder = (yargs: Argv) =>
    yargs.commandDir("voucher_commands", { extensions: ["js", "ts"] });

export const handler = () => {};
