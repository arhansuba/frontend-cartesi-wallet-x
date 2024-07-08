import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { useAccountStore } from '../stores/account';
import QrCode from 'qrcode.react';

interface Order {
  seller: string;
  type: string;
  tokenAmount: number;
  token: string;
  price: number;
  expiryDate: string;
}

interface OrderItemProps {
  order: Order;
}

const OrderItem: React.FC<OrderItemProps> = ({ order }) => {
  const store = useAccountStore();
  const [offerId, setOfferId] = useState<string | null>(null);
  const [waiting, setWaiting] = useState<boolean>(false);
  const [PIXTixd, setPIXTixd] = useState<string | null>(null);
  const [qrCodeValue, setQrCodeValue] = useState<string>('');
  const [qrCodeDisplay, setQrCodeDisplay] = useState<boolean>(false);
  const qrCodeSize = 100;

  const getWalletSigner = () => {
    // Implement the logic for getting wallet signer here
  };

  useEffect(() => {
    if (store.account) {
      // Logic to run whenever the account changes
    }
  }, [store.account]);

  const generateTixd = (length: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    console.log(result);
    return result;
  };

  const formatAddress = (address: string) => {
    return `#${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const qrCodeDecoder = (url: string) => {
    console.log(url);
    axios.get(`https://p2pix.noho.st/api/qr/${PIXTixd}`).then(({ data }) => {
      console.log(data);
      setQrCodeValue(data);
      setQrCodeDisplay(true);
      setWaiting(false);
    });
  };

  const buyOrder = async () => {
    console.log('test');
    const offerContract = await acceptContract();
    console.log('test2');
    console.log(offerContract);

    axios.get(`https://p2pix.noho.st/api/create/${PIXTixd}/${formatPrice(order.price)}`).then(({ data }) => {
      console.log(data);
      qrCodeDecoder(data.location);
    });
  };

  const acceptContract = async () => {
    setPIXTixd(generateTixd(35));

    const offerContract = new ethers.Contract(
      localhostAddresses.offer,
      offerArtifact.abi,
      getWalletSigner()
    );

    const transaction = await offerContract.accept();
    setWaiting(true);
    await transaction.wait();
    toastMessage();
    return offerContract;
  };

  const toastMessage = async () => {
    alert('You will be able to claim your tokens as soon as the payment is validated by your bank institution');
  };

  return (
    <li className="flex justify-between items-center space-x-2 py-2 px-4 bg-white whitespace-nowrap rounded mb-3 mx-5 drop-shadow-md">
      <div className="flex-0">
        <div className="flex flex-row justify-start items-center space-x-2 bg-gray-100 whitespace-nowrap">
          <svg height="40" width="40">
            <circle cx="20" cy="20" r="18" stroke="gray" strokeWidth="2" fill="teal" />
          </svg>
          <div className="seller">
            {formatAddress(order.seller)}
          </div>
        </div>
      </div>
      <div className="price">
        <span className="bid text-light">
          {order.type}: {order.tokenAmount} {order.token}
        </span>
        <span className="ask">
          ➔ R$ {formatPrice(order.price)}
        </span>
      </div>
      <div className="expiration">
        <span className="text-light">Time remaining</span>
        <span className="clock text-green">
          🕘
        </span>
        <span className="ask-price">
          {order.expiryDate}
        </span>
      </div>
      <div className="actions ml-auto">
        {!qrCodeDisplay ? (
          <button className="button-green" onClick={buyOrder} disabled={waiting || !store.account}>Comprar</button>
        ) : (
          <QrCode value={qrCodeValue} size={qrCodeSize} />
        )}
      </div>
    </li>
  );
};

export default OrderItem;
