/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
// CUSTOM IMPORTS
import injected from './components/Wallet/Connectors.jsx';

import contract from './abi/santa.json';

const contractAddress = '0x71964Ed1000B5a08B679107dabb352753F0Df3D5';
function EnterButton({ networkActive, account }) {
  return (
    <>
      <button type="button" className="btn w-100 btn-primary" disabled={!networkActive}>Enter app</button>
      {networkActive ? (
        <span className="w-100">
          Connected with
          {' '}
          <b>{account}</b>
        </span>
      ) : <span>Not connected</span>}
    </>
  );
}

export default function Home() {
  console.log(Web3.currentProvider);
  const {
    active: networkActive, error: networkError, activate: activateNetwork, account,
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
      window.web3 = new Web3(window.ethereum);
      console.log(contract);
      const myContract = new window.web3.eth.Contract(contract, contractAddress);
      console.log(myContract);
    }
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 d-flex flex-column">
          <div>
            <p>Before entering, please ensure that you have:</p>
            <ul>
              <li>
                Installed the
                {' '}
                <a target="_blank" rel="noreferrer" href="https://metamask.io/index.html">MetaMask Chrome Extension</a>
                .
              </li>
              <li>Connected your crypto wallet with MetaMask.</li>
            </ul>
          </div>
          <EnterButton
            networkActive={networkActive}
            account={account}
          />
        </div>
      </div>
    </div>
  );
}
