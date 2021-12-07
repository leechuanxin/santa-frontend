import './App.css';

import React from 'react';
import axios from 'axios';

// make sure that axios always sends the cookies to the backend server
axios.defaults.withCredentials = true;

// const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3004';

export default function App() {
  return (
    <div className="container">
      <div className="row">
        <h1 className="page-title">Wow Santa!</h1>
      </div>
    </div>
  );
}
