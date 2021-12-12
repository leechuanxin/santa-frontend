/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import axios from 'axios';
import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3';

// CUSTOM IMPORTS
import './App.css';
import Navbar from './components/Navbar/Navbar.jsx';
// CUSTOM IMPORTS
import contract from './abi/santa.json';
// Providers
import MetamaskProvider from './components/Provider/MetamaskProvider.jsx';
// Pages
import Index from './components/Index/IndexPage.jsx';
import Error404 from './components/Error/Error404Page.jsx';
import WishListings from './components/Wishes/WishListingsPage.jsx';
// Auxiliary Pages
import JustinTest from './JustinTestPage.jsx';

// make sure that axios always sends the cookies to the backend server
axios.defaults.withCredentials = true;
const contractAddress = '0x6eCB1278dfB843B87cdaD4C3BB8FAdAa8ED06ac8';

// const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3004';

function getLibrary(provider) {
  return new Web3(provider);
}

function NavbarWrapper({
  handleSetNavbar,
  children,
}) {
  useEffect(() => {
    handleSetNavbar();
  }, []);

  return <>{children}</>;
}

function NoNavbarWrapper({
  handleSetNoNavbar,
  children,
}) {
  useEffect(() => {
    handleSetNoNavbar();
  }, []);

  return <>{children}</>;
}

export default function App() {
  const [hasNavbar, setHasNavbar] = useState(false);
  const [myContract, setMyContract] = useState(null);
  const [web3Instance, setWeb3Instance] = useState(null);

  const handleSetNavbar = () => {
    setHasNavbar(true);
  };

  const handleSetNoNavbar = () => {
    setHasNavbar(false);
  };

  useEffect(() => {
    if (window.ethereum) {
      const newWeb3Instance = new Web3(window.ethereum);
      window.web3 = newWeb3Instance;
      const newContract = new window.web3.eth.Contract(contract, contractAddress);
      setMyContract(newContract);
      setWeb3Instance(newWeb3Instance);
    }
  }, []);

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Router>
        <Navbar
          hasNavbar={hasNavbar}
        />
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          {/* give the route matching path in order of matching precedence */}
          {/* ALL OTHERS */}
          <Route
            exact
            path="/"
            render={() => (
              <NoNavbarWrapper
                handleSetNoNavbar={handleSetNoNavbar}
              >
                <Index />
              </NoNavbarWrapper>
            )}
          />
          <Route
            exact
            path="/wishes"
            render={() => (
              <NavbarWrapper
                handleSetNavbar={handleSetNavbar}
              >
                <MetamaskProvider web3Instance={web3Instance}>
                  <WishListings />
                </MetamaskProvider>
              </NavbarWrapper>
            )}
          />
          <Route
            exact
            path="/justintest"
            render={() => (
              <NoNavbarWrapper
                handleSetNoNavbar={handleSetNoNavbar}
              >
                <MetamaskProvider web3Instance={web3Instance}>
                  <JustinTest
                    contract={contract}
                    contractAddress={contractAddress}
                    myContract={myContract}
                    web3Instance={web3Instance}
                  />
                </MetamaskProvider>
              </NoNavbarWrapper>
            )}
          />
          <Route
            exact
            path="*"
            render={() => (

              <NavbarWrapper
                handleSetNavbar={handleSetNavbar}
              >
                <MetamaskProvider web3Instance={web3Instance}>
                  <Error404 />
                </MetamaskProvider>
              </NavbarWrapper>

            )}
          />
        </Switch>
      </Router>
    </Web3ReactProvider>
  );
}
