import { ethers } from 'ethers';

// Define the Cartesi Payment Contract ABI and Address
const PAYMENT_CONTRACT_ABI: ethers.ContractInterface = [
  // Add your ABI here
];

const PAYMENT_CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS';

export class WalletUtil {
  private provider: ethers.providers.Web3Provider;
  private signer: ethers.Signer;
  private paymentContract: ethers.Contract;

  constructor() {
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.signer = this.provider.getSigner();
    this.paymentContract = new ethers.Contract(
      PAYMENT_CONTRACT_ADDRESS,
      PAYMENT_CONTRACT_ABI,
      this.signer
    );
  }

  /**
   * Connect to the user's wallet and return the address.
   */
  public async connectWallet(): Promise<string> {
    await this.provider.send('eth_requestAccounts', []);
    return await this.signer.getAddress();
  }

  /**
   * Get the user's ETH balance.
   */
  public async getEthBalance(): Promise<string> {
    const address = await this.signer.getAddress();
    const balance = await this.provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  }

  /**
   * Send ETH to a specific address.
   * @param to Address to send ETH to.
   * @param amount Amount of ETH to send.
   */
  public async sendEth(to: string, amount: string): Promise<ethers.providers.TransactionResponse> {
    const tx = await this.signer.sendTransaction({
      to,
      value: ethers.utils.parseEther(amount),
    });
    return tx;
  }

  /**
   * Get the balance of a specific ERC20 token.
   * @param tokenAddress Address of the ERC20 token contract.
   */
  public async getTokenBalance(tokenAddress: string): Promise<string> {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      [
        'function balanceOf(address owner) view returns (uint256)',
        'function decimals() view returns (uint8)',
      ],
      this.provider
    );
    const address = await this.signer.getAddress();
    const balance = await tokenContract.balanceOf(address);
    const decimals = await tokenContract.decimals();
    return ethers.utils.formatUnits(balance, decimals);
  }

  /**
   * Approve the payment contract to spend a specific amount of a token.
   * @param tokenAddress Address of the ERC20 token contract.
   * @param amount Amount of tokens to approve.
   */
  public async approveToken(tokenAddress: string, amount: string): Promise<ethers.providers.TransactionResponse> {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      [
        'function approve(address spender, uint256 amount) returns (bool)',
      ],
      this.signer
    );
    const decimals = await tokenContract.decimals();
    const tx = await tokenContract.approve(
      PAYMENT_CONTRACT_ADDRESS,
      ethers.utils.parseUnits(amount, decimals)
    );
    return tx;
  }

  /**
   * Deposit tokens into the payment contract.
   * @param amount Amount of tokens to deposit.
   */
  public async depositTokens(amount: string): Promise<ethers.providers.TransactionResponse> {
    const tx = await this.paymentContract.depositTokens(
      ethers.utils.parseUnits(amount, 18) // Assuming the token has 18 decimals
    );
    return tx;
  }

  /**
   * Withdraw tokens from the payment contract.
   * @param amount Amount of tokens to withdraw.
   */
  public async withdrawTokens(amount: string): Promise<ethers.providers.TransactionResponse> {
    const tx = await this.paymentContract.withdrawTokens(
      ethers.utils.parseUnits(amount, 18) // Assuming the token has 18 decimals
    );
    return tx;
  }

  /**
   * Get the current allowance for the payment contract to spend a specific token.
   * @param tokenAddress Address of the ERC20 token contract.
   */
  public async getAllowance(tokenAddress: string): Promise<string> {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      [
        'function allowance(address owner, address spender) view returns (uint256)',
      ],
      this.provider
    );
    const address = await this.signer.getAddress();
    const allowance = await tokenContract.allowance(address, PAYMENT_CONTRACT_ADDRESS);
    return ethers.utils.formatUnits(allowance, 18); // Assuming the token has 18 decimals
  }
}
