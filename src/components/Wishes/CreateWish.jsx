/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
// CUSTOM IMPORTS
import TestCryptoWalletAddress from '../Test/TestCryptoWalletAddress.jsx';

export default function CreateWish({ myContract, user, web3Instance }) {
  const history = useHistory();
  const [wishName, setWishName] = useState('');
  const [wishDescription, setWishDescription] = useState('');
  const [wishPrice, setWishPrice] = useState('');
  const [wishBox, setWishBox] = useState(0);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const handleButtonClick = (e) => {
    console.log(wishBox);
    e.preventDefault();
    myContract.methods.mintNFT(`https://gateway.pinata.cloud/ipfs/QmejHEyWmCigv618VaXPiLvfRURniTZV74wHy4MDkwNpfe/${wishBox}.png`, web3Instance.utils.toWei(String(wishPrice), 'ether'), wishName, wishDescription)
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
  const boxArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  return (
    <div className="container pt-5">
      <div className="row w-100 pt-3">
        <h2 className="pt-1 text-center mb-0">Create A Wish</h2>
        <TestCryptoWalletAddress />
        <hr />
        <div className="col-12 pt-3">
          <div className="row">
            <div className="col-12 col-md-9 mb-3 d-flex align-items-center">
              <div className="row w-100">
                <Form.Group>
                  <Form.Label>Type in Your Wish</Form.Label>
                  <Form.Control
                    size="lg"
                    type="text"
                    placeholder="Enter Wish Name"
                    required
                    onChange={(e) => setWishName(e.target.value)}
                  />
                  <Form.Control as="textarea" rows={3} placeholder="Describe this wish" required onChange={(e) => setWishDescription(e.target.value)} />
                  <Form.Control size="lg" type="number" placeholder="Set your Wish Price in ETH" required onChange={(e) => setWishPrice(e.target.value)} />
                  <Form.Label>Select your giftbox design</Form.Label>
                  { boxArray.map((boxType) => (
                    <Form.Check
                      name="boxArray"
                      type="radio"
                      key={boxType}
                      label={boxType}
                      value={boxType}
                      onChange={(e) => {
                        console.log(e.target.value);
                        setWishBox(e.target.value); }}
                    />
                  )) }
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={transactionLoading}
                    onClick={(e) => { setTransactionLoading(true); handleButtonClick(e); }}
                  >
                    { transactionLoading ? 'Loading...' : 'Create Your Wish' }
                  </button>
                </Form.Group>
              </div>
            </div>
            {/* <div className="mb-3 col-12 col-md-3">
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
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
