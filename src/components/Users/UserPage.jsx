/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React from 'react';
// CUSTOM IMPORTS
import TestCryptoWalletAddress from '../Test/TestCryptoWalletAddress.jsx';

export default function SearchUsersPage() {
  return (
    <div className="container pt-5">
      <div className="row w-100 pt-3">
        <div className="col-12 pt-1 py-3">
          <h2 className="pt-1 text-center mb-0">User Page</h2>
          <TestCryptoWalletAddress />
          <hr />
        </div>
      </div>
    </div>
  );
}
