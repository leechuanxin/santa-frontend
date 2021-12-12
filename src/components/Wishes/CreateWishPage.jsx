/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
// CUSTOM IMPORTS
import TestCryptoWalletAddress from '../Test/TestCryptoWalletAddress.jsx';

export default function CreateWishPage({ myContract, user }) {
  const history = useHistory();
  const defaultWish = {
    name: 'Your Christmas Wish',
    description: 'This Christmas, make a wish or play Santa and grant a wish!',
    imgURL: 'https://www.foot.com/wp-content/uploads/2017/03/placeholder.gif',
    isDefault: true,
    price: 0,
  };
  const [allWishes, setAllWishes] = useState([]);
  const [singleSelections, setSingleSelections] = useState([]);
  const [options, setOptions] = useState([]);
  const [currentOption, setCurrentOption] = useState(defaultWish);

  useEffect(() => {
    myContract.methods.getAllListed().call()
      .then((res) => {
        const modifiedArr = res
          .map((option) => {
            const modifiedOption = {
              ...option,
              id: Number(option.id),
              price: (Number(option.price) / (10 ** 18)),
            };
            delete modifiedOption['0'];
            delete modifiedOption['1'];
            delete modifiedOption['2'];
            delete modifiedOption['3'];
            delete modifiedOption['4'];
            delete modifiedOption['5'];
            delete modifiedOption['6'];
            delete modifiedOption['7'];
            delete modifiedOption.gifter;
            delete modifiedOption.owner;
            delete modifiedOption.isSold;

            return modifiedOption;
          })
          .sort((a, b) => ((a.name < b.name) ? -1 : 1));
        const namesArr = modifiedArr.map((option) => option.name);
        setAllWishes([...modifiedArr]);
        setOptions([...namesArr]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSetSingleSelections = (e) => {
    if (e.length === 0) {
      setCurrentOption(defaultWish);
    } else {
      let selectedIndex = -1;
      for (let i = 0; i < allWishes.length; i += 1) {
        if (allWishes[i].name === e[0]) {
          selectedIndex = i;
        }
      }
      setCurrentOption(allWishes[selectedIndex]);
    }
    setSingleSelections(e);
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    if (singleSelections.length > 0) {
      myContract.methods.createWish(user.address, currentOption.id)
        .send({ from: user.address })
        .on('receipt', (receipt) => {
          if (receipt.status) {
            history.push('/wishes');
          }
        })
        .on('error', (err) => {
          console.log(err);
        });
    }
  };

  const divStyle = {
    backgroundImage: `url(${currentOption.imgURL})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div className="container pt-5">
      <div className="row w-100 pt-3">
        <h2 className="pt-1 text-center mb-0">Select A Wish</h2>
        <TestCryptoWalletAddress />
        <hr />
        <div className="col-12 pt-3">
          <div className="row">
            <div className="col-12 col-md-9 mb-3 d-flex align-items-center">
              <div className="row w-100">
                <Form.Group>
                  <Form.Label>Type in Your Wish</Form.Label>
                  <Typeahead
                    className="mb-3"
                    id="basic-typeahead-single"
                    labelKey="name"
                    onChange={handleSetSingleSelections}
                    options={options}
                    placeholder="Select a Wish..."
                    selected={singleSelections}
                  />
                  <button type="button" className="btn btn-primary" disabled={(singleSelections.length === 0)} onClick={handleButtonClick}>Make Wish</button>
                </Form.Group>
              </div>
            </div>
            <div className="mb-3 col-12 col-md-3">
              <div className="create-wish-card card bg-dark text-white w-100">
                <div className="card-img" style={divStyle} alt="" />
                <div className="card-img-overlay d-flex align-items-center">
                  <div>
                    {' '}
                    <h5 className="card-title">{currentOption.name}</h5>
                    <p className="card-text">{currentOption.description}</p>
                    <p className="card-text mb-0">
                      <strong>Price:</strong>
                      {' '}
                      {currentOption.price}
                      {' '}
                      ETH
                    </p>
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
