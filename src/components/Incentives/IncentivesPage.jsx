/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import setImage from './setImage.js';
// import useImage from './useImage.js';

function UnredeemedIncentive({
  user, incentive, myContract, points, unredeemedIncentives, setUnredeemedIncentives, setPoints,
}) {
  const image = setImage(incentive.imgURL);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [canRedeem] = useState((points >= Number(incentive.price)));
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
    <div className="unredeemed-incentive col-12 d-flex" key={`wish${incentive.id}`}>
      <div className="card w-100 mb-3">
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
                  <h6 className="card-title text-center d-lg-none ">{incentive.name}</h6>
                  <h5 className="card-title text-center d-none d-lg-block para-bold">{incentive.name}</h5>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-3 col-md-2">
              <div className="d-flex justify-content-center">
                <button type="button" className="btn btn-primary" disabled={buttonLoading || !canRedeem} onClick={handleButtonClick}>
                  <small className="para-bold-default">
                    Redeem
                  </small>
                </button>
              </div>
              <small className="d-block text-center para-bold-default">
                {incentive.price}
                {' '}
                Goodwill
              </small>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function UnredeemedIncentives({
  user, myContract, unredeemedIncentives, points, setUnredeemedIncentives, setPoints,
}) {
  if (unredeemedIncentives.length > 0) {
    return unredeemedIncentives.map((incentive) => (
      <UnredeemedIncentive
        user={user}
        myContract={myContract}
        key={`incentive${incentive.id}`}
        incentive={incentive}
        points={points}
        unredeemedIncentives={unredeemedIncentives}
        setUnredeemedIncentives={setUnredeemedIncentives}
        setPoints={setPoints}
      />
    ));
  }

  return (
    <div className="col-12">
      <p className="text-center para">There are no badges to be redeemed now. Please check back later!</p>
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
    <div className="container-fluid ps-vertical-nav d-flex">
      <div className="row w-100 pt-4 pb-4">
        <div className="col-12 page-panel">
          <h2 className="pt-1 text-center mb-3 header-bold">Redeem a Badge!</h2>
          <h4 className="text-center pb-3 para-bold">
            Goodwill Balance:
            {' '}
            {points}
          </h4>
          <hr />
          <UnredeemedIncentives
            user={user}
            myContract={myContract}
            points={Number(points)}
            unredeemedIncentives={unredeemedIncentives}
            setUnredeemedIncentives={setUnredeemedIncentives}
            setPoints={setPoints}
          />
        </div>
      </div>
    </div>
  );
}
