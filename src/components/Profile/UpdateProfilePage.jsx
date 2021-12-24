/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useLocation, useHistory } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
// Custom imports
import getHash from '../../modules/hashing.mjs';
import localStorageService from '../../modules/localStorageService.mjs';
import * as errors from '../../modules/errors.mjs';
import REACT_APP_BACKEND_URL from '../../modules/urls.mjs';
import UserContext from '../../contexts/UserContext.js';
import { addUser } from '../../reducers/UserReducer.js';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function NewUserRedirectAlert({ flag }) {
  if (flag === 'true') {
    return (
      <>
        <svg xmlns="http://www.w3.org/2000/svg" className="d-none">
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
        <div className="col-12 ms-auto me-auto">
          <div className="alert alert-primary d-flex align-items-center justify-content-center" role="alert">
            <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Info:"><use xlinkHref="#info-fill" /></svg>
            <div className="ps-2">
              <p className="mb-1">New here? Give us your display username!</p>
              <p className="mb-0">
                Your display username should be at least 2 characters long,
                and not longer than 20 characters.
                It should only include lowercase alphanumeric characters, or underscores.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
}

function GlobalSettingsErrorAlert({ errorMessage }) {
  if (errorMessage.trim() !== '') {
    return (
      <div className="col-12">
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      </div>
    );
  }

  return null;
}

export default function UpdateProfilePage({
  user,
}) {
  const query = useQuery();
  const history = useHistory();
  const {
    active: networkActive,
    account,
  } = useWeb3React();
  const dispatch = useContext(UserContext);

  const [globalErrorMessage, setGlobalErrorMessage] = useState('');
  const [usernameInvalidMessage, setUsernameInvalidMessage] = useState('');

  const [username, setUsername] = useState(
    (
      user
      && user.username
      && typeof user.username === 'string'
      && query.get('onboard') !== 'true'
    )
      ? user.username : '',
  );

  const handleUsernameChange = (event) => {
    // Retrieve input field value from JS event object.
    const inputName = event.target.value;
    // Log input field value to verify what we typed.
    setUsername(inputName);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let usernameInvalid = '';

    const data = {
      username,
      userId: user.user_id,
      address: user.address,
      address2: (networkActive ? account : ''),
    };

    axios
      .put(`${REACT_APP_BACKEND_URL}/user/update`, data)
      .then((response) => {
        if (response.data.error) {
          window.scrollTo(0, 0);

          if (response.data.error === errors.SETTINGS_INPUT_VALIDATION_ERROR_MESSAGE) {
            if (response.data.username_invalid) {
              usernameInvalid = response.data.username_invalid;
            }
          }

          setUsernameInvalidMessage(usernameInvalid);
          setGlobalErrorMessage(errors.SETTINGS_GLOBAL_ERROR_MESSAGE);
        } else {
          localStorageService.setItem('user_id', response.data.id);
          localStorageService.setItem('address', response.data.address);
          localStorageService.setItem('username', response.data.displayName);
          dispatch(addUser({
            user_id: response.data.id,
            address: response.data.address,
            username: response.data.displayName,
          }));

          history.push('/wishes');
        }
      })
      .catch(() => {
        // handle error
        window.scrollTo(0, 0);
        setGlobalErrorMessage(errors.SETTINGS_GLOBAL_ERROR_MESSAGE);
      });
  };

  return (
    <div className="container-fluid ps-vertical-nav d-flex">
      <div className="row w-100 pt-4 pb-4">
        <div className="col-12 page-panel">
          <form>
            <NewUserRedirectAlert
              flag={query.get('onboard')}
            />
            <div className="row">
              <div className="col-12">
                <h3 className="mb-3 index-header header-bold">Update Your Profile</h3>
                <hr />
              </div>
              <GlobalSettingsErrorAlert errorMessage={globalErrorMessage} />
              <div className="row d-flex pt-3 align-items-center">
                <div className="col-5 col-md-1">
                  <div className="card">
                    <div className="card-img-top bg-gray-300 border-b border-gray-600">
                      <img
                        className="img-fluid"
                        src={`https://avatars.dicebear.com/api/adventurer-neutral/${`${user.user_id}-${getHash((user.user_id + 23), user.address.toLowerCase())}`}.svg`}
                        alt="This is you!"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-7 col-md-11">
                  <div className="col-12 mb-3">
                    <label htmlFor="userName">
                      <strong className="text-blue-50 para-bold">Display Username</strong>
                    </label>
                    <input
                      type="text"
                      className={
                    `form-control${
                      usernameInvalidMessage.trim() !== '' ? ' is-invalid' : ''
                    } para`
                  }
                      id="userName"
                      name="username"
                      placeholder="e.g. chee_kean"
                      value={username}
                      onChange={handleUsernameChange}
                    />
                    <div className="invalid-feedback text-red-300">{usernameInvalidMessage}</div>
                  </div>
                </div>
              </div>

            </div>
            <hr className="mb-4" />
            <button
              className="btn btn-xmas-red btn-lg btn-block para-bold"
              type="submit"
              onClick={handleSubmit}
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
