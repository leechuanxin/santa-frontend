/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React from 'react';
// CUSTOM IMPORTS
import TestCryptoWalletAddress from '../Test/TestCryptoWalletAddress.jsx';

export default function WishListingsPage() {
  return (
    <div className="container pt-5">
      <div className="row w-100 pt-3">
        <h2 className="pt-1 text-center mb-0">Wishes</h2>
        <TestCryptoWalletAddress />
        <div className="row w-100 pt-1">
          <div className="col-12 col-md-8 pb-3 ms-auto me-auto">
            <a
              className="btn btn-primary w-100"
              href="/createwish"
              role="button"
            >
              Make a Wish!
            </a>
          </div>
        </div>
        <hr />
        <div className="col-12 pt-3" />
      </div>
    </div>
  );
}
