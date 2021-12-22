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

function LeaderboardUser({ leaderboardUser, index }) {
  return (
    <>
      {
        (index === 0)
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
      <div className={`col-12 pb-2${(index === 0) ? ' pt-2' : ''}`}>
        <Link
          to={`/users/${leaderboardUser.userId}`}
          className="card w-100"
        >
          <div className="card-body w-100 ">
            <div className="row d-flex align-items-center">
              <div className="col-2 col-sm-1">
                <strong>
                  {index + 4}
                </strong>
              </div>
              <div className="d-none d-sm-block col-2 col-md-1">
                <img
                  className="img-fluid"
                  src={`https://avatars.dicebear.com/api/adventurer-neutral/${`${leaderboardUser.userId}-${getHash((leaderboardUser.userId + 23), leaderboardUser.userAddress)}`}.svg`}
                  alt="This is you!"
                />
              </div>
              <div className="d-none d-md-block col-md-1" />
              <div className="col-6 d-none d-sm-block text-center">
                <strong>
                  {leaderboardUser.displayName}
                </strong>
              </div>
              <div className="col-8 d-block d-sm-none text-center">
                <div className="row">
                  <div className="col-5 ms-auto me-auto">
                    <img
                      className="img-fluid"
                      src={`https://avatars.dicebear.com/api/adventurer-neutral/${`${leaderboardUser.userId}-${getHash((leaderboardUser.userId + 23), leaderboardUser.userAddress)}`}.svg`}
                      alt="This is you!"
                    />
                  </div>
                </div>
                <p className="mb-0">
                  <strong>
                    <small>
                      {leaderboardUser.displayName}
                    </small>
                  </strong>
                </p>
              </div>
              <div className="col-2 col-sm-3 text-end">
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
  if (leaderboardUsers.length > 0) {
    return (
      <>
        <div className="col-12 d-none d-sm-block">
          <div className="row pb-1">
            <div className="col-3" />
            <div className="col-6 text-center">
              <strong>
                <small>Username</small>
              </strong>
            </div>
            <div className="col-3 text-end">
              <strong>
                <small>
                  Goodwill
                </small>
              </strong>
            </div>
          </div>
        </div>
        {
          leaderboardUsers.map(
            (leaderboardUser, index) => (
              <LeaderboardUser
                leaderboardUser={leaderboardUser}
                index={index}
              />
            ),
          )
        }
      </>
    );
  }
  return null;
}

function LeaderboardTopUser({ leaderboardTopUser, index }) {
  return (
    <>
      <div
        className="leaderboard-top-user d-block col-4 col-sm-3 ps-1 pe-1 pb-2"
      >
        <h4 className="text-center">
          <Link
            to={`/users/${leaderboardTopUser.userId}`}
          >
            <strong>{index + 1}</strong>
          </Link>
        </h4>
        <div className="row d-flex justify-content-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-6">
            <Link
              to={`/users/${leaderboardTopUser.userId}`}
            >
              <img
                className="img-fluid"
                src={`https://avatars.dicebear.com/api/adventurer-neutral/${`${leaderboardTopUser.userId}-${getHash((leaderboardTopUser.userId + 23), leaderboardTopUser.userAddress)}`}.svg`}
                alt="This is you!"
              />
            </Link>
          </div>
        </div>
        <p className="text-center mb-0">
          <Link
            to={`/users/${leaderboardTopUser.userId}`}
          >
            <strong>{leaderboardTopUser.displayName}</strong>
          </Link>
        </p>
        <p className="text-center">
          <Link
            to={`/users/${leaderboardTopUser.userId}`}
          >
            <small>
              {leaderboardTopUser.totalPoints}
              {' '}
              Goodwill
            </small>
          </Link>
        </p>
      </div>
    </>
  );
}

function LeaderboardTopUsers({
  leaderboardTopUsers,
}) {
  return (
    <div className="row d-flex justify-content-center pb-4">
      {
        leaderboardTopUsers.map(
          (leaderboardTopUser, index) => (
            <LeaderboardTopUser leaderboardTopUser={leaderboardTopUser} index={index} />
          ),
        )
      }
    </div>
  );
}

export default function LeaderboardPage({ user, myContract }) {
  const [, setAllUsers] = useState([]);
  const [leaderboardUsers, setLeaderboardUsers] = useState([]);
  const [leaderboardTopUsers, setLeaderboardTopUsers] = useState([]);
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
                  setLeaderboardTopUsers(filteredAllUsers.slice(0, 3));
                  setLeaderboardUsers(filteredAllUsers.slice(3));
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
    <div className="container-fluid ps-vertical-nav d-flex">
      <div className="row w-100 pt-4 pb-4">
        <div className="col-12 page-panel">
          <h2 className="pt-1 text-center mb-3">Leaderboard</h2>
          <hr />
          {
            (leaderboardTopUsers.length <= 0 && leaderboardUsers.length <= 0)
              ? (
                <p className="text-center">
                  There are no users on the leaderboard.
                  Start granting some wishes to be the first on the leaderboard!
                </p>
              ) : null
          }
          <div className="col-12">
            <div className="row pt-3">
              <div className="col-12">
                <LeaderboardTopUsers leaderboardTopUsers={leaderboardTopUsers} />
              </div>
              <LeaderboardUsers leaderboardUsers={leaderboardUsers} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
