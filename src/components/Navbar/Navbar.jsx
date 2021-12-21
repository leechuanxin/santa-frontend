/* eslint-disable react/prop-types, react/jsx-props-no-spreading */
import React, { useReducer } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faCertificate,
  faTrophy,
  faUsers,
  faPowerOff,
  faCog,
} from '@fortawesome/free-solid-svg-icons';
// CUSTOM IMPORTS
import localStorageService from '../../modules/localStorageService.mjs';
import {
  initialState,
  userReducer,
  deleteUser,
} from '../../reducers/UserReducer.js';

function NavbarTopLinks({ user, pageState }) {
  if (user && user.username) {
    return (
      <>
        <li className="nav-item">
          <Link
            to="/wishes"
            className={`nav-link
              py-3
              border-bottom
              d-flex
              align-items-center
              justify-content-center
              ${(pageState === 'wishes') ? 'active' : ''}
            `}
          >
            <FontAwesomeIcon icon={faHome} color="white" />
          </Link>
        </li>
        <li>
          <Link
            to="/incentives"
            className={`nav-link
              py-3
              border-bottom
              d-flex
              align-items-center
              justify-content-center
              ${(pageState === 'incentives') ? 'active' : ''}
            `}
          >
            <FontAwesomeIcon icon={faCertificate} color="white" />
          </Link>
        </li>
        <li>
          <Link
            to="/leaderboard"
            className={`nav-link
              py-3
              border-bottom
              d-flex
              align-items-center
              justify-content-center
              ${(pageState === 'leaderboard') ? 'active' : ''}
            `}
          >
            <FontAwesomeIcon icon={faTrophy} color="white" />
          </Link>
        </li>
        <li>
          <Link
            to="/searchusers"
            className={`nav-link
              py-3
              border-bottom
              d-flex
              align-items-center
              justify-content-center
              ${(pageState === 'users') ? 'active' : ''}
            `}
          >
            <FontAwesomeIcon icon={faUsers} color="white" />
          </Link>
        </li>
      </>
    );
  }

  return null;
}

export default function Navbar({
  hasNavbar,
  user,
  pageState,
}) {
  const history = useHistory();
  const [, dispatch] = useReducer(userReducer, initialState);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorageService.removeItem('user_id');
    localStorageService.removeItem('address');
    localStorageService.removeItem('username');
    dispatch(deleteUser());
    history.push('/');
  };

  if (hasNavbar) {
    return (
      <div className="d-flex flex-column flex-shrink-0 bg-dark vertical-nav">
        <ul className="nav nav-pills nav-flush flex-column mb-auto text-center">
          <NavbarTopLinks pageState={pageState} user={user} />
        </ul>
        <div className="border-top nav-pills">
          <Link
            to="/updateprofile"
            className={`nav-link
              py-3
              border-bottom
              d-flex
              align-items-center
              justify-content-center
              ${(pageState === 'profile') ? ' active' : ''}
            `}
          >
            <FontAwesomeIcon icon={faCog} color="white" />
          </Link>
          <Link
            to="/logout"
            onClick={handleLogout}
            className="nav-link py-3 border-bottom d-flex align-items-center justify-content-center"
          >
            <FontAwesomeIcon icon={faPowerOff} color="white" />
          </Link>
        </div>
      </div>
    );
  }
  return null;
}
