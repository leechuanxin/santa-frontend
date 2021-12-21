/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Typeahead } from 'react-bootstrap-typeahead';
// CUSTOM IMPORTS
import giftbox1 from '../../images/1.png';
import giftbox2 from '../../images/2.png';
import giftbox3 from '../../images/3.png';
import giftbox4 from '../../images/4.png';
import giftbox5 from '../../images/5.png';
import giftbox6 from '../../images/6.png';
import giftbox7 from '../../images/7.png';
import giftbox8 from '../../images/8.png';
import giftbox9 from '../../images/9.png';
import giftbox10 from '../../images/10.png';
import giftbox11 from '../../images/11.png';
import giftbox12 from '../../images/12.png';

export default function CreateWish({
  myContract,
  user,
  web3Instance,
}) {
  const defaultWish = {
    name: 'Your Christmas Wish',
    price: 0,
  };

  const history = useHistory();
  const [wishName, setWishName] = useState('');
  const [wishDescription, setWishDescription] = useState('');
  const [wishBox, setWishBox] = useState(1);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [currentBase, setCurrentBase] = useState(defaultWish);
  const [singleSelections, setSingleSelections] = useState([]);
  const [fullyValidated, setFullyValidated] = useState(false);
  const [allBases, setAllBases] = useState([]);
  const [baseNames, setBaseNames] = useState([]);

  useEffect(() => {
    myContract.methods.getAllBase().call()
      .then((res) => {
        const modifiedArr = res
          .map((option) => {
            const modifiedOption = {
              ...option,
              baseName: option.name,
              price: (Number(option.price) / (10 ** 18)),
            };
            return modifiedOption;
          })
          .sort((a, b) => ((a.name < b.name) ? -1 : 1));

        const namesArr = modifiedArr.map((option) => option.name);

        setAllBases([...modifiedArr]);
        setBaseNames([...namesArr]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (
      singleSelections.length > 0
      && wishName.length > 0
      && wishDescription.length > 0
      && !Number.isNaN(Number(wishBox)) && wishBox > 0 && wishBox <= 12
    ) {
      if (!fullyValidated) {
        setFullyValidated(true);
      }
    } else if (fullyValidated) {
      setFullyValidated(false);
    }
  }, [singleSelections, wishName, wishDescription, wishBox]);

  const handleReturnImage = (id) => {
    switch (id) {
      case 1:
        return giftbox1;
      case 2:
        return giftbox2;
      case 3:
        return giftbox3;
      case 4:
        return giftbox4;
      case 5:
        return giftbox5;
      case 6:
        return giftbox6;
      case 7:
        return giftbox7;
      case 8:
        return giftbox8;
      case 9:
        return giftbox9;
      case 10:
        return giftbox10;
      case 11:
        return giftbox11;
      case 12:
        return giftbox12;
      default:
        return 'https://www.foot.com/wp-content/uploads/2017/03/placeholder.gif';
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    myContract.methods.mintNFT(`${handleReturnImage(wishBox)}`, web3Instance.utils.toWei(String(currentBase.price), 'ether'), wishName, currentBase.name, wishDescription)
      .send({ from: user.address })
      .on('receipt', (receipt) => {
        if (receipt.status) {
          history.push('/wishes');
        }
        setTransactionLoading(false);
      })
      .on('error', (err) => {
        console.log(err);
        setTransactionLoading(false);
      });
  };

  const handleBaseChange = (e) => {
    if (e.length === 0) {
      setCurrentBase({
        ...defaultWish,
        wishName,
      });
    } else {
      let selectedIndex = -1;
      for (let i = 0; i < allBases.length; i += 1) {
        if (allBases[i].name === e[0]) {
          selectedIndex = i;
        }
      }
      setCurrentBase(allBases[selectedIndex]);
    }
    setSingleSelections(e);
  };

  const boxArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const divStyle = {
    backgroundImage: `url(${handleReturnImage(wishBox)})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div className="container-fluid ps-vertical-nav d-flex">
      <div className="row w-100 pt-4 pb-4">
        <div className="col-12 page-panel">
          <div className="row">
            <div className="col-7 d-none d-sm-block">
              <h2 className="pt-1 mb-0">Make A Wish!</h2>
            </div>
            <div className="col-12 d-flex col-sm-5 justify-content-end">
              <button
                type="button"
                className="btn btn-primary"
                disabled={!fullyValidated || transactionLoading}
                onClick={(e) => { setTransactionLoading(true); handleButtonClick(e); }}
              >
                { transactionLoading ? 'Loading...' : 'Make Wish' }
              </button>
            </div>
          </div>
          <hr />
          <div className="col-12 pt-3">
            <div className="row">
              <div className="col-12 col-md-9 mb-3 d-flex align-items-center">
                <div className="row w-100">
                  <div className="col-12 mb-3">
                    <Form.Label>
                      <strong>
                        What do you wish for?
                      </strong>
                    </Form.Label>
                    <Typeahead
                      labelKey="name"
                      onChange={handleBaseChange}
                      options={baseNames}
                      placeholder="Type in your wish"
                      selected={singleSelections}
                      disabled={transactionLoading}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label htmlFor="namewish">
                      <strong>Name your wish!</strong>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="namewish"
                      name="namewish"
                      placeholder="Name this wish"
                      value={wishName}
                      onChange={(e) => setWishName(e.target.value)}
                      disabled={transactionLoading}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label htmlFor="describewish">
                      <strong>Describe your wish!</strong>
                    </label>
                    <textarea
                      type="text"
                      className="form-control"
                      id="describewish"
                      name="describewish"
                      placeholder="Describe this wish"
                      rows="3"
                      onChange={(e) => setWishDescription(e.target.value)}
                      disabled={transactionLoading}
                    >
                      {wishDescription}
                    </textarea>
                  </div>
                  <div className="col-12 mb-3">
                    <label>
                      <strong>Select your gift wrapping:</strong>
                    </label>
                    <div className="row">
                      { boxArray.map((boxType) => (
                        <div className="col-12 mt-2 col-sm-6 col-md-3" key={`giftBox${boxType}`}>
                          <div className="card w-100">
                            <div className="card-body">
                              <label className="cursor-pointer form-check-label w-100" htmlFor={`giftBox${boxType}`}>
                                <div className="row d-flex align-items-center">
                                  <div className="col-2">
                                    <input
                                      type="radio"
                                      name="boxArray"
                                      id={`giftBox${boxType}`}
                                      value={boxType}
                                      checked={(wishBox === boxType)}
                                      onChange={
                                      (e) => {
                                        setWishBox(Number(e.target.value));
                                      }
                                    }
                                      disabled={transactionLoading}
                                    />
                                  </div>
                                  <div className="col-10">

                                    <img
                                      className="img-fluid"
                                      src={handleReturnImage(boxType)}
                                      alt=""
                                    />
                                  </div>
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>
                      )) }
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-3 d-none d-md-block col-md-3">
                <div className="create-wish-card card bg-dark text-white w-100">
                  <div className="card-img" style={divStyle} alt="" />
                  <div className="card-img-overlay d-flex align-items-center">
                    <div>
                      {' '}
                      <h5 className="card-title">{wishName}</h5>
                      <p className="card-text">
                        <strong>{currentBase.name}</strong>
                        <br />
                        {wishDescription}
                      </p>
                      <p className="card-text mb-0">
                        <strong>Price:</strong>
                        {' '}
                        {currentBase.price}
                        {' '}
                        ETH
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <hr />
                <div className="row">
                  <div className="col-12 d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={!fullyValidated || transactionLoading}
                      onClick={(e) => { setTransactionLoading(true); handleButtonClick(e); }}
                    >
                      { transactionLoading ? 'Loading...' : 'Make Wish' }
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
