/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// CUSTOM IMPORTS
import REACT_APP_BACKEND_URL from '../../modules/urls.mjs';
import TestCryptoWalletAddress from '../Test/TestCryptoWalletAddress.jsx';

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
                  <button type="button" className="btn btn-primary" disabled={buttonLoading} onClick={handleButtonClick}>Fulfill Wish!</button>
                </div>
              )
            }
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

export default function WishListingsPage({ myContract, user, web3Instance }) {
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
    <div className="container ps-5">
      <div className="row w-100 pt-3">
        <h2 className="pt-1 text-center mb-0">Wishes</h2>
        <TestCryptoWalletAddress />
        <div className="row w-100 pt-1">
          <div className="col-12 col-md-8 pb-3 ms-auto me-auto">
            <a
              className="btn btn-primary w-100"
              href="/makewish"
              role="button"
            >
              Make a Wish!
            </a>
          </div>
          <div className="col-12 col-md-8 pb-3 ms-auto me-auto">
            <a
              className="btn btn-primary w-100"
              href="/createwish"
              role="button"
            >
              Create your own Wish!
            </a>
          </div>
        </div>
        <hr />
        <div className="col-12 pt-3" />
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
  );
}
