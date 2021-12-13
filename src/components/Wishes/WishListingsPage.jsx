/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// CUSTOM IMPORTS
import REACT_APP_BACKEND_URL from '../../modules/urls.mjs';
import TestCryptoWalletAddress from '../Test/TestCryptoWalletAddress.jsx';

function UnfulfilledWishes({ isLoaded, unfulfilledWishes }) {
  if (isLoaded && unfulfilledWishes.length > 0) {
    return unfulfilledWishes.map((wish) => (
      <div className="col-12 col-sm-6 col-md-3 d-flex" key={`wish${wish.id}`}>
        <div className="unfulfilled-wish-card card w-100 mb-3">
          <img
            className="card-img-top img-fluid"
            src={wish.imgURL}
            alt=""
          />
          <div className="card-body">
            <h5 className="card-title text-center">{wish.name}</h5>

            <div className="mb-3">
              <div className="text-center text-truncated-parent">
                <span className={`badge badge-pill${(wish.isCurrentWisher ? ' bg-dark' : ' bg-success')}`}>
                  Wisher:
                  {' '}
                  {wish.wisherName}
                </span>
              </div>
            </div>

            <p className="card-text text-center">
              {wish.description}
            </p>
            <h4 className="text-center">
              Price:
              {' '}
              {wish.price}
              {' '}
              ETH
            </h4>
            {
              !wish.isCurrentWisher
              && (
                <div className="d-flex justify-content-center">
                  <button type="button" className="btn btn-primary">Fulfill Wish!</button>
                </div>
              )
            }
          </div>
        </div>
      </div>
    ));
  }

  if (isLoaded) {
    return (
      <div className="col-12">
        <p className="text-center">There are no unfulfilled wishes. Start making a wish!</p>
      </div>
    );
  }

  return (
    <div className="col-12 pt-1 d-flex justify-content-center">
      <div
        className="spinner-border mt-5"
        style={{ width: '5rem', height: '5rem' }}
        role="status"
      >
        <span className="sr-only"><span className="d-none">Loading...</span></span>
      </div>
    </div>
  );
}

export default function WishListingsPage({ myContract, user }) {
  const [unfulfilledWishes, setUnfulfilledWishes] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    if (user.user_id && user.address) {
      axios
        .get(`${REACT_APP_BACKEND_URL}/user/${user.user_id}-${user.address}/users`)
        .then(async (response) => {
          if (!response.data.error) {
            if (response.data.users && response.data.users.length > 0) {
              const { users } = response.data;
              myContract.methods.getWishCreated().call()
                .then((res) => {
                  const modifiedArr = res
                    .map((option) => {
                      let modifiedOption = {
                        ...option,
                        id: Number(option.id),
                        price: (Number(option.price) / (10 ** 18)),
                        isCurrentWisher: (option.wisher === user.address),
                      };
                      for (let i = 0; i < users.length; i += 1) {
                        if (users[i].walletAddress === modifiedOption.wisher) {
                          modifiedOption = {
                            ...modifiedOption,
                            wisherName:
                              (modifiedOption.wisher === user.address)
                                ? 'You!'
                                : users[i].displayName,
                          };
                        }
                      }
                      delete modifiedOption['0'];
                      delete modifiedOption['1'];
                      delete modifiedOption['2'];
                      delete modifiedOption['3'];
                      delete modifiedOption['4'];
                      delete modifiedOption['5'];
                      delete modifiedOption['6'];
                      delete modifiedOption['7'];
                      delete modifiedOption['8'];
                      delete modifiedOption['9'];
                      delete modifiedOption.gifter;
                      delete modifiedOption.owner;
                      delete modifiedOption.isSold;

                      return modifiedOption;
                    })
                    .sort((a, b) => ((a.id > b.id) ? -1 : 1));

                  setUnfulfilledWishes([...modifiedArr]);
                })
                .catch((error) => {
                  console.log(error);
                });
            }
            setIsLoaded(true);
          } else {
            console.log('error:');
            console.log(response.data);
            setIsLoaded(true);
          }
        })
        .catch((error) => {
          console.log(error);
          setIsLoaded(true);
        });
    }
  }, []);

  return (
    <div className="container pt-5">
      <div className="row w-100 pt-3">
        <h2 className="pt-1 text-center mb-0">Wishes</h2>
        <TestCryptoWalletAddress />
        <div className="row w-100 pt-1">
          <div className="col-12 col-md-8 pb-3 ms-auto me-auto">
            <a
              className="btn btn-primary w-100"
              href="/createwish"
              role="button"
            >
              Make a Wish!
            </a>
          </div>
        </div>
        <hr />
        <div className="col-12 pt-3" />
        <div className="row w-100 pt-3">
          <UnfulfilledWishes isLoaded={isLoaded} unfulfilledWishes={unfulfilledWishes} />
        </div>
      </div>
    </div>
  );
}
