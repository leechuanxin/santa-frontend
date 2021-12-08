import './App.css';

import React from 'react';
import axios from 'axios';
import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3';
// CUSTOM IMPORTS
import Wrapper from './Wrapper.jsx';

// make sure that axios always sends the cookies to the backend server
axios.defaults.withCredentials = true;

// const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3004';

function getLibrary(provider) {
  return new Web3(provider);
}

export default function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Wrapper />
    </Web3ReactProvider>
  );
}
