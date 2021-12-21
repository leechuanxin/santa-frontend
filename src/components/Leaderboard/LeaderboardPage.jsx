/* eslint-disable react/prop-types,
jsx-a11y/label-has-associated-control,
react/destructuring-assignment */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Link,
} from 'react-router-dom';
// CUSTOM IMPORTS
import REACT_APP_BACKEND_URL from '../../modules/urls.mjs';
import getHash from '../../modules/hashing.mjs';
import TestCryptoWalletAddress from '../Test/TestCryptoWalletAddress.jsx';

function LeaderboardUser({ leaderboardUser, index }) {
  return (
    <>
      {
        (index === 4)
          ? (
            <div className="col-12">
              <div className="row">
                <div className="col-12">
                  <hr />
                </div>
              </div>
            </div>
          )
          : null
      }
      <div className={`col-12 pb-2${(index === 4) ? ' pt-2' : ''}`}>
        <Link
          to={`/users/${leaderboardUser.userId}`}
          className={
            `card w-100${(index === 0) ? ' bg-warning' : ''}${(index === 1) ? ' bg-light' : ''}${(index === 2) ? ' bg-secondary' : ''}`
          }
        >
          <div className="card-body w-100 ">
            <div className="row d-flex align-items-center">
              <div className="col-1">
                <div className="card w-100">
                  <div className="card-img-top bg-gray-300 border-b border-gray-600">
                    <img
                      className="img-fluid"
                      src={`https://avatars.dicebear.com/api/adventurer-neutral/${`${leaderboardUser.userId}-${getHash((leaderboardUser.userId + 23), leaderboardUser.userAddress)}`}.svg`}
                      alt="This is you!"
                    />
                  </div>
                </div>
              </div>
              <div className="col-2" />
              <div className="col-6 text-center">
                <strong>
                  {leaderboardUser.displayName}
                </strong>
              </div>
              <div className="col-3 text-end">
                {leaderboardUser.totalPoints}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}

function LeaderboardUsers({
  leaderboardUsers,
}) {
  return (leaderboardUsers.map(
    (leaderboardUser, index) => <LeaderboardUser leaderboardUser={leaderboardUser} index={index} />,
  ));
}

export default function LeaderboardPage({ user, myContract }) {
  const [allUsers, setAllUsers] = useState([]);
  const [leaderboardUsers, setLeaderboardUsers] = useState([]);
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
                  const filteredAllUsers = [...res]
                    .map((filteredUser) => {
                      let displayName = '';
                      let userId = 0;
                      for (let i = 0; i < response.data.users.length; i += 1) {
                        if (
                          filteredUser.userAddress === response.data.users[i].walletAddress
                        ) {
                          displayName = response.data.users[i].displayName;
                          userId = response.data.users[i].id;
                        }
                      }
                      return {
                        ...filteredUser,
                        displayName,
                        totalPoints: Number(filteredUser.totalPoints),
                        userId,
                      };
                    })
                    .sort(
                      (a, b) => {
                        const n = Number(a.totalPoints) - Number(b.totalPoints);
                        // sort by number of points first
                        if (n !== 0) {
                          return (n < 0) ? 1 : -1;
                        }
                        // then sort by username
                        return (
                          (
                            a.displayName < b.displayName
                          )
                            ? -1
                            : 1
                        );
                      },
                    );
                  setLeaderboardUsers([...filteredAllUsers]);
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

  console.log('allUsers:');
  console.log(allUsers);

  console.log('leaderboardUsers:');
  console.log(leaderboardUsers);

  return (
    <div className="container ps-5">
      <div className="row w-100 pt-3">
        <h2 className="pt-1 text-center mb-3">Leaderboard</h2>
        <TestCryptoWalletAddress />
        <hr />
        <div className="col-12">
          <div className="row pt-3">
            <div className="col-12">
              <div className="row pb-3">
                <div className="col-9" />
                <div className="col-3 text-end">
                  <strong>Lifetime Goodwill</strong>
                </div>
              </div>
            </div>
            <LeaderboardUsers leaderboardUsers={leaderboardUsers} />
          </div>
        </div>
      </div>
    </div>
  );
}
