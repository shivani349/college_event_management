import React from 'react';

const QRCodeDisplay = ({ qrCode, eventTitle }) => {
  return (
    <div className="card">
      <div className="card-body text-center">
        <h5 className="card-title">Your Registration QR Code</h5>
        <p className="card-text">Event: {eventTitle}</p>
        <div className="my-3">
          <img 
            src={qrCode} 
            alt="Registration QR Code" 
            className="img-fluid" 
            style={{ maxWidth: '250px' }} 
          />
        </div>
        <p className="card-text text-muted">
          Present this QR code at the event for attendance
        </p>
      </div>
    </div>
  );
};

export default QRCodeDisplay;