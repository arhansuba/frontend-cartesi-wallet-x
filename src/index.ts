

import yargs from "yargs";

// parse command line
yargs
    .version()
    .commandDir("commands", { extensions: ["js", "ts"] })
    .strict().argv;
