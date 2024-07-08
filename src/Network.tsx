

import { FC } from "react";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import configFile from "./config/config.json";
import {Button, Select, Box, Badge, Spacer, Heading, Text, Stack } from "@chakra-ui/react"

const config: any = configFile;

export const Network: FC = () => {
    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
    const [{ chains, connectedChain, settingChain }, setChain] = useSetChain();

    return (
        <Box>
            {!wallet && 
            <Box mt='20' alignContent={"center"}>
            <Stack>
            <Heading>Welcome to Cartesi Wallet dApp! 💰</Heading>
            <Text color={'grey'}>
                Assets are paramount for the functioning of dApps on-chain. This web interface will guide you on how to deposit and withdraw assets from a Cartesi rollups dApp. Play around and you'll learn a few tricks on how to build wallets for dApp chains. 🚀
            </Text>
            <Button
                onClick={() =>
                    connect()
                }
            >
                {connecting ? "Connecting" : "Connect"}
            </Button>
            </Stack>
            </Box>
            }
            {wallet && (
                <Box display='flex' w='100%' ml='2' mt='2' alignItems='baseline'>
                   {/* <label><Badge>Network</Badge></label> */}
                    {settingChain ? (
                        <span>Switching chain...</span>
                    ) : (
                        <Select size='xs' width='auto'
                            onChange={({ target: { value } }) => {
                                if (config[value] !== undefined) {
                                    setChain({ chainId: value })
                                } else {
                                    alert("No deploy on this chain")
                                }
                                }
                            }
                            value={connectedChain?.id}
                        >
                            {chains.map(({ id, label }) => {
                                return (
                                    <option key={id} value={id}>
                                        {label}
                                    </option>
                                );
                            })}
                        </Select>
                    )}
                    <Spacer />
                    <Box alignContent='right'>
                    <Button marginRight={'20px'} size='xs' onClick={() => disconnect(wallet)}>
                    ✂️ Disconnect Wallet
                    </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
};
