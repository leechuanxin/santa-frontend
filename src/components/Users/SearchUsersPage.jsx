/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// CUSTOM IMPORTS
import REACT_APP_BACKEND_URL from '../../modules/urls.mjs';
import getHash from '../../modules/hashing.mjs';

function UsersSection({ users, userInput }) {
  if (userInput.trim() !== '' && users.length > 0) {
    return users.map((user) => (
      <div className="col-12 col-md-4">
        <Link to={`/users/${user.id}`} className="card mb-3 d-block">
          <div className="card-body">
            <div className="row">
              <div className="d-flex justify-content-center align-items-center">
                <div className="col-1 col-md-3 col-lg-2 me-3">
                  <img
                    className="img-fluid"
                    src={`https://avatars.dicebear.com/api/adventurer-neutral/${`${user.id}-${getHash((user.id + 23), user.walletAddress)}`}.svg`}
                    alt="This is you!"
                  />
                </div>
                <div>
                  <p className="mb-0 text-truncated-parent para-bold">
                    {user.displayName}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </Link>
      </div>
    ));
  }

  if (users.length <= 0) {
    return (
      <p className="text-center para-bold">
        There are no users found.
      </p>
    );
  }

  return (
    <p className="text-center para-bold">
      Type in the search field to find a user!
    </p>
  );
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
      (filteredUser) => filteredUser.displayName.indexOf(userInput.toLowerCase()) >= 0,
    );
    setFilteredUsers([...newUsers]);
  }, [userInput]);

  const handleSetUserInput = (e) => {
    setUserInput(e.target.value);
  };

  if (!isLoaded) {
    return (
      <div className="container-fluid ps-vertical-nav d-flex">
        <div className="row w-100 pt-4 pb-4">
          <div className="col-12 page-panel">
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
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid ps-vertical-nav d-flex">
      <div className="row w-100 pt-4 pb-4">
        <div className="col-12 page-panel">
          <div className="row">
            <h2 className="pt-1 text-center mb-0 header-bold">Search Users</h2>
            <div className="col-12 pt-3">
              <input type="text" className="form-control w-100 para-bold-default" placeholder="Type in a username..." value={userInput} onChange={handleSetUserInput} />
              <hr />
            </div>
          </div>
          <div className="col-12 pt-3">
            <div className="row">
              <UsersSection
                users={filteredUsers}
                userInput={userInput}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
