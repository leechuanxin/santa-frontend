/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React from 'react';
// CUSTOM IMPORTS
import TestCryptoWalletAddress from '../Test/TestCryptoWalletAddress.jsx';

export default function WishListingsPage() {
  return (
    <div className="container-fluid pt-5">
      <div className="row w-100 pt-3">
        <p className="pt-1 text-center">Preliminary Wish Listings Page</p>
        <TestCryptoWalletAddress />
        <div className="col-12 pt-3" />
      </div>
    </div>
  );
}
