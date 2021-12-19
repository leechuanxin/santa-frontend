/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// CUSTOM IMPORTS
import REACT_APP_BACKEND_URL from '../../modules/urls.mjs';
import getHash from '../../modules/hashing.mjs';
import TestCryptoWalletAddress from '../Test/TestCryptoWalletAddress.jsx';

function UsersSection({ users }) {
  return users.map((user) => (
    <Link to={`/users/${user.id}`} className="card mb-3 d-block">
      <div className="card-body">
        <div className="row">
          <div className="d-flex justify-content-center align-items-center">
            <div className="col-1 me-3">
              <div className="card">
                <div className="card-img-top bg-gray-300 border-b border-gray-600">
                  <img
                    className="img-fluid"
                    src={`https://avatars.dicebear.com/api/adventurer-neutral/${`${user.id}-${getHash((user.id + 23), user.walletAddress)}`}.svg`}
                    alt="This is you!"
                  />
                </div>
              </div>
            </div>
            <div>
              <p className="mb-0">
                <strong>
                  {user.displayName}
                </strong>
              </p>
            </div>
          </div>

        </div>
      </div>
    </Link>
  ));
}

export default function SearchUsersPage({ user }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    if (user.user_id && user.address) {
      axios
        .get(`${REACT_APP_BACKEND_URL}/user/${user.user_id}-${user.address}/users`)
        .then(async (response) => {
          if (!response.data.error) {
            if (response.data.users && response.data.users.length > 0) {
              const retrievedUsers = response.data.users
                .sort((a, b) => ((a.displayName < b.displayName) ? -1 : 1));
              setUsers([...retrievedUsers]);
              setFilteredUsers([...retrievedUsers]);
            }
            setIsLoaded(true);
          } else {
            console.log('error:');
            console.log(response.data);
            setIsLoaded(true);
          }
        })
        .catch((error) => {
          console.log('error:');
          console.log(error);
          setIsLoaded(true);
        });
    }
  }, []);

  useEffect(() => {
    const newUsers = users.filter(
      (filteredUser) => filteredUser.displayName.indexOf(userInput) >= 0,
    );
    setFilteredUsers([...newUsers]);
  }, [userInput]);

  const handleSetUserInput = (e) => {
    setUserInput(e.target.value);
  };

  if (!isLoaded) {
    return (
      <div className="container pt-5 pb-5">
        <div className="row w-100 pt-3">
          <div className="col-12 pt-1 d-flex justify-content-center">
            <div
              className="spinner-border mt-5"
              style={{ width: '5rem', height: '5rem' }}
              role="status"
            >
              <span className="sr-only"><span className="d-none">Loading...</span></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container pt-5">
      <div className="row w-100 pt-3">
        <div className="col-12 pt-1 py-3">
          <h2 className="pt-1 text-center mb-0">Search Users</h2>
          <TestCryptoWalletAddress />
          <input type="text" className="form-control w-100" placeholder="Type in a username..." value={userInput} onChange={handleSetUserInput} />
          <hr />
        </div>
        <div className="col-12 pt-3">
          <UsersSection
            users={filteredUsers}
          />
        </div>
      </div>
    </div>
  );
}
