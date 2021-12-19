/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
// CUSTOM IMPORTS
import TestCryptoWalletAddress from '../Test/TestCryptoWalletAddress.jsx';

function UnredeemedIncentive({
  user, incentive, myContract, unredeemedIncentives, setUnredeemedIncentives, setPoints,
}) {
  const [buttonLoading, setButtonLoading] = useState(false);
  const handleButtonClick = (e) => {
    e.preventDefault();
    setButtonLoading(true);
    myContract.methods.redeem(user.address, incentive.id)
      .send({ from: user.address })
      .on('receipt', (receipt) => {
        const remainingIncentives = unredeemedIncentives
          .filter((unredeemedIncentive) => incentive.id !== unredeemedIncentive.id);
        console.log('receipt:');
        console.log(receipt);
        setButtonLoading(false);
        setUnredeemedIncentives([...remainingIncentives]);
        setPoints((currentPoints) => currentPoints - Number(incentive.price));
      })
      .on('error', (err) => {
        console.log('err:');
        console.log(err);
        setButtonLoading(false);
      });
  };

  return (
    <div className="col-12 col-sm-6 col-md-3 d-flex" key={`wish${incentive.id}`}>
      <div className="unfulfilled-wish-card card w-100 mb-3">
        <img
          className="card-img-top img-fluid"
          src={incentive.imgURL}
          alt=""
        />
        <div className="card-body">
          <h5 className="card-title text-center">{incentive.name}</h5>

          <p className="card-text text-center">
            {incentive.description}
          </p>
          <h4 className="text-center">
            {incentive.price}
            {' '}
            Goodwill
          </h4>
          <div className="d-flex justify-content-center">
            <button type="button" className="btn btn-primary" disabled={buttonLoading} onClick={handleButtonClick}>Redeem</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UnredeemedIncentives({
  user, myContract, unredeemedIncentives, setUnredeemedIncentives, setPoints,
}) {
  if (unredeemedIncentives.length > 0) {
    return unredeemedIncentives.map((incentive) => (
      <UnredeemedIncentive
        user={user}
        myContract={myContract}
        key={`incentive${incentive.id}`}
        incentive={incentive}
        unredeemedIncentives={unredeemedIncentives}
        setUnredeemedIncentives={setUnredeemedIncentives}
        setPoints={setPoints}
      />
    ));
  }

  return (
    <div className="col-12">
      <p className="text-center">There are no incentives to be redeemed now. Please check back later!</p>
    </div>
  );
}

export default function IncentivesPage({ myContract, user }) {
  const [unredeemedIncentives, setUnredeemedIncentives] = useState([]);
  const [points, setPoints] = useState(0);
  useEffect(() => {
    if (user.user_id && user.address) {
      myContract.methods.getPoints(user.address).call()
        .then((res) => {
          console.log('get points load:');
          console.log(res);
          setPoints(res);
        })
        .catch((error) => {
          console.log(error);
        });

      myContract.methods.getAllIncentive().call()
        .then((res) => {
          console.log('res on load:');
          console.log(res);
          const modifiedArr = res
            .filter((option) => !option.isClaimed)
            .map((option) => {
              const modifiedOption = {
                ...option,
                id: Number(option.id),
                price: Number(option.price),
                isCurrentWisher: (option.wisher === user.address),
              };

              return modifiedOption;
            })
            .sort((a, b) => ((a.id > b.id) ? -1 : 1));
          console.log('modifiedArr:');
          console.log([...modifiedArr]);
          setUnredeemedIncentives([...modifiedArr]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  return (
    <div className="container pt-5">
      <div className="row w-100 pt-3">
        <h2 className="pt-1 text-center mb-3">Incentives</h2>
        <h4 className="text-center">
          Goodwill Points:
          {' '}
          {points}
        </h4>
        <TestCryptoWalletAddress />
        <hr />
        <div className="col-12 pt-3" />
        <div className="row w-100 pt-3">
          <UnredeemedIncentives
            user={user}
            myContract={myContract}
            unredeemedIncentives={unredeemedIncentives}
            setUnredeemedIncentives={setUnredeemedIncentives}
            setPoints={setPoints}
          />
        </div>
      </div>
    </div>
  );
}
