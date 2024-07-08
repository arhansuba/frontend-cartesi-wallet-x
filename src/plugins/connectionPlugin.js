import { ethers } from 'ethers';

export default {
  install: (app, options) => {
    let provider, signer, account;

    // Function to connect the wallet
    const connect = async () => {
      try {
        // Check if MetaMask is available
        if (typeof window.ethereum === 'undefined') {
          throw new Error('MetaMask not found!');
        }

        // Network configuration (example: Local Testnet)
        const networkData = {
          chainId: '0x7a69',
          chainName: 'Local Testnet',
          rpcUrls: ['http://127.0.0.1:8545/'],
          nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
          },
        };

        // Add the network to MetaMask
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [networkData],
        });

        // Switch to the added network
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x7a69' }],
        });

        // Initialize provider and signer
        provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        signer = provider.getSigner();
        account = accounts[0];

        return {
          provider,
          signer,
          account,
        };
      } catch (error) {
        console.error('Error connecting wallet:', error);
        return { error: 'Error connecting wallet!' };
      }
    };

    // Function to disconnect the wallet
    const disconnect = async () => {
      provider = undefined;
      signer = undefined;
      account = undefined;
      return;
    };

    // Getters for provider, signer, and account
    const getWalletProvider = () => provider;
    const getWalletSigner = () => signer;
    const getWalletAccount = () => account;

    // Provide functions to the Vue app
    app.provide('connectWallet', connect);
    app.provide('disconnectWallet', disconnect);
    app.provide('getWalletProvider', getWalletProvider);
    app.provide('getWalletSigner', getWalletSigner);
    app.provide('getWalletAccount', getWalletAccount);
  },
};
