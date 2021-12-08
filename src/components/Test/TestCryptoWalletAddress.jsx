/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React from 'react';
import { useWeb3React } from '@web3-react/core';

export default function TestCryptoWalletAddress() {
  const {
    active: networkActive,
    account,
  } = useWeb3React();

  return (
    <div className="row pt-3">
      <div className="col-12 col-md-6 ms-auto me-auto">
        <p className="w-100 text-center">
          {networkActive ? (
            <span>
              Connected with
              {' '}
              <b>{account}</b>
            </span>
          ) : <span>Not connected</span>}
        </p>
      </div>
    </div>
  );
}
