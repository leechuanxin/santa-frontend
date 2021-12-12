/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useEffect, useContext } from 'react';
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
// CUSTOM IMPORTS
import REACT_APP_BACKEND_URL from '../../modules/urls.mjs';
import injected from '../Wallet/Connectors.jsx';
import localStorageService from '../../modules/localStorageService.mjs';
import {
  addUser,
} from '../../reducers/UserReducer.js';
import UserContext from '../../contexts/UserContext.js';

function MetamaskAlert({ networkActive }) {
  if (!networkActive) {
    return (
      <div className="row pt-3">
        <div className="col-12 col-md-6 ms-auto me-auto">
          <div className="alert alert-warning d-flex align-items-center justify-content-center" role="alert">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: 'none' }}
            >
              <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
              </symbol>
              <symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
              </symbol>
              <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
              </symbol>
            </svg>
            <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:">
              <use xlinkHref="#exclamation-triangle-fill" />
            </svg>
            <div>
              <p>Before entering, please ensure that you have:</p>
              <ul>
                <li>
                  Installed the
                  {' '}
                  <a target="_blank" rel="noreferrer" href="https://metamask.io/index.html">MetaMask Chrome Extension</a>
                  .
                </li>
                <li>Connected your crypto wallet account with MetaMask.</li>
                <li>Connected your crypto wallet account to this site using MetaMask.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

function EnterButton({ networkActive, account }) {
  const dispatch = useContext(UserContext);
  const history = useHistory();
  const handleActiveEnterClick = (e) => {
    e.preventDefault();
    if (
      networkActive
      && account
      && typeof account === 'string'
      && account.trim() !== ''
    ) {
      axios
        .post(`${REACT_APP_BACKEND_URL}/user/onboard`, { address: account })
        .then(async (response) => {
          if (!response.data.error) {
            if (
              response.data.message.indexOf('New user added') === 0
              || response.data.message.indexOf('not yet onboarded') > -1
            ) {
              localStorageService.setItem('user_id', response.data.id);
              localStorageService.setItem('address', response.data.address);
              dispatch(addUser({
                user_id: Number(response.data.id),
                address: response.data.address,
              }));
              history.push('/updateprofile?onboard=true');
            } else {
              localStorageService.setItem('user_id', response.data.id);
              localStorageService.setItem('address', response.data.address);
              localStorageService.setItem('username', response.data.displayName);
              dispatch(addUser({
                user_id: Number(response.data.id),
                address: response.data.address,
                username: response.data.displayName,
              }));
              history.push('/wishes');
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className="row pt-3">
      <div className="col-12 col-md-6 ms-auto me-auto">
        <button
          type="button"
          className="btn w-100 btn-primary"
          disabled={!networkActive}
          onClick={handleActiveEnterClick}
        >
          Play Santa!
        </button>
        <p className="w-100 text-center">
          {networkActive ? (
            <span>
              Connected with
              {' '}
              <strong>{account}</strong>
            </span>
          ) : <span>Not connected</span>}
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const {
    active: networkActive,
    error: networkError,
    activate: activateNetwork,
    account,
  } = useWeb3React();

  useEffect(() => {
    injected
      .isAuthorized()
      .then((isAuthorized) => {
        if (isAuthorized && !networkActive && !networkError) {
          activateNetwork(injected);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [activateNetwork, networkActive, networkError]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          window.location.reload();
        }
      });
    }
  }, []);

  return (
    <div className="container pt-5">
      <div className="row w-100 pt-3">
        <h1 className="pt-1 text-center">Wish Upon A Santa</h1>
        <p className="text-center">Some placeholder text about how awesome Project 6 is!</p>
        <MetamaskAlert networkActive={networkActive} />
        <EnterButton
          networkActive={networkActive}
          account={account}
        />
      </div>
    </div>
  );
}
