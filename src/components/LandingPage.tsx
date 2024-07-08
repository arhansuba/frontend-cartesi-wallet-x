import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import HeroButton from './HeroButton';
import AccountWidget from './AccountWidget';
import { ethers } from 'ethers';
import localhostAddresses from '../../deploys/localhost.json';
//import counterArtifact from '../../artifacts/contracts/counter.sol/Counter.json';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const [counter, setCounter] = useState<number>(0);
  const [waiting, setWaiting] = useState<boolean>(false);

  const getWalletSigner = useCallback(async () => {
    // Implement the logic to get wallet signer
    // For example, using ethers.js to get the provider and signer
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    return provider.getSigner();
  }, []);

  const refreshCounter = useCallback(async () => {
    const signer = await getWalletSigner();
    const counterContract = new ethers.Contract(localhostAddresses.counter, counterArtifact.abi, signer);
    const count = await counterContract.getCount();
    setCounter(count.toNumber());
  }, [getWalletSigner]);

  useEffect(() => {
    // Replace with your logic to listen to account changes
    // For example, using ethers.js or Web3.js
    refreshCounter();
  }, [refreshCounter]);

  const incrementCounter = async () => {
    const signer = await getWalletSigner();
    const counterContract = new ethers.Contract(localhostAddresses.counter, counterArtifact.abi, signer);
    const transaction = await counterContract.incrementCounter();
    setWaiting(true);
    await transaction.wait();
    await refreshCounter();
    setWaiting(false);
  };

  const loadOrders = () => {
    // Implement the logic to load orders
    console.log('Load orders');
  };

  return (
    <div>
      <div className="px-5 text-light">presented by doiim & tickspread</div>
      <h1 className="text-6xl leading-none font-extrabold tracking-tight normal-case text-white">
        Web3 Trustless <br /> <span className="text-yellow drop-shadow-sm">Payments</span>
      </h1>
      <h2 className="text-base leading-7 px-5 text-light">Decentralized fiat ➔ crypto swap service.</h2>
      <div className="landpage-container">
        <HeroButton onClick={loadOrders}>
          <Link to="/orderbook">See Orders</Link>
        </HeroButton>
      </div>
      <div className="landpage-header">
        <HeroButton onClick={loadOrders}>See Orders</HeroButton>
        <AccountWidget />
        <div className="counter-section">
          <p>Counter: {counter}</p>
          <button onClick={incrementCounter} disabled={waiting}>
            Increment Counter
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;


