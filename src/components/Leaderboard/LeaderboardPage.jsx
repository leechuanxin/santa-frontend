/* eslint-disable react/prop-types,
jsx-a11y/label-has-associated-control,
react/destructuring-assignment */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// CUSTOM IMPORTS
import REACT_APP_BACKEND_URL from '../../modules/urls.mjs';
import TestCryptoWalletAddress from '../Test/TestCryptoWalletAddress.jsx';

export default function LeaderboardPage({ user, myContract }) {
  const [, setAllUsers] = useState([]);
  useEffect(() => {
    if (user.user_id && user.address) {
      axios
        .get(`${REACT_APP_BACKEND_URL}/user/${user.user_id}-${user.address}/users`)
        .then(async (response) => {
          if (!response.data.error) {
            if (response.data.users && response.data.users.length > 0) {
              const { users } = response.data;
              myContract.methods.getAllUsers().call()
                .then((res) => {
                  console.log('res on load:');
                  console.log(res);
                })
                .catch((error) => {
                  console.log(error);
                });
              setAllUsers([...users]);
            }
          } else {
            console.log('error:');
            console.log(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

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
