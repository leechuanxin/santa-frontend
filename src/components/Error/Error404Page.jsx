/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React from 'react';
// CUSTOM IMPORTS
import TestCryptoWalletAddress from '../Test/TestCryptoWalletAddress.jsx';

export default function Error404Page() {
  return (
    // Switch to container-fluid
    // Use ps-vertical-nav, a custom class to align container left of navbar
    // Ensure d-flex so that short pages can still stretch to bottom */
    <div className="container-fluid ps-vertical-nav d-flex">
      {/* Child row should have pt-4 and pb-4 */}
      <div className="row w-100 pt-4 pb-4">
        {/* page-panel for white background on card-like pages */}
        <div className="col-12 page-panel">
          <h1 className="pt-3 text-center">404</h1>
          <p className="text-center">Santa is not coming down this chimney!</p>
          <TestCryptoWalletAddress />
          <div className="col-12 pt-3" />
        </div>
      </div>
    </div>
  );
}
