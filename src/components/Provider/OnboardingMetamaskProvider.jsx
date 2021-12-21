/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useEffect, useState, useReducer } from 'react';
import { Redirect } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
// CUSTOM IMPORTS
import localStorageService from '../../modules/localStorageService.mjs';
import {
  initialState,
  userReducer,
  deleteUser,
} from '../../reducers/UserReducer.js';
import injected from '../Wallet/Connectors.jsx';

function OnboardingMetamaskProvider({ web3Instance, user, children }) {
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React();
  const [, dispatch] = useReducer(userReducer, initialState);

  const [loaded, setLoaded] = useState(false);
  // set default to true, we only switch it back to false
  // on error, or on disconnect
  const [apiCalled, setApiCalled] = useState(true);
  const [forcedLogout, setForcedLogout] = useState(false);

  const clearUser = () => {
    localStorageService.removeItem('user_id');
    localStorageService.removeItem('address');
    localStorageService.removeItem('username');
    dispatch(deleteUser());
  };

  const handleForceLogout = () => {
    clearUser();
    setForcedLogout(true);
  };

  useEffect(() => {
    injected
      .isAuthorized()
      .then((isAuthorized) => {
        if (isAuthorized && !networkActive && !networkError) {
          activateNetwork(injected);
        }
        setLoaded(true);
        setApiCalled(true);
      })
      .catch(() => {
        setLoaded(true);
        setApiCalled(false);
      });
  }, [activateNetwork, networkActive, networkError]);

  useEffect(async () => {
    if (window.ethereum) {
      let checkedAccounts = [];
      if (web3Instance) {
        checkedAccounts = await web3Instance.eth.getAccounts();
        if (
          checkedAccounts.length === 0
          || !user
          || (user && !user.user_id && !user.address)
        ) {
          if (!forcedLogout) {
            handleForceLogout();
          }
        }
      }
      window.ethereum.on('accountsChanged', () => {
        if (!forcedLogout) {
          handleForceLogout();
        }
      });
    }
  }, [user, forcedLogout]);

  if (!loaded) {
    return (
      <div className="container ps-5 pt-5 pb-5">
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

  if (forcedLogout || (loaded && !apiCalled)) {
    return <Redirect to="/" />;
  }

  return children;
}

export default OnboardingMetamaskProvider;
