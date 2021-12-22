/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import {
  Link,
} from 'react-router-dom';
import axios from 'axios';
// CUSTOM IMPORTS
import REACT_APP_BACKEND_URL from '../../modules/urls.mjs';
import getHash from '../../modules/hashing.mjs';

function UnfulfilledWish({
  user,
  wish,
  unfulfilledWishes,
  setUnfulfilledWishes,
  myContract,
  web3Instance,
}) {
  const [buttonLoading, setButtonLoading] = useState(false);
  const handleButtonClick = (e) => {
    e.preventDefault();
    setButtonLoading(true);

    myContract.methods.buyWish(user.address, wish.id)
      .send({ from: user.address, value: web3Instance.utils.toWei(String(wish.price), 'ether') })
      .on('receipt', (receipt) => {
        const remainingWishes = unfulfilledWishes
          .filter((unfulfilledWish) => wish.id !== unfulfilledWish.id);
        console.log('receipt:');
        console.log(receipt);
        setButtonLoading(false);
        setUnfulfilledWishes([...remainingWishes]);
      })
      .on('error', (err) => {
        console.log('err:');
        console.log(err);
        setButtonLoading(false);
      });

    // web3Instance.eth.sendTransaction({
    //   to: '0x3d8eE8c37c19aaA2a8674a4720BEc157d2a2e9E9',
    //   from: user.address,
    //   value: web3Instance.utils.toWei(String(wish.price), 'ether'),
    // }, (error, result) => {
    //   if (error) {
    //     console.log('send transaction error:');
    //     console.log(error);
    //   } else {
    //     console.log('send transaction result:');
    //     console.log(result);
    //   }
    // });
  };

  return (
    <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 d-flex" key={`wish${wish.id}`}>
      <div className="unfulfilled-wish-card card w-100 mb-3">
        <div className="card-body p-2">
          <div className="row">
            <div className="col-12">
              <div className="position-relative">
                <img
                  className="card-img-top img-fluid"
                  src={wish.imgURL}
                  alt=""
                />
                <div className="wish-card-overlay d-flex align-items-center justify-content-center flex-column">
                  <p className="mb-0">
                    <small>
                      <strong className="text-center">
                        {wish.baseName}
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
                  <Link className="d-block" to={`/users/${wish.wisherId}`}>
                    <img
                      className="img-fluid"
                      src={`https://avatars.dicebear.com/api/adventurer-neutral/${`${wish.wisherId}-${getHash((wish.wisherId + 23), wish.wisherAddress)}`}.svg`}
                      alt=""
                    />
                  </Link>
                </div>
                <div className="col-md-8 text-truncated-parent w-auto">
                  <p className="mb-0">
                    <strong>
                      <Link to={`/users/${wish.wisherId}`}>
                        {wish.wisherName}
                      </Link>
                    </strong>
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-2 d-block d-md-none col-12 text-center">
              <strong>
                <small>
                  {wish.price}
                  {' '}
                  ETH
                </small>
              </strong>
            </div>
            <div className="col-12 col-md-4 pt-2 pt-md-0">
              {
              !wish.isCurrentWisher
              && (
                <div className="d-flex justify-content-center">
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    disabled={buttonLoading}
                    onClick={handleButtonClick}
                  >
                    <small>Grant</small>
                  </button>
                </div>
              )
            }
            </div>
          </div>
          <div className="row pt-3">
            <div className="col-12 col-md-8">
              <p className="mb-0 text-center text-md-start">
                {wish.description}
              </p>
            </div>
            <div className="d-none d-md-block col-4 text-center">
              <strong>
                <small>
                  {wish.price}
                  {' '}
                  ETH
                </small>
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UnfulfilledWishes({
  user,
  myContract,
  isLoaded,
  unfulfilledWishes,
  setUnfulfilledWishes,
  web3Instance,
}) {
  if (isLoaded && unfulfilledWishes.length > 0) {
    return unfulfilledWishes.map((wish) => (
      <UnfulfilledWish
        user={user}
        myContract={myContract}
        key={`wish${wish.id}`}
        wish={wish}
        unfulfilledWishes={unfulfilledWishes}
        setUnfulfilledWishes={setUnfulfilledWishes}
        web3Instance={web3Instance}
      />
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

export default function WishListingsPage({
  myContract, user, web3Instance,
}) {
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
              myContract.methods.getAllListed().call()
                .then((res) => {
                  console.log('res on load:');
                  console.log(res);
                  const modifiedArr = res
                    .filter((option) => option.wishCreated && !option.isSold)
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
                            wisherId: users[i].id,
                            wisherAddress: users[i].walletAddress,
                            wisherName:
                              (modifiedOption.wisher === user.address)
                                ? 'You!'
                                : users[i].displayName,
                          };
                        }
                      }

                      return modifiedOption;
                    })
                    .sort((a, b) => ((a.id > b.id) ? -1 : 1));

                  console.log('wish listings:');
                  console.log([...modifiedArr]);
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
    <div className="container-fluid ps-vertical-nav d-flex">
      <div className="row w-100 pt-4 pb-4">
        <div className="col-12 page-panel">
          <div className="row w-100 pt-1">
            <div className="col-12 ms-auto me-auto">
              <h2 className="text-center mb-0">Wishes</h2>
            </div>
          </div>
          <div className="row w-100 pt-3">
            <div className="col-12 col-md-8 pb-3 ms-auto me-auto">
              <Link
                className="btn btn-primary w-100"
                to="/createwish"
                role="button"
              >
                Make a Wish!
              </Link>
            </div>
          </div>
          <hr />
          <div className="row w-100 pt-3">
            <UnfulfilledWishes
              user={user}
              myContract={myContract}
              isLoaded={isLoaded}
              unfulfilledWishes={unfulfilledWishes}
              setUnfulfilledWishes={setUnfulfilledWishes}
              web3Instance={web3Instance}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
