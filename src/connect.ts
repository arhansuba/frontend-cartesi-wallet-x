

import { JsonRpcProvider, Provider } from "@ethersproject/providers";
import { ethers, Signer } from "ethers";
import { Argv } from "yargs";

export interface Args {
    rpc: string;
    mnemonic?: string;
    accountIndex: number;
}

const HARDHAT_DEFAULT_MNEMONIC =
    "test test test test test test test test test test test junk";

const HARDHAT_DEFAULT_RPC_URL = "http://localhost:8545";

/**
 * Validator for mnemonic value
 * @param value mnemonic words separated by space
 * @returns true if valid, false if invalid
 */
const mnemonicValidator = (value: string) => {
    try {
        ethers.Wallet.fromMnemonic(value);
        return true;
    } catch (e) {
        return "Invalid mnemonic";
    }
};

/**
 * Builder for provider connection
 * @param yargs yargs instance
 * @param transactional indicate if will need to sign transactions, hence MNEMONIC is required
 * @returns Argv instance with all options
 */
export const builder = <T>(
    yargs: Argv<T>,
    transactional: boolean = false
): Argv<Args & T> => {
    return yargs
        .option("rpc", {
            describe: "JSON-RPC provider URL",
            type: "string",
            default: process.env.RPC_URL || HARDHAT_DEFAULT_RPC_URL,
        })
        .option("mnemonic", {
            describe: "Wallet mnemonic",
            type: "string",
            default: process.env.MNEMONIC || HARDHAT_DEFAULT_MNEMONIC,
            demandOption: transactional, // required if need to send transactions
        })
        .option("accountIndex", {
            describe: "Account index from mnemonic",
            type: "number",
            default: 0,
        });
};

export type Connection = {
    provider: Provider;
    signer?: Signer;
};

/**
 * Connect to a JSON-RPC provider and return a signer or provider
 * @param rpc JSON-RPC provider URL
 * @param mnemonic optional mnemonic to sign transactions
 * @param accountIndex account index of mnemonic (default to 0)
 * @returns signer if mnemonic is provided, provider otherwise
 */
export const connect = (
    rpc: string,
    mnemonic?: string,
    accountIndex?: number
): Connection => {
    // connect to JSON-RPC provider
    const provider = new JsonRpcProvider(rpc);

    // create signer to be used to send transactions
    const signer = mnemonic
        ? ethers.Wallet.fromMnemonic(
              mnemonic,
              `m/44'/60'/0'/0/${accountIndex ?? 0}`
          ).connect(provider)
        : undefined;

    return {
        provider,
        signer,
    };
};
