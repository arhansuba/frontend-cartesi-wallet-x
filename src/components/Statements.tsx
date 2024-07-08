import React, { useEffect } from 'react';
import AccountWidget from './AccountWidget';
import { useAccountStore } from '../stores/account';
import HeroButton from './HeroButton';

const Statements: React.FC = () => {
  const store = useAccountStore();
  const getWalletSigner = () => {
    // Implement the logic for getting wallet signer here
  };

  useEffect(() => {
    if (store.account) {
      // Logic to run whenever the account changes
    }
  }, [store.account]);

  const loadApp = () => {
    // Implement the logic for loading the app here
  };

  return (
    <div>
      <h1 className="text-md md:text-xs">Web3 Trustless Payments</h1>
      <hr className="max-w-xl m-auto mt-1 mb-2" />
      <h2 className="text-base px-5">Fiat/Cripto descentralized swap service.</h2>
      <div className="orderlist-container">
        {/* TABLE HERE */}
        <HeroButton onClick={loadApp}>See Orders</HeroButton>
      </div>
    </div>
  );
};

export default Statements;
