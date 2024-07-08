import React, { useState } from 'react';
import { useAccountStore } from '../stores/account';
import OrderbookItem from './OrderbookItem';

interface Order {
  id: string;
  seller: string;
  price: number;
  token: string;
  tokenAmount: number;
  type: string;
  expiryDate: string;
}

const Orderbook: React.FC = () => {
  const store = useAccountStore();

  const [orderbooks, setOrderbooks] = useState<Order[]>([
    {
      id: "1",
      seller: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
      price: 0.40,
      token: "ETH",
      tokenAmount: 0.02,
      type: "Oferta",
      expiryDate: "2d:24h:45m"
    },
    {
      id: "2",
      seller: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
      price: 0.12,
      token: "IOT",
      tokenAmount: 0.014,
      type: "Oferta",
      expiryDate: "3d:11h:23m"
    }
  ]);

  const createOrder = () => {
    alert("creating order, joking");
  };

  return (
    <div>
      <h1 className="text-6xl leading-none font-extrabold tracking-tight normal-case">
        Compre tokens fazendo <br /> <span className="text-green drop-shadow-sm">apenas um pix</span>
      </h1>
      <h2 className="text-base leading-7 px-5 text-light">Uma solução p2p para negociar tokens.</h2>
      <div className="orderlist-container">
        <div className="flex-table">
          <ul className="w-48 flex-start pt-5">
            {orderbooks.map(orderbook => (
              <OrderbookItem key={orderbook.id} order={orderbook} />
            ))}
          </ul>
        </div>
        {/* <button className="button-green" onClick={createOrder}>Create Order</button> */}
      </div>
    </div>
  );
};

export default Orderbook;
