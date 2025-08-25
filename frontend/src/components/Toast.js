import React from 'react';

const Toast = ({ message, show, onClose }) => {
  if (!show) return null;
  return (
    <div
      className="toast show position-fixed top-0 end-0 m-4"
      style={{
        zIndex: 9999,
        minWidth: '280px',
        background: '#198754',
        color: 'white',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        borderRadius: '8px',
        border: 'none'
      }}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="d-flex justify-content-between align-items-center px-3 py-2">
        <strong className="me-auto">Success</strong>
        <button type="button" className="btn-close btn-close-white ms-2" onClick={onClose}></button>
      </div>
      <div className="px-3 pb-3">{message}</div>
    </div>
  );
};

export default Toast;
