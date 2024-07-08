import { ethers } from 'ethers';
import { getWalletSigner } from '../utils/walletUtils';
import localhostAddresses from '../../deployments/localhost.json';
import paymentArtifact from '../../artifacts/contracts/PaymentContract.json';

// Interface for the PaymentService
interface PaymentServiceInterface {
  deposit(tokenAddress: string, amount: ethers.BigNumber): Promise<ethers.providers.TransactionResponse>;
  withdraw(tokenAddress: string, amount: ethers.BigNumber): Promise<ethers.providers.TransactionResponse>;
  getTransactionHistory(address: string): Promise<Transaction[]>;
}

// Transaction interface
interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: ethers.BigNumber;
  timestamp: number;
}

class PaymentService implements PaymentServiceInterface {
  private provider: ethers.providers.Web3Provider;
  private signer: ethers.Signer;
  private paymentContract: ethers.Contract;

  constructor() {
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.signer = this.provider.getSigner();
    this.paymentContract = new ethers.Contract(
      localhostAddresses.PaymentContract,
      paymentArtifact.abi,
      this.signer
    );
  }

  // Deposit function
  public async deposit(tokenAddress: string, amount: ethers.BigNumber): Promise<ethers.providers.TransactionResponse> {
    try {
      const tx = await this.paymentContract.deposit(tokenAddress, amount);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Deposit error:', error);
      throw new Error('Deposit failed');
    }
  }

  // Withdraw function
  public async withdraw(tokenAddress: string, amount: ethers.BigNumber): Promise<ethers.providers.TransactionResponse> {
    try {
      const tx = await this.paymentContract.withdraw(tokenAddress, amount);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Withdraw error:', error);
      throw new Error('Withdrawal failed');
    }
  }

  // Get transaction history function
  public async getTransactionHistory(address: string): Promise<Transaction[]> {
    try {
      const filter = this.paymentContract.filters.Transfer(address, null);
      const events = await this.paymentContract.queryFilter(filter);
      const transactions: Transaction[] = events.map((event) => ({
        hash: event.transactionHash,
        from: event.args?.from,
        to: event.args?.to,
        value: event.args?.value,
        timestamp: event.args?.timestamp.toNumber(),
      }));
      return transactions;
    } catch (error) {
      console.error('Get transaction history error:', error);
      throw new Error('Failed to get transaction history');
    }
  }
}

export default new PaymentService();
