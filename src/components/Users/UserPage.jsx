/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useMemo } from 'react';
import {
  Link,
  useParams,
  useLocation,
  useHistory,
} from 'react-router-dom';
import axios from 'axios';
// CUSTOM IMPORTS
import REACT_APP_BACKEND_URL from '../../modules/urls.mjs';
import getHash from '../../modules/hashing.mjs';
import TestCryptoWalletAddress from '../Test/TestCryptoWalletAddress.jsx';
import Error404Page from '../Error/Error404Page.jsx';

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
        <h3>{userPageName}</h3>
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

  return (
    <div className="col-12 col-md-6">
      <select className="form-select w-100" aria-label="Default select example" onChange={handleSelectChange}>
        <option
          selected={(wishType !== 'unfulfilledwishes' && wishType !== 'fulfilledWishes')}
          value=""
        >
          All Wishes
        </option>
        <option
          selected={(wishType === 'fulfilledwishes')}
          value="fulfilledwishes"
        >
          Fulfilled Wishes

        </option>
        <option
          selected={(wishType === 'unfulfilledwishes')}
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
      <div className={`col-12${(isGranted || isAchievements) ? '' : ' col-md-6'}`}>
        <ul className="nav nav-pills">
          <li className="nav-item">
            <Link
              className={`nav-link${(isGranted || isAchievements) ? '' : ' active'}`}
              to={`/users/${userPageId}`}
              replace
              onClick={() => { handleQueryChange(''); }}
            >
              Wishes
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link${(isGranted) ? ' active' : ''}`}
              to={`/users/${userPageId}?granted=true`}
              replace
              onClick={() => { handleQueryChange('granted'); }}
            >
              Wishes Granted
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link${(isAchievements) ? ' active' : ''}`}
              to={`/users/${userPageId}?achievements=true`}
              replace
              onClick={() => { handleQueryChange('achievements'); }}
            >
              Achievements
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
                if (Number(paramId) === Number(retrievedUsers[i].id)) {
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
    console.log('user page address:');
    console.log(userPageAddress);
    myContract.methods.getAllListed().call()
      .then((res) => {
        const grantedWishes = res
          .filter(
            (option) => (
              option.wishCreated
                && option.isSold
                && option.gifter === userPageAddress
            ),
          );
        const allCreatedWishes = res
          .filter(
            (option) => (
              option.wishCreated
                && option.wisher === userPageAddress
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
        console.log('all res:');
        console.log(res);
        console.log('all created wishes:');
        console.log(allCreatedWishes);
        console.log('granted wishes:');
        console.log(grantedWishes);
        console.log('unfulfilledCreatedWishes:');
        console.log(unfulfilledCreatedWishes);
        console.log('fulfilledCreatedWishes:');
        console.log(fulfilledCreatedWishes);
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
        console.log('incentives:');
        console.log(incentives);
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
    // const allUsersArr = [...allUsers];
    let interfaceMapCallback = (item) => (
      <div className="col-12 col-sm-6 col-md-3 d-flex" key={`wish${item.id}`}>
        <div className="unfulfilled-wish-card card w-100 mb-3">
          <img
            className="card-img-top img-fluid"
            src={item.imgURL}
            alt=""
          />
          <div className="card-body">
            <h5 className="card-title text-center">{item.name}</h5>

            <p className="card-text text-center">
              {item.description}
            </p>
            <h4 className="text-center">
              Price:
              {' '}
              {Number(item.price) / (10 ** 18)}
              {' '}
              ETH
            </h4>
          </div>
        </div>
      </div>
    );
    if (isGranted) {
      headerText = 'Wishes Granted';
      emptyText = 'This user has not granted any wishes.';
      interfaceType = [...userPageGrantedWishes];
      interfaceMapCallback = (item) => {
        const wisherName = [...allUsers]
          .filter(
            (filteredUser) => filteredUser.walletAddress === item.wisher,
          )[0].displayName;
        return (
          <div className="col-12 col-sm-6 col-md-3 d-flex" key={`wish${item.id}`}>
            <div className="unfulfilled-wish-card card w-100 mb-3">
              <img
                className="card-img-top img-fluid"
                src={item.imgURL}
                alt=""
              />
              <div className="card-body">
                <h5 className="card-title text-center">{item.name}</h5>

                <div className="mb-3">
                  <div className="text-center text-truncated-parent">
                    <span className="badge badge-pill bg-success">
                      Wisher:
                      {' '}
                      {wisherName}
                    </span>
                  </div>
                </div>

                <p className="card-text text-center">
                  {item.description}
                </p>
                <h4 className="text-center">
                  Price:
                  {' '}
                  {Number(item.price) / (10 ** 18)}
                  {' '}
                  ETH
                </h4>
              </div>
            </div>
          </div>
        );
      };
    } else if (isAchievements) {
      headerText = 'Achievements';
      emptyText = 'This user has not redeemed any achievements.';
      interfaceType = [...userPageIncentives];
      interfaceMapCallback = (item) => (
        <div className="col-12 col-sm-6 col-md-3 d-flex" key={`incentive${item.id}`}>
          <div className="unfulfilled-wish-card card w-100 mb-3">
            <img
              className="card-img-top img-fluid"
              src={item.imgURL}
              alt=""
            />
            <div className="card-body">
              <h5 className="card-title text-center">{item.name}</h5>

              <p className="card-text text-center">
                {item.description}
              </p>
              <h4 className="text-center">
                {item.price}
                {' '}
                Goodwill
              </h4>
            </div>
          </div>
        </div>
      );
    } else if (!isGranted && !isAchievements && wishType === 'unfulfilledwishes') {
      headerText = 'Unfulfilled Wishes';
      emptyText = 'This user does not have any of their wishes unfulfilled currently.';
      interfaceType = [...userPageUnfulfilledCreatedWishes];
    } else if (!isGranted && !isAchievements && wishType === 'fulfilledwishes') {
      headerText = 'Fulfilled Wishes';
      emptyText = 'This user does not have any of their wishes fulfilled.';
      interfaceType = [...userPageFulfilledCreatedWishes];
    } else {
      headerText = 'All Wishes';
      emptyText = 'This user has not made any wishes yet.';
    }

    return (
      <>
        <h3 className="text-center">{headerText}</h3>
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

  console.log('Wish Type:');
  console.log(wishType);

  console.log('all users:');
  console.log(allUsers);

  if (!isLoaded) {
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

  if (userPageId <= 0) {
    return (
      <Error404Page />
    );
  }

  return (
    <div className="container pt-5">
      <div className="row w-100 pt-3">
        <div className="col-12 pt-1 py-3">
          <h2 className="pt-1 text-center mb-3">User Page</h2>
          <UserProfileSection
            userPageId={userPageId}
            userPageName={userPageName}
            userPageAddress={userPageAddress}
          />
          <TestCryptoWalletAddress />
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
