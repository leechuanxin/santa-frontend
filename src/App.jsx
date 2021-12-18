/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useReducer } from 'react';
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
import localStorageService from './modules/localStorageService.mjs';
import UserContext from './contexts/UserContext.js';
import {
  initialState,
  userReducer,
  addUser,
  deleteUser,
} from './reducers/UserReducer.js';
import Navbar from './components/Navbar/Navbar.jsx';
// CUSTOM IMPORTS
import contract from './abi/santa.json';
// Providers
import MetamaskProvider from './components/Provider/MetamaskProvider.jsx';
import OnboardingMetamaskProvider from './components/Provider/OnboardingMetamaskProvider.jsx';
// Pages
import Index from './components/Index/IndexPage.jsx';
// Pages - Wishes
import WishListings from './components/Wishes/WishListingsPage.jsx';
import CreateWish from './components/Wishes/CreateWishPage.jsx';
// Pages - Incentives
import Incentives from './components/Incentives/IncentivesPage.jsx';
// Pages - Settings
import UpdateProfile from './components/Profile/UpdateProfilePage.jsx';
// Pages - Search Users
import SearchUsers from './components/Users/SearchUsersPage.jsx';
import User from './components/Users/UserPage.jsx';
// Auxiliary Pages
import Error404 from './components/Error/Error404Page.jsx';
import JustinTest from './JustinTestPage.jsx';

// make sure that axios always sends the cookies to the backend server
axios.defaults.withCredentials = true;
const contractAddress = '0x0d523144Af2c9245274228EeD5763c4b2af5a24D';

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
  const [user, dispatch] = useReducer(userReducer, initialState);
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
    const userId = localStorageService.getItem('user_id');
    const address = localStorageService.getItem('address');
    const username = localStorageService.getItem('username');

    if (!userId) {
      localStorageService.removeItem('user_id');
      localStorageService.removeItem('address');
      localStorageService.removeItem('username');
      dispatch(deleteUser());
    } else {
      let obj = { user_id: Number(userId) };

      if (
        address
        && typeof address === 'string'
        && address.trim() !== ''
      ) {
        obj = {
          ...obj,
          address,
        };
      }

      if (
        username
        && typeof username === 'string'
        && username.trim() !== ''
      ) {
        obj = {
          ...obj,
          username,
        };
      }

      dispatch(
        addUser({
          ...obj,
        }),
      );
    }

    if (window.ethereum) {
      const newWeb3Instance = new Web3(window.ethereum);
      window.web3 = newWeb3Instance;
      const newContract = new window.web3.eth.Contract(contract, contractAddress);
      setMyContract(newContract);
      setWeb3Instance(newWeb3Instance);
    }
  }, []);

  return (
    <UserContext.Provider value={dispatch}>
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
              path="/updateprofile"
              render={() => (
                <NavbarWrapper
                  handleSetNavbar={handleSetNavbar}
                >
                  <OnboardingMetamaskProvider web3Instance={web3Instance}>
                    <UpdateProfile user={user} />
                  </OnboardingMetamaskProvider>
                </NavbarWrapper>
              )}
            />
            <Route
              exact
              path="/wishes"
              render={() => (
                <NavbarWrapper
                  handleSetNavbar={handleSetNavbar}
                >
                  <MetamaskProvider user={user} web3Instance={web3Instance}>
                    <WishListings
                      user={user}
                      contract={contract}
                      contractAddress={contractAddress}
                      myContract={myContract}
                      web3Instance={web3Instance}
                    />
                  </MetamaskProvider>
                </NavbarWrapper>
              )}
            />
            <Route
              exact
              path="/createwish"
              render={() => (
                <NavbarWrapper
                  handleSetNavbar={handleSetNavbar}
                >
                  <MetamaskProvider user={user} web3Instance={web3Instance}>
                    <CreateWish
                      user={user}
                      contract={contract}
                      contractAddress={contractAddress}
                      myContract={myContract}
                      web3Instance={web3Instance}
                    />
                  </MetamaskProvider>
                </NavbarWrapper>
              )}
            />
            <Route
              exact
              path="/incentives"
              render={() => (
                <NavbarWrapper
                  handleSetNavbar={handleSetNavbar}
                >
                  <MetamaskProvider user={user} web3Instance={web3Instance}>
                    <Incentives
                      user={user}
                      contract={contract}
                      contractAddress={contractAddress}
                      myContract={myContract}
                      web3Instance={web3Instance}
                    />
                  </MetamaskProvider>
                </NavbarWrapper>
              )}
            />
            <Route
              exact
              path="/searchusers"
              render={() => (
                <NavbarWrapper
                  handleSetNavbar={handleSetNavbar}
                >
                  <MetamaskProvider user={user} web3Instance={web3Instance}>
                    <SearchUsers
                      user={user}
                      contract={contract}
                      contractAddress={contractAddress}
                      myContract={myContract}
                      web3Instance={web3Instance}
                    />
                  </MetamaskProvider>
                </NavbarWrapper>
              )}
            />
            <Route
              exact
              path="/users/:userId"
              render={() => (
                <NavbarWrapper
                  handleSetNavbar={handleSetNavbar}
                >
                  <MetamaskProvider user={user} web3Instance={web3Instance}>
                    <User
                      user={user}
                      contract={contract}
                      contractAddress={contractAddress}
                      myContract={myContract}
                      web3Instance={web3Instance}
                    />
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
                  <MetamaskProvider user={user} web3Instance={web3Instance}>
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
                  <MetamaskProvider user={user} web3Instance={web3Instance}>
                    <Error404 />
                  </MetamaskProvider>
                </NavbarWrapper>

              )}
            />
          </Switch>
        </Router>
      </Web3ReactProvider>
    </UserContext.Provider>
  );
}
