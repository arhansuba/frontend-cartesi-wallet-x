

import fetch from "cross-fetch";
import path from "path";
import { Argv } from "yargs";
import { hex2str } from "./utils";

interface Args {
    payload: string;
    url: string;
}

export const command = "inspect";
export const describe = "Inspect the state of the DApp";

const DEFAULT_URL = "http://localhost:8080/inspect";

export const builder = (yargs: Argv) => {
    return yargs
        .option("url", {
            describe: "Reader inspect URL",
            type: "string",
            default: DEFAULT_URL,
        })
        .option("payload", {
            describe: "Inspect payload to send",
            type: "string",
            demandOption: true,
        });
};

export const handler = async (args: Args) => {
    const { url, payload } = args;

    const response = await fetch(path.join(url, payload));

    console.log(`HTTP status: ${response.status}`);
    if (response.status == 200) {
        const result = await response.json();
        console.log(`Inspect status: ${JSON.stringify(result.status)}`);
        console.log(
            `Input count: ${JSON.stringify(result.processed_input_count)}`
        );
        console.log(`Reports:`);
        for (let i in result.reports) {
            let payload = result.reports[i].payload;
            console.log(`${i}: ${hex2str(payload)}`);
        }
        if (result.exception_payload) {
            let payload = result.exception_payload;
            console.log(`Exception payload: ${hex2str(payload)}`);
        }
    } else {
        console.log(JSON.stringify(await response.text()));
    }
};
