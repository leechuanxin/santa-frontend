/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import injected from '../Wallet/Connectors.jsx';

function MetamaskProvider({ children }) {
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    injected
      .isAuthorized()
      .then((isAuthorized) => {
        setLoaded(true);
        if (isAuthorized && !networkActive && !networkError) {
          activateNetwork(injected);
        }
      })
      .catch(() => {
        setLoaded(true);
      });
  }, [activateNetwork, networkActive, networkError]);
  if (loaded) {
    return children;
  }
  return <>Loading</>;
  // return (
  //   <Route path="/daksdjmas">
  //     <MetamaskProvider>
  //     <Wish  />
  //     </MetamaskProvider>
  //   </Route>
  // );
}

export default MetamaskProvider;
