import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletComponent: React.FC = () => {
    const [account, setAccount] = useState<string>('');

    useEffect(() => {
        const checkWalletConnected = async () => {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                }
            }
        };

        checkWalletConnected();
    }, []);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);

                window.ethereum.on('accountsChanged', (accounts: string[]) => {
                    setAccount(accounts[0]);
                });
            } catch (error) {
                console.error('Error connecting to wallet:', error);
            }
        } else {
            alert('Please install MetaMask!');
        }
    };

    const disconnectWallet = () => {
        setAccount('');
    };

    return (
        <div>
            <div className="fixed top-right m-2 grid grid-rows-2 grid-flow-col gap-2 justify-items-end">
                {!account && (
                    <button className="button-green" onClick={connectWallet}>
                        Connect Wallet
                    </button>
                )}
                {account && (
                    <button className="button-green">
                        {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
                    </button>
                )}
                {/* Uncomment the button below if you want to allow disconnecting the wallet */}
                {/* {account && (
                    <button className="button-green" onClick={disconnectWallet}>
                        Disconnect
                    </button>
                )} */}
            </div>
        </div>
    );
};

export default WalletComponent;
