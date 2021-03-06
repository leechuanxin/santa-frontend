/* eslint-disable react/prop-types,
jsx-a11y/label-has-associated-control, react/jsx-props-no-spreading */
import React from 'react';
// CUSTOM IMPORTS
import {
  OverlayTrigger, Tooltip,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
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
  console.log('getAllListed:');
  myContract.methods.displayPrice(1).call().then((res) => {
    console.log(res);
  });
  myContract.methods.getAllListed().call().then((res) => {
    console.log(res);
  });

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Simple tooltip
    </Tooltip>
  );

  return (
    <div className="container ps-5">
      <div className="row w-100 pt-3">
        <h1 className="pt-1 text-center">Justin&apos;s Test Page</h1>
        <p className="text-center">This page is just for Justin to test stuff.</p>
        <TestCryptoWalletAddress />
        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip}
        >
          <Link to="/">Test</Link>
        </OverlayTrigger>
        <div className="col-12 pt-3" />
      </div>
    </div>
  );
}
