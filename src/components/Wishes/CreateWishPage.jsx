/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Form } from 'react-bootstrap';
import wishes from '../../abi/wishes.json';
// CUSTOM IMPORTS
import TestCryptoWalletAddress from '../Test/TestCryptoWalletAddress.jsx';

export default function CreateWishPage() {
  const defaultWish = {
    name: 'Your Christmas Wish',
    description: 'This Christmas, make a wish or play Santa and grant a wish!',
    image: 'https://www.foot.com/wp-content/uploads/2017/03/placeholder.gif',
    isDefault: true,
  };
  const allWishes = [
    ...Object.values(wishes),
  ];

  const [singleSelections, setSingleSelections] = useState([]);
  const [options] = useState(
    Object
      .entries(wishes)
      .map(
        (wish) => wish[1],
      ),
  );
  const [currentOption, setCurrentOption] = useState(defaultWish);
  const handleSetSingleSelections = (e) => {
    if (e.length === 0) {
      setCurrentOption(defaultWish);
    } else {
      let selectedIndex = -1;
      for (let i = 0; i < allWishes.length; i += 1) {
        if (allWishes[i].name === e[0].name) {
          selectedIndex = i;
        }
      }
      setCurrentOption(allWishes[selectedIndex]);
    }
    setSingleSelections(e);
  };

  const divStyle = {
    backgroundImage: `url(${currentOption.image})`,
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
                  <button type="button" className="btn btn-primary" disabled={(singleSelections.length === 0)}>Make Wish</button>
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
                    <p className="card-text mb-0">{currentOption.description}</p>
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
