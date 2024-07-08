// QRCodeScanner.tsx

import React, { useRef, useState } from 'react';
import QrReader from 'react-qr-reader';

interface QRCodeScannerProps {
  onScan: (result: string | null) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan }) => {
  const qrRef = useRef(null);
  const [scanning, setScanning] = useState(false);

  const handleScan = (data: string | null) => {
    if (data) {
      onScan(data);
      setScanning(false);
    }
  };

  const handleError = (err: any) => {
    console.error(err);
  };

  const startScan = () => {
    setScanning(true);
  };

  const stopScan = () => {
    setScanning(false);
  };

  return (
    <div className="qrcode-scanner">
      <div className="scanner-container">
        {scanning ? (
          <QrReader
            ref={qrRef}
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }}
          />
        ) : (
          <p>Click "Start Scan" to scan QR code.</p>
        )}
      </div>
      <div className="controls">
        {!scanning && <button onClick={startScan}>Start Scan</button>}
        {scanning && <button onClick={stopScan}>Stop Scan</button>}
      </div>
    </div>
  );
};

export default QRCodeScanner;
