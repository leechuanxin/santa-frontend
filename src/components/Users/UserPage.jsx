/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import {
  useParams,
} from 'react-router-dom';
import axios from 'axios';
// CUSTOM IMPORTS
import REACT_APP_BACKEND_URL from '../../modules/urls.mjs';
import getHash from '../../modules/hashing.mjs';
import TestCryptoWalletAddress from '../Test/TestCryptoWalletAddress.jsx';
import Error404Page from '../Error/Error404Page.jsx';

export default function UserPage({ myContract, user }) {
  const { paramId } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [userPageId, setUserPageId] = useState(0);
  const [userPageAddress, setUserPageAddress] = useState('');
  const [userPageName, setUserPageName] = useState('');
  const [, setUserPageGrantedWishes] = useState([]);
  const [, setUserPageAllCreatedWishes] = useState([]);
  const [, setUserPageUnfulfilledCreatedWishes] = useState([]);
  const [, setUserPageFulfilledCreatedWishes] = useState([]);
  const [, setUserPageIncentives] = useState([]);

  useEffect(() => {
    if (user.user_id && user.address) {
      axios
        .get(`${REACT_APP_BACKEND_URL}/user/${user.user_id}-${user.address}/users`)
        .then(async (response) => {
          if (!response.data.error) {
            if (response.data.users && response.data.users.length > 0) {
              const retrievedUsers = response.data.users;
              for (let i = 0; i < retrievedUsers.length; i += 1) {
                if (Number(paramId) === Number(retrievedUsers[i].id)) {
                  setUserPageId(Number(retrievedUsers[i].id));
                  setUserPageAddress(retrievedUsers[i].walletAddress);
                  setUserPageName(retrievedUsers[i].displayName);
                }
              }
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
    console.log('user page address:');
    console.log(userPageAddress);
    myContract.methods.getAllListed().call()
      .then((res) => {
        const grantedWishes = res
          .filter(
            (option) => (
              option.wishCreated
                && option.isSold
                && option.gifter === userPageAddress
            ),
          );
        const allCreatedWishes = res
          .filter(
            (option) => (
              option.wishCreated
                && option.wisher === userPageAddress
            ),
          );
        const fulfilledCreatedWishes = allCreatedWishes
          .filter(
            (option) => (
              option.isSold
            ),
          );
        const unfulfilledCreatedWishes = allCreatedWishes
          .filter(
            (option) => (
              !option.isSold
            ),
          );
        console.log('all res:');
        console.log(res);
        console.log('all created wishes:');
        console.log(allCreatedWishes);
        console.log('granted wishes:');
        console.log(grantedWishes);
        console.log('unfulfilledCreatedWishes:');
        console.log(unfulfilledCreatedWishes);
        console.log('fulfilledCreatedWishes:');
        console.log(fulfilledCreatedWishes);
        setUserPageGrantedWishes([...grantedWishes]);
        setUserPageAllCreatedWishes([...allCreatedWishes]);
        setUserPageUnfulfilledCreatedWishes([...unfulfilledCreatedWishes]);
        setUserPageFulfilledCreatedWishes([...fulfilledCreatedWishes]);
      })
      .catch((error) => {
        console.log(error);
      });

    myContract.methods.getAllIncentive().call()
      .then((res) => {
        const incentives = res
          .filter(
            (option) => (
              option.isClaimed
                && option.owner === userPageAddress
            ),
          );
        console.log('incentives:');
        console.log(incentives);
        setUserPageIncentives([...incentives]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userPageId, userPageAddress, userPageName]);

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

  if (userPageId <= 0) {
    return (
      <Error404Page />
    );
  }

  return (
    <div className="container pt-5">
      <div className="row w-100 pt-3">
        <div className="col-12 pt-1 py-3">
          <h2 className="pt-1 text-center mb-3">User Page</h2>
          <div>
            <div className="d-flex justify-content-center align-items-center">
              <div className="col-1 me-3">
                <div className="card">
                  <div className="card-img-top bg-gray-300 border-b border-gray-600">
                    <img
                      className="img-fluid"
                      src={`https://avatars.dicebear.com/api/adventurer-neutral/${`${userPageId}-${getHash((userPageId + 23), userPageAddress)}`}.svg`}
                      alt="This is you!"
                    />
                  </div>
                </div>
              </div>
              <h3>{userPageName}</h3>
            </div>
          </div>
          <TestCryptoWalletAddress />
          <hr />
          <div className="row">
            <div className="col-12">
              <h3 className="text-center">Granted Wishes</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
