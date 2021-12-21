/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Typeahead } from 'react-bootstrap-typeahead';
// CUSTOM IMPORTS
import TestCryptoWalletAddress from '../Test/TestCryptoWalletAddress.jsx';

export default function CreateWish({
  myContract, user, web3Instance, setPageState,
}) {
  const history = useHistory();
  const [wishName, setWishName] = useState('');
  const [wishDescription, setWishDescription] = useState('');
  const [wishBox, setWishBox] = useState(0);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [base, setBase] = useState([]);
  const [currentBase, setCurrentBase] = useState([]);
  const [baseName, setBaseName] = useState([]);
  const [singleSelections, setSingleSelections] = useState([]);
  useEffect(() => {
    myContract.methods.getAllBase().call()
      .then((res) => {
        setBase(res);
        const allBaseNames = res.map((baseTemplate) => baseTemplate[0]);
        setBaseName([...allBaseNames]);
      });
    setPageState('wishes');
  }, []);
  const handleButtonClick = (e) => {
    console.log(wishBox);
    e.preventDefault();
    myContract.methods.mintNFT(`https://gateway.pinata.cloud/ipfs/QmejHEyWmCigv618VaXPiLvfRURniTZV74wHy4MDkwNpfe/${wishBox}.png`, web3Instance.utils.toWei(String(currentBase.price), 'ether'), wishName, currentBase.name, wishDescription)
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
    console.log(e[0]);
    if (e === '') {
      setCurrentBase(base[0]);
    } else {
      let selectedIndex = -1;
      for (let i = 0; i < base.length; i += 1) {
        if (base[i].name === e[0]) {
          selectedIndex = i;
        }
      }
      console.log(base[selectedIndex]);
      setCurrentBase(base[selectedIndex]);
    }
    setSingleSelections(e);
  };
  const boxArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const divStyle = {
    backgroundImage: `url(https://gateway.pinata.cloud/ipfs/QmejHEyWmCigv618VaXPiLvfRURniTZV74wHy4MDkwNpfe/${wishBox}.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
  };
  return (
    <div className="container ps-5">
      <div className="row w-100 pt-3">
        <h2 className="pt-1 text-center mb-0">Create A Wish</h2>
        <TestCryptoWalletAddress />
        <hr />
        <div className="col-12 pt-3">
          <div className="row">
            <div className="col-12 col-md-9 mb-3 d-flex align-items-center">
              <div className="row w-100">
                <Form.Group>
                  <Form.Label>What does your wish fall under?</Form.Label>
                  <Typeahead
                    className="mb-3"
                    id="basic-typeahead-single"
                    labelKey="name"
                    onChange={handleBaseChange}
                    options={baseName}
                    placeholder="Select a Wish..."
                    selected={singleSelections}
                    disabled={transactionLoading}
                  />
                  <Form.Label>Type in Your Wish</Form.Label>
                  <Form.Control
                    size="lg"
                    type="text"
                    placeholder="Enter Wish Name"
                    required
                    onChange={(e) => setWishName(e.target.value)}
                  />
                  <Form.Control as="textarea" rows={3} placeholder="Describe this wish" required onChange={(e) => setWishDescription(e.target.value)} />
                  {/* <Form.Control size="lg" type="number" placeholder="Set your
                  Wish Price in ETH" required onChange={(e) => setWishPrice(e.target.value)} /> */}
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
            <div className="mb-3 col-12 col-md-3">
              <div className="create-wish-card card bg-dark text-white w-100">
                <div className="card-img" style={divStyle} alt="" />
                <div className="card-img-overlay d-flex align-items-center">
                  <div>
                    {' '}
                    <h5 className="card-title">{wishName}</h5>
                    <p className="card-text">
                      {currentBase.name}
                      <br />
                      {wishDescription}
                    </p>
                    <p className="card-text mb-0">
                      <strong>Price:</strong>
                      {' '}
                      {(Number(currentBase.price) / (10 ** 18))}
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
