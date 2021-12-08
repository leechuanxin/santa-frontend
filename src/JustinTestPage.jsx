/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React from 'react';
// CUSTOM IMPORTS
import TestCryptoWalletAddress from './components/Test/TestCryptoWalletAddress.jsx';

export default function JustinTestPage({
  contract,
  contractAddress,
  myContract,
  web3Instance,
}) {
  console.log('contract:');
  console.log(contract);
  console.log('contractAddress:');
  console.log(contractAddress);
  console.log('myContract:');
  console.log(myContract);
  console.log('web3Instance:');
  console.log(web3Instance);
  return (
    <div className="container pt-5">
      <div className="row w-100 pt-3">
        <h1 className="pt-1 text-center">Justin&apos;s Test Page</h1>
        <p className="text-center">This page is just for Justin to test stuff.</p>
        <TestCryptoWalletAddress />
        <div className="col-12 pt-3" />
      </div>
    </div>
  );
}
