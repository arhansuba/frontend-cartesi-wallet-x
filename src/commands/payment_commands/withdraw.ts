import { ethers } from 'ethers';
import { useAccountStore } from '../../stores/account'; // Adjust the path as per your project structure
import { CartesiWallet } from 'cartesi-wallet'; // Assuming you have a Cartesi wallet library imported

// Function to handle withdrawal of funds
export async function withdraw(amount: number, token: string): Promise<boolean> {
    const store = useAccountStore(); // Assuming useAccountStore is a hook to get account info

    // Check if user is authenticated and has a Cartesi wallet
    if (!store.account || !store.cartesiWallet) {
        throw new Error('User is not authenticated or does not have a Cartesi wallet.');
    }

    try {
        // Initiate withdrawal transaction using Cartesi wallet
        const wallet = new CartesiWallet(store.cartesiWallet); // Initialize Cartesi wallet
        const tx = await wallet.withdraw(amount, token); // Perform withdrawal operation

        // Wait for transaction to be confirmed
        const receipt = await tx.wait();
        console.log('Withdrawal successful:', receipt);

        // Update user interface or state after successful withdrawal
        return true;
    } catch (error) {
        console.error('Error while withdrawing funds:', error);
        throw new Error('Failed to withdraw funds. Please try again.');
    }
}
