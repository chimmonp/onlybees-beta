import React from 'react';

const PaymentErrorModal = ({ isOpen, onClose }) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-ful mx-5">
        <h2 className="text-xl font-semibold mb-4 text-center">Apologies</h2>
        <p className="text-gray-700 mb-6">
        We&apos;re currently experiencing technical difficulties with our bank server. <br /><strong>Please try again in a little while</strong>. We sincerely apologize for any inconvenience this may cause.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PaymentErrorModal;
