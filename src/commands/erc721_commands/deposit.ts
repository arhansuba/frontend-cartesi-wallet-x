
import { IERC721__factory } from "@cartesi/rollups";
import { Argv } from "yargs";
import {
    connect,
    Args as ConnectArgs,
    builder as connectBuilder,
} from "../../connect";
import {
    rollups,
    Args as RollupsArgs,
    builder as rollupsBuilder,
} from "../../rollups";
import { findInputAddedInfo } from "../util";


interface Args extends ConnectArgs, RollupsArgs {
    erc721?: string;
    to: string;
    tokenId: string;
}

const safeTransferFrom = "safeTransferFrom(address,address,uint256)";

export const command = "deposit";
export const describe = "Deposit ERC-721 tokens to a DApp";



export const builder = (yargs: Argv<Args>) => {
    const connectArgs = connectBuilder(yargs, true);
    const rollupsArgs = rollupsBuilder(connectArgs);

    return rollupsArgs
        .option("erc721", {
            describe: "ERC-721 contract address",
            type: "string",
        })
        .option("tokenId", {
            demandOption: true,
            type: "string",
            describe: "The ID of the token being transfered",
        });
};

export const handler = async (args: Args) => {
    const { rpc, mnemonic, accountIndex, erc721, tokenId } = args;

    // connect to provider
    console.log(`connecting to ${rpc}`);
    const { provider, signer } = connect(rpc, mnemonic, accountIndex);

    const network = await provider.getNetwork();
    console.log(`connected to chain ${network.chainId}`);

    // connect to rollups
    const {dapp, inputContract, erc721Portal, deployment } = await rollups(
        network.chainId,
        signer || provider,
        args
    );

    console.log(`depositing token ${tokenId}...`);

    // get ERC-721 contract address
    const erc721address = erc721 ?? deployment?.contracts["SimpleERC721"]?.address;
    if (!erc721address) {
        throw new Error(
            `cannot resolve ERC-721 address for chain ${network.chainId}`
        );
    }
    console.log(`using ERC-721 token contract at "${erc721address}"`);
    const erc721Contract = IERC721__factory.connect(
        erc721address,
        erc721Portal.signer
    );

    // send safeTransferFrom transaction
    const senderAddress = await erc721Portal.signer.getAddress();
    console.log(`using account "${senderAddress}"`);

    //Set the ERC721Portal as the new controller
    const approve = await erc721Contract.approve(erc721Portal.address,tokenId)

    await approve.wait();

    //Deposit token through portal
    const tx = await erc721Portal.depositERC721Token(
        erc721address,
        dapp,
        tokenId,
        "0x",
        "0x"
    )


    console.log(`transaction: ${tx.hash}`);
    console.log("waiting for confirmation...");

    // print receipt info
    const receipt = await tx.wait();

    // find added input information from transaction receipt
    const inputAddedInfo = findInputAddedInfo(receipt, inputContract);
    console.log(
        `deposit successfully executed as input ${inputAddedInfo.input_index}`
    );
};
