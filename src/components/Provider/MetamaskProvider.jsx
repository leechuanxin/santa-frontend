/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
// CUSTOM IMPORTS
import injected from '../Wallet/Connectors.jsx';

function MetamaskProvider({ web3Instance, children }) {
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React();
  const [loaded, setLoaded] = useState(false);
  // set default to true, we only switch it back to false
  // on error, or on disconnect
  const [apiCalled, setApiCalled] = useState(true);
  const [forcedLogout, setForcedLogout] = useState(false);

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
        if (checkedAccounts.length === 0) {
          setForcedLogout(true);
        }
      }
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          window.location.reload();
        } else {
          setForcedLogout(true);
        }
      });
    }
  }, [web3Instance]);

  if (forcedLogout) {
    return <Redirect to="/" />;
  }

  if (loaded && apiCalled) {
    return children;
  }

  if (loaded) {
    return <Redirect to="/" />;
  }

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

export default MetamaskProvider;
