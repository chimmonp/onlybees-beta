import React from 'react';

const PaymentIssuePage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen text-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4 text-black">
        We're Sorry for the Inconvenience
      </h1>
      <p className="text-lg text-gray-700">
        We're currently experiencing an issue with processing payments. Please try again later. Thank you for your understanding.
      </p>
    </div>
  );
};

export default PaymentIssuePage;
