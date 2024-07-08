import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useAccountStore } from '../stores/account';
import { usePaymentStore } from '../stores/payment';
import localhostAddresses from '../../deploys/localhost.json';
import paymentArtifact from '../../artifacts/contracts/PaymentContract.json';
import './PaymentWidget.css';

const PaymentWidget: React.FC = () => {
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { account } = useAccountStore();
  const { addTransaction } = usePaymentStore();

  const handlePayment = async () => {
    if (!account || !recipientAddress || !amount) {
      setMessage('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const paymentContract = new ethers.Contract(
        localhostAddresses.payment,
        paymentArtifact.abi,
        signer
      );

      const transaction = await paymentContract.sendPayment(
        recipientAddress,
        ethers.utils.parseEther(amount)
      );

      await transaction.wait();

      addTransaction({
        recipient: recipientAddress,
        amount,
        timestamp: new Date().toISOString(),
      });

      setMessage('Payment successful!');
    } catch (error) {
      console.error('Payment failed:', error);
      setMessage('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-widget">
      <h2>Send Payment</h2>
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipientAddress}
        onChange={(e) => setRecipientAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount (ETH)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handlePayment} disabled={loading}>
        {loading ? 'Processing...' : 'Send Payment'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PaymentWidget;
