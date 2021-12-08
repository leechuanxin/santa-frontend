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
// Pages
import Index from './components/Index/IndexPage.jsx';
import Error404 from './components/Error/Error404Page.jsx';
// Auxiliary Pages
import JustinTest from './JustinTestPage.jsx';

// make sure that axios always sends the cookies to the backend server
axios.defaults.withCredentials = true;

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
  const [hasNavbar, setHasNavbar] = useState(true);

  const handleSetNavbar = () => {
    setHasNavbar(true);
  };

  const handleSetNoNavbar = () => {
    setHasNavbar(false);
  };

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
            path="/justintest"
            render={() => (
              <NoNavbarWrapper
                handleSetNoNavbar={handleSetNoNavbar}
              >
                <JustinTest />
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
                <Error404 />
              </NavbarWrapper>
            )}
          />
        </Switch>
      </Router>
    </Web3ReactProvider>
  );
}
