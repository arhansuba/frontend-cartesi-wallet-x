import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import './TransactionHistory.css';
import { useAccountStore } from '../stores/account';

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  token: string;
  timestamp: number;
  status: string;
}

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { account } = useAccountStore();

  useEffect(() => {
    // Fetch transaction history for the current account
    const fetchTransactionHistory = async () => {
      try {
        // Replace with actual API call or state management logic
        const response = await fetch(`/api/transactions?account=${account}`);
        const data: Transaction[] = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error('Failed to fetch transaction history:', error);
      } finally {
        setLoading(false);
      }
    };

    if (account) {
      fetchTransactionHistory();
    }
  }, [account]);

  if (loading) {
    return <div>Loading transaction history...</div>;
  }

  if (transactions.length === 0) {
    return <div>No transactions found.</div>;
  }

  return (
    <div className="transaction-history">
      <h2>Transaction History</h2>
      <table className="transaction-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>From</th>
            <th>To</th>
            <th>Amount</th>
            <th>Token</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.id}</td>
              <td>{tx.from}</td>
              <td>{tx.to}</td>
              <td>{tx.amount}</td>
              <td>{tx.token}</td>
              <td>{format(new Date(tx.timestamp * 1000), 'yyyy-MM-dd HH:mm:ss')}</td>
              <td>{tx.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
