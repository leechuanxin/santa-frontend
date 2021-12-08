/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React from 'react';
// CUSTOM IMPORTS
import TestCryptoWalletAddress from '../Test/TestCryptoWalletAddress.jsx';

export default function Error404Page() {
  return (
    <div className="container pt-5">
      <div className="row w-100 pt-3">
        <h1 className="pt-1 text-center">404</h1>
        <p className="text-center">Santa is not coming down this chimney!</p>
        <TestCryptoWalletAddress />
        <div className="col-12 pt-3" />
      </div>
    </div>
  );
}
