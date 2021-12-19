/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React from 'react';
// CUSTOM IMPORTS
import TestCryptoWalletAddress from '../Test/TestCryptoWalletAddress.jsx';

export default function LeaderboardPage() {
  return (
    <div className="container pt-5">
      <div className="row w-100 pt-3">
        <h2 className="pt-1 text-center mb-3">Leaderboard</h2>
        <TestCryptoWalletAddress />
        <hr />
        <div className="row w-100 pt-3">
          Test Leaderboard
        </div>
      </div>
    </div>
  );
}
