import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface TransactionWidgetProps {
  provider: ethers.providers.Web3Provider;
  account: string;
}

const TransactionWidget: React.FC<TransactionWidgetProps> = ({ provider, account }) => {
  const [balance, setBalance] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [txStatus, setTxStatus] = useState<string>('');

  useEffect(() => {
    const fetchBalance = async () => {
      if (account) {
        const balance = await provider.getBalance(account);
        setBalance(ethers.utils.formatEther(balance));
      }
    };

    fetchBalance();
  }, [account, provider]);

  const handleSendTransaction = async () => {
    if (amount && recipient) {
      const signer = provider.getSigner();
      try {
        setTxStatus('Sending...');
        const tx = await signer.sendTransaction({
          to: recipient,
          value: ethers.utils.parseEther(amount),
        });
        await tx.wait();
        setTxStatus('Transaction Successful!');
        setAmount('');
        setRecipient('');
      } catch (error) {
        console.error('Transaction Error:', error);
        setTxStatus('Transaction Failed');
      }
    } else {
      setTxStatus('Please provide recipient and amount');
    }
  };

  return (
    <div className="transaction-widget">
      <h2>Transaction Widget</h2>
      <p><strong>Account:</strong> {account}</p>
      <p><strong>Balance:</strong> {balance} ETH</p>
      <div>
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="input-recipient"
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Amount in ETH"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input-amount"
        />
      </div>
      <button onClick={handleSendTransaction} className="button-send">
        Send Transaction
      </button>
      {txStatus && <p>{txStatus}</p>}
    </div>
  );
};

export default TransactionWidget;
