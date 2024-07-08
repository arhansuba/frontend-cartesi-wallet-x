// InvoiceGenerator.tsx

import React, { useState } from 'react';
import QRCode from 'qrcode.react';

interface InvoiceGeneratorProps {
  onSubmit: (invoiceData: InvoiceData) => void;
}

interface InvoiceData {
  recipient: string;
  amount: number;
  description: string;
}

const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ onSubmit }) => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    recipient: '',
    amount: 0,
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(invoiceData);
  };

  return (
    <div className="invoice-generator">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Recipient:</label>
          <input type="text" name="recipient" value={invoiceData.recipient} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Amount:</label>
          <input type="number" name="amount" value={invoiceData.amount} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea name="description" value={invoiceData.description} onChange={handleChange} rows={3} required />
        </div>
        <button type="submit">Generate Invoice</button>
      </form>
      {invoiceData.recipient && (
        <div className="qrcode">
          <QRCode value={`Recipient: ${invoiceData.recipient}\nAmount: ${invoiceData.amount}`} />
        </div>
      )}
    </div>
  );
};

export default InvoiceGenerator;
