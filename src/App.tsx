

import { FC } from "react";
import injectedModule from "@web3-onboard/injected-wallets";
import { init } from "@web3-onboard/react";
import { useState } from "react";

import { GraphQLProvider } from "./GraphQL";
import { Notices } from "./Notices";
import { Transfers } from "./Transfers";
import { Inspect } from "./Inspect";
import { Network } from "./Network";
import { Vouchers } from "./Vouchers";
import { Reports } from "./Reports";
import configFile from "./config.json";
//import "./App.css";
import { Balance } from "./Balance";
import {Heading, Flex, Input, Box, InputGroup, InputLeftAddon, Stack, SimpleGrid} from "@chakra-ui/react"


const config: any = configFile;

const injected: any = injectedModule();
init({
    wallets: [injected],
    chains: Object.entries(config).map(([k, v]: [string, any], i) => ({id: k, token: v.token, label: v.label, rpcUrl: v.rpcUrl})),
    appMetadata: {
        name: "Cartesi Rollups Test DApp",
        icon: "<svg><svg/>",
        description: "Demo app for Cartesi Rollups",
        recommendedInjectedWallets: [
            { name: "MetaMask", url: "https://metamask.io" },
        ],
    },
});

const App: FC = () => {
    const [dappAddress, setDappAddress] = useState<string>("0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C");

    return (
        <SimpleGrid columns={1} marginLeft={'25%'} marginRight={'25%'}>  
        <Network />
        <GraphQLProvider>
            <Stack>
                <Box alignItems='baseline' marginLeft='2' mt='0'>
                    
                <InputGroup size='xs'>
                <InputLeftAddon>
                    Dapp Address
                </InputLeftAddon> 
                <Input 
                    width='auto'
                    size='xs'
                    className="address-textbox"
                    type="text"
                    value={dappAddress}
                    onChange={(e) => setDappAddress(e.target.value)}
                />
                </ InputGroup >
                <br /><br />
                </Box>
            </Stack>
                <br />
                    <Balance />
                    <br /> <br />
                    <Transfers dappAddress={dappAddress} />
                    <br /> <br />
            </GraphQLProvider>
        </SimpleGrid>
    );
};

export default App;
