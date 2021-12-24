/* eslint-disable react/prop-types,
jsx-a11y/label-has-associated-control,
react/destructuring-assignment
*/
import React, { useState, useEffect, useMemo } from 'react';
import {
  Link,
  useParams,
  useLocation,
  useHistory,
} from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEthereum,
} from '@fortawesome/free-brands-svg-icons';
// CUSTOM IMPORTS
import REACT_APP_BACKEND_URL from '../../modules/urls.mjs';
import getHash from '../../modules/hashing.mjs';
import Error404Page from '../Error/Error404Page.jsx';
import setImage from '../Incentives/setImage.js';

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

function UserProfileSection({ userPageId, userPageName, userPageAddress }) {
  return (
    <div className="row">
      <div className="col-12 d-flex justify-content-center align-items-center">
        <div className="col-1 me-3">
          <div className="card">
            <div className="card-img-top bg-gray-300 border-b border-gray-600">
              <img
                className="img-fluid"
                src={`https://avatars.dicebear.com/api/adventurer-neutral/${`${userPageId}-${getHash((userPageId + 23), userPageAddress)}`}.svg`}
                alt="This is you!"
              />
            </div>
          </div>
        </div>
        <h3 className="para-bold">{userPageName}</h3>
      </div>
    </div>
  );
}

function UserNavSelect({
  isGranted, isAchievements, handleSelectChange, wishType,
}) {
  if (isGranted || isAchievements) {
    return null;
  }

  const setValue = () => {
    if (wishType !== 'unfulfilledwishes' && wishType !== 'fulfilledwishes') {
      return '';
    }

    return wishType;
  };

  return (
    <div className="col-12 col-md-6">
      <select
        className="form-select w-100 para"
        aria-label="Default select example"
        onChange={handleSelectChange}
        value={setValue()}
      >
        <option
          value=""
        >
          All Wishes
        </option>
        <option
          value="fulfilledwishes"
        >
          Fulfilled Wishes

        </option>
        <option
          value="unfulfilledwishes"
        >
          Unfulfilled Wishes
        </option>
      </select>
    </div>
  );
}

function UserNavSection({
  isGranted,
  isAchievements,
  userPageId,
  handleQueryChange,
  handleSelectChange,
  wishType,
}) {
  return (
    <div className="row d-flex align-items-center">
      <div className={`col-12${(isGranted || isAchievements) ? '' : ' col-md-6 pb-3'}`}>
        <ul className="nav nav-pills para-bold-default">
          <li className="nav-item">
            <Link
              className={`xmas-nav-link nav-link${(isGranted || isAchievements) ? '' : ' active'}`}
              to={`/users/${userPageId}`}
              replace
              onClick={() => { handleQueryChange(''); }}
            >
              Wishes
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`xmas-nav-link nav-link${(isGranted) ? ' active' : ''}`}
              to={`/users/${userPageId}?granted=true`}
              replace
              onClick={() => { handleQueryChange('granted'); }}
            >
              Wishes Granted
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`xmas-nav-link nav-link${(isAchievements) ? ' active' : ''}`}
              to={`/users/${userPageId}?achievements=true`}
              replace
              onClick={() => { handleQueryChange('achievements'); }}
            >
              Badges
            </Link>
          </li>
        </ul>
      </div>
      <UserNavSelect
        isGranted={isGranted}
        isAchievements={isAchievements}
        handleSelectChange={handleSelectChange}
        wishType={wishType}
      />
    </div>
  );
}

export default function UserPage({ myContract, user }) {
  const query = useQuery();
  const { paramId } = useParams();
  const history = useHistory();

  const getWishType = (wishQuery) => {
    if (
      wishQuery.get('granted') !== 'true'
      && wishQuery.get('achievements') !== 'true'
      && wishQuery.get('fulfilledwishes') === 'true'
      && wishQuery.get('unfulfilledwishes') !== 'true'
    ) {
      return 'fulfilledwishes';
    }

    if (
      wishQuery.get('granted') !== 'true'
      && wishQuery.get('achievements') !== 'true'
      && wishQuery.get('unfulfilledwishes') === 'true'
      && wishQuery.get('fulfilledwishes') !== 'true'
    ) {
      return 'unfulfilledwishes';
    }

    return '';
  };

  const [wishType, setWishType] = useState(getWishType(query));
  const [isGranted, setIsGranted] = useState(
    !!((query.get('granted') === 'true' && query.get('achievements') !== 'true')),
  );
  const [isAchievements, setIsAchievements] = useState(
    !!((query.get('achievements') === 'true' && query.get('granted') !== 'true')),
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [userPageId, setUserPageId] = useState(0);
  const [userPageAddress, setUserPageAddress] = useState('');
  const [userPageName, setUserPageName] = useState('');
  const [userPageGrantedWishes, setUserPageGrantedWishes] = useState([]);
  const [userPageAllCreatedWishes, setUserPageAllCreatedWishes] = useState([]);
  const [userPageUnfulfilledCreatedWishes, setUserPageUnfulfilledCreatedWishes] = useState([]);
  const [userPageFulfilledCreatedWishes, setUserPageFulfilledCreatedWishes] = useState([]);
  const [userPageIncentives, setUserPageIncentives] = useState([]);

  useEffect(() => {
    if (user.user_id && user.address) {
      axios
        .get(`${REACT_APP_BACKEND_URL}/user/${user.user_id}-${user.address}/users`)
        .then(async (response) => {
          if (!response.data.error) {
            if (response.data.users && response.data.users.length > 0) {
              const retrievedUsers = response.data.users;
              for (let i = 0; i < retrievedUsers.length; i += 1) {
                if (
                  Number(paramId) === Number(retrievedUsers[i].id)
                  && (
                    retrievedUsers[i]
                    && retrievedUsers[i].displayName
                    && retrievedUsers[i].displayName.trim() !== ''
                  )
                ) {
                  setUserPageId(Number(retrievedUsers[i].id));
                  setUserPageAddress(retrievedUsers[i].walletAddress);
                  setUserPageName(retrievedUsers[i].displayName);
                }
              }
              setAllUsers([...retrievedUsers]);
            }
            setIsLoaded(true);
          } else {
            console.log('error:');
            console.log(response.data);
            setIsLoaded(true);
          }
        })
        .catch((error) => {
          console.log('error:');
          console.log(error);
          setIsLoaded(true);
        });
    }
  }, []);

  useEffect(() => {
    myContract.methods.getAllListed().call()
      .then((res) => {
        const modifiedArr = res
          .map((option) => {
            let modifiedOption = {
              ...option,
              id: Number(option.id),
              price: (Number(option.price) / (10 ** 18)),
            };
            for (let i = 0; i < allUsers.length; i += 1) {
              if (
                allUsers[i].walletAddress.toLowerCase()
                === modifiedOption.wisher.toLowerCase()
              ) {
                modifiedOption = {
                  ...modifiedOption,
                  wisherId: allUsers[i].id,
                  wisherAddress: allUsers[i].walletAddress,
                  wisherName:
                    (modifiedOption.wisher === user.address)
                      ? 'You!'
                      : allUsers[i].displayName,
                };
              }
            }

            return modifiedOption;
          });

        const grantedWishes = modifiedArr
          .filter(
            (option) => (
              option.wishCreated
                && option.isSold
                && option.gifter.toLowerCase() === userPageAddress.toLowerCase()
            ),
          );
        const allCreatedWishes = modifiedArr
          .filter(
            (option) => (
              option.wishCreated
                && option.wisher.toLowerCase() === userPageAddress.toLowerCase()
            ),
          );
        const fulfilledCreatedWishes = allCreatedWishes
          .filter(
            (option) => (
              option.isSold
            ),
          );
        const unfulfilledCreatedWishes = allCreatedWishes
          .filter(
            (option) => (
              !option.isSold
            ),
          );
        setUserPageGrantedWishes([...grantedWishes]);
        setUserPageAllCreatedWishes([...allCreatedWishes]);
        setUserPageUnfulfilledCreatedWishes([...unfulfilledCreatedWishes]);
        setUserPageFulfilledCreatedWishes([...fulfilledCreatedWishes]);
      })
      .catch((error) => {
        console.log(error);
      });

    myContract.methods.getAllIncentive().call()
      .then((res) => {
        const incentives = res
          .filter(
            (option) => (
              option.isClaimed
                && option.owner === userPageAddress
            ),
          );
        setUserPageIncentives([...incentives]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userPageId, userPageAddress, userPageName]);

  const handleQueryChange = (flag) => {
    if (flag === 'granted') {
      setIsGranted(true);
      setIsAchievements(false);
      setWishType('');
    } else if (flag === 'achievements') {
      setIsGranted(false);
      setIsAchievements(true);
      setWishType('');
    } else {
      setIsGranted(false);
      setIsAchievements(false);
    }
  };

  const handleSelectChange = (e) => {
    setWishType(e.target.value);
    if (e.target.value === 'fulfilledwishes') {
      history.replace(`/users/${userPageId}?fulfilledwishes=true`);
    } else if (e.target.value === 'unfulfilledwishes') {
      history.replace(`/users/${userPageId}?unfulfilledwishes=true`);
    } else {
      history.replace(`/users/${userPageId}`);
    }
  };

  const handleInterfaces = () => {
    let headerText = '';
    let emptyText = '';
    let interfaceType = [...userPageAllCreatedWishes];

    let interfaceMapCallback = (item) => {
      const fulfiller = [...allUsers]
        .filter(
          (filteredUser) => filteredUser.walletAddress.toLowerCase()
          === item.gifter.toLowerCase(),
        )[0];
      const fulfillerName = (fulfiller && fulfiller.displayName ? fulfiller.displayName : '');
      const fulfillerId = (fulfiller && fulfiller.id ? fulfiller.id : 0);
      return (
        <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 d-flex" key={`wish${item.id}`}>
          <div className="unfulfilled-wish-card card box-shadow6 w-100 mb-3">
            <div className="card-body p-3">
              <div className="row">
                <div className="col-12">
                  <div className="position-relative">
                    <img
                      className="card-img-top img-fluid"
                      src={item.imgURL}
                      alt=""
                    />
                    <div className="wish-card-overlay d-flex align-items-center justify-content-center flex-column">
                      <p className="mb-0">
                        <small>
                          <strong className="text-center para-bold">
                            {item.baseName}
                          </strong>
                        </small>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row pt-3 align-items-md-center">
                <div className="col-12">
                  <div className="row d-flex align-items-center justify-content-center justify-content-md-start">
                    {
                      item.isSold
                        ? (
                          <div className="">
                            <div className="text-center text-truncated-parent para-bold-default">
                              <Link to={`/users/${fulfillerId}`} className="badge badge-pill bg-primary">
                                Fulfilled by:
                                {' '}
                                {fulfillerName}
                              </Link>
                            </div>
                          </div>
                        ) : null
                    }
                  </div>
                </div>
                <div className="pt-2 d-block d-md-none col-12 text-center">
                  <strong className="para-bold">
                    <small>
                      {item.price}
                      {' '}
                      <FontAwesomeIcon icon={faEthereum} />
                    </small>
                  </strong>
                </div>
                <div className="col-12 col-md-4 pt-2 pt-md-0" />
              </div>
              <div className="row pt-3">
                <div className="col-12 col-md-8">
                  <p className="mb-0 text-center text-md-start para">
                    {item.description}
                  </p>
                </div>
                <div className="d-none d-md-block col-4 text-center">
                  <strong>
                    <small className="para-bold">
                      {item.price}
                      {' '}
                      <FontAwesomeIcon icon={faEthereum} />
                    </small>
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };
    if (isGranted) {
      headerText = 'Wishes Granted';
      emptyText = `${userPageName} has not granted any wishes.`;
      interfaceType = [...userPageGrantedWishes];
      interfaceMapCallback = (item) => {
        const wisher = [...allUsers]
          .filter(
            (filteredUser) => filteredUser.walletAddress.toLowerCase()
            === item.wisher.toLowerCase(),
          )[0];
        const wisherName = (wisher && wisher.displayName ? wisher.displayName : '');
        const wisherId = (wisher && wisher.id ? wisher.id : 0);
        const wisherAddress = (wisher && wisher.walletAddress ? wisher.walletAddress : '');

        return (
          <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 d-flex" key={`wish${item.id}`}>
            <div className="unfulfilled-wish-card card box-shadow6 w-100 mb-3">
              <div className="card-body p-3">
                <div className="row">
                  <div className="col-12">
                    <div className="position-relative">
                      <img
                        className="card-img-top img-fluid"
                        src={item.imgURL}
                        alt=""
                      />
                      <div className="wish-card-overlay d-flex align-items-center justify-content-center flex-column">
                        <p className="mb-0">
                          <small>
                            <strong className="text-center para-bold">
                              {item.baseName}
                            </strong>
                          </small>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row pt-3 align-items-md-center">
                  <div className="col-12 col-md-8">
                    <div className="row d-flex align-items-center justify-content-center justify-content-md-start">
                      <div className="col-3 col-md-4">
                        <Link className="d-block" to={`/users/${wisherId}`}>
                          <img
                            className="img-fluid"
                            src={`https://avatars.dicebear.com/api/adventurer-neutral/${`${wisherId}-${getHash((wisherId + 23), wisherAddress)}`}.svg`}
                            alt=""
                          />
                        </Link>
                      </div>
                      <div className="col-md-8 text-truncated-parent w-auto">
                        <p className="mb-0">
                          <strong className="para-bold">
                            <Link to={`/users/${wisherId}`}>
                              {wisherName}
                            </Link>
                          </strong>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 d-block d-md-none col-12 text-center">
                    <strong className="para-bold">
                      <small>
                        {item.price}
                        {' '}
                        <FontAwesomeIcon icon={faEthereum} />
                      </small>
                    </strong>
                  </div>
                  <div className="col-12 col-md-4 pt-2 pt-md-0" />
                </div>
                <div className="row pt-3">
                  <div className="col-12 col-md-8">
                    <p className="mb-0 text-center text-md-start para">
                      {item.description}
                    </p>
                  </div>
                  <div className="d-none d-md-block col-4 text-center">
                    <strong className="para-bold">
                      <small>
                        {item.price}
                        {' '}
                        <FontAwesomeIcon icon={faEthereum} />
                      </small>
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      };
    } else if (isAchievements) {
      headerText = 'Badges';
      emptyText = `${userPageName} has not redeemed any badges.`;
      interfaceType = [...userPageIncentives];
      interfaceMapCallback = (item) => {
        const image = setImage(item.imgURL);
        return (
          <div className="unredeemed-incentive col-12 d-flex" key={`wish${item.id}`}>
            <div className="card w-100 mb-4 box-shadow6">
              <div className="card-body">
                <div className="row d-flex align-items-center">
                  <div className="d-none d-sm-block col-3 col-md-2">
                    <div className="row d-flex justify-content-center">
                      <div className="col-12 col-lg-8">
                        <img
                          className="img-fluid"
                          src={image}
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-6 ms-auto me-auto d-sm-none pb-3">
                    <img
                      className="img-fluid"
                      src={image}
                      alt=""
                    />
                  </div>
                  <div className="col-12 col-sm-6 col-md-8">
                    <div className="row">
                      <div className="col-12">
                        <h6 className="card-title text-center d-lg-none para-bold">{item.name}</h6>
                        <h5 className="card-title text-center d-none d-lg-block para-bold">{item.name}</h5>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-3 col-md-2">
                    <strong className="d-block text-center para-bold-default">
                      {item.price}
                      {' '}
                      Goodwill
                    </strong>
                  </div>

                </div>
              </div>
            </div>
          </div>
        );
      };
    } else if (!isGranted && !isAchievements && wishType === 'unfulfilledwishes') {
      headerText = 'Unfulfilled Wishes';
      emptyText = `${userPageName} does not have any of their wishes unfulfilled currently.`;
      interfaceType = [...userPageUnfulfilledCreatedWishes];
    } else if (!isGranted && !isAchievements && wishType === 'fulfilledwishes') {
      headerText = 'Fulfilled Wishes';
      emptyText = `${userPageName} does not have any of their wishes fulfilled.`;
      interfaceType = [...userPageFulfilledCreatedWishes];
    } else {
      headerText = 'All Wishes';
      emptyText = `${userPageName} has not made any wishes yet.`;
    }

    return (
      <>
        <h3 className="text-center header-bold mb-4">{headerText}</h3>
        <div className="row">
          {
            (interfaceType.length > 0)
              ? interfaceType.map(interfaceMapCallback)
              : (
                <div className="col-12">
                  <p className="text-center">{emptyText}</p>
                </div>
              )
          }
        </div>
      </>
    );
  };

  if (!isLoaded) {
    return (
      <div className="container ps-5 pt-5 pb-5">
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

  if (userPageId <= 0) {
    return (
      <Error404Page />
    );
  }

  return (
    <div className="container-fluid ps-vertical-nav d-flex">
      <div className="row w-100 pt-4 pb-4">
        <div className="col-12 page-panel">
          <div className="pb-5">
            <UserProfileSection
              userPageId={userPageId}
              userPageName={userPageName}
              userPageAddress={userPageAddress}
            />
          </div>
          <UserNavSection
            isGranted={isGranted}
            isAchievements={isAchievements}
            userPageId={userPageId}
            handleQueryChange={handleQueryChange}
            handleSelectChange={handleSelectChange}
            wishType={wishType}
          />
          <hr />
          <div className="row">
            <div className="col-12">
              {handleInterfaces()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
