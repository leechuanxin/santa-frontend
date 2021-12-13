/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react';
import axios from 'axios';
// CUSTOM IMPORTS
import REACT_APP_BACKEND_URL from '../../modules/urls.mjs';
import TestCryptoWalletAddress from '../Test/TestCryptoWalletAddress.jsx';

export default function WishListingsPage({ user }) {
  useEffect(() => {
    console.log(user);
    if (user.user_id && user.address) {
      axios
        .get(`${REACT_APP_BACKEND_URL}/user/${user.user_id}-${user.address}/users`)
        .then(async (response) => {
          if (!response.data.error) {
            console.log('success:');
            console.log(response.data);
          } else {
            console.log('error:');
            console.log(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
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
          {/* Card 1 */}
          <div className="col-12 col-sm-6 col-md-3 d-flex">
            <div className="card w-100 mb-3">
              <img
                className="card-img-top img-fluid"
                src="https://picsum.photos/300/150?random=1"
                alt=""
              />
              <div className="card-body">
                <h5 className="card-title text-center">Card title</h5>

                <div className="mb-3">
                  <div className="text-center">
                    <span className="badge badge-pill bg-success">Wisher: justinwong98</span>
                  </div>
                  <div className="text-center">
                    <span className="badge badge-pill bg-success">Wisher Address: abcdef</span>
                  </div>
                </div>

                <p className="card-text text-center">
                  Some quick example text to build on the card title,
                  and make up the bulk of the card&apos;s content.
                </p>
                <h4 className="text-center">Price: 0.001 ETH</h4>
                <div className="d-flex justify-content-center">
                  <button type="button" className="btn btn-primary">Fulfill Wish!</button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Your Card */}
          <div className="col-12 col-sm-6 col-md-3 d-flex">
            <div className="card w-100 mb-3">
              <img
                className="card-img-top img-fluid"
                src="https://picsum.photos/300/150?random=2"
                alt=""
              />
              <div className="card-body">
                <h5 className="card-title text-center">Card title</h5>

                <div className="mb-3">
                  <div className="text-center">
                    <span className="badge badge-pill bg-dark">Wisher: You!</span>
                  </div>
                  <div className="text-center">
                    <span className="badge badge-pill bg-dark">Wisher Address: abcdef</span>
                  </div>
                </div>

                <p className="card-text text-center">
                  Some quick example text to build on the card title,
                  and make up the bulk of the card&apos;s content.
                </p>

                <h4 className="text-center">Price: 0.001 ETH</h4>

                <div className="text-center">
                  <div className="badge bg-dark text-wrap w-100">
                    Note to Justin:
                    Since you are the wisher of this wish,
                    you should not see a button here.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="col-12 col-sm-6 col-md-3 d-flex">
            <div className="card w-100 mb-3">
              <img
                className="card-img-top img-fluid"
                src="https://picsum.photos/300/150?random=3"
                alt=""
              />
              <div className="card-body">
                <h5 className="card-title text-center">Card title</h5>

                <div className="mb-3">
                  <div className="text-center">
                    <span className="badge badge-pill bg-success">Wisher: shingnan</span>
                  </div>
                  <div className="text-center">
                    <span className="badge badge-pill bg-success">Wisher Address: abcdef</span>
                  </div>
                </div>

                <p className="card-text text-center">
                  Some quick example text to build on the card title,
                  and make up the bulk of the card&apos;s content.
                </p>
                <h4 className="text-center">Price: 0.001 ETH</h4>
                <div className="d-flex justify-content-center">
                  <button type="button" className="btn btn-primary">Fulfill Wish!</button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Your Card */}
          <div className="col-12 col-sm-6 col-md-3 d-flex">
            <div className="card w-100 mb-3">
              <img
                className="card-img-top img-fluid"
                src="https://picsum.photos/300/150?random=4"
                alt=""
              />
              <div className="card-body">
                <h5 className="card-title text-center">Card title</h5>

                <div className="mb-3">
                  <div className="text-center">
                    <span className="badge badge-pill bg-dark">Wisher: You!</span>
                  </div>
                  <div className="text-center">
                    <span className="badge badge-pill bg-dark">Wisher Address: abcdef</span>
                  </div>
                </div>

                <p className="card-text text-center">
                  Some quick example text to build on the card title,
                  and make up the bulk of the card&apos;s content.
                </p>

                <h4 className="text-center">Price: 0.001 ETH</h4>

                <div className="text-center">
                  <div className="badge bg-dark text-wrap w-100">
                    Note to Justin:
                    Since you are the wisher of this wish,
                    you should not see a button here.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5 */}
          <div className="col-12 col-sm-6 col-md-3 d-flex">
            <div className="card w-100 mb-3">
              <img
                className="card-img-top img-fluid"
                src="https://picsum.photos/300/150?random=5"
                alt=""
              />
              <div className="card-body">
                <h5 className="card-title text-center">Card title</h5>

                <div className="mb-3">
                  <div className="text-center">
                    <span className="badge badge-pill bg-success">Wisher: kai</span>
                  </div>
                  <div className="text-center">
                    <span className="badge badge-pill bg-success">Wisher Address: abcdef</span>
                  </div>
                </div>

                <p className="card-text text-center">
                  Some quick example text to build on the card title,
                  and make up the bulk of the card&apos;s content.
                </p>

                <h4 className="text-center">Price: 0.001 ETH</h4>

                <div className="d-flex justify-content-center">
                  <button type="button" className="btn btn-primary">Fulfill Wish!</button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 6 */}
          <div className="col-12 col-sm-6 col-md-3 d-flex">
            <div className="card w-100 mb-3">
              <img
                className="card-img-top img-fluid"
                src="https://picsum.photos/300/150?random=6"
                alt=""
              />
              <div className="card-body">
                <h5 className="card-title text-center">Card title</h5>

                <div className="mb-3">
                  <div className="text-center">
                    <span className="badge badge-pill bg-success">Wisher: chuanxin</span>
                  </div>
                  <div className="text-center">
                    <span className="badge badge-pill bg-success">Wisher Address: abcdef</span>
                  </div>
                </div>

                <p className="card-text text-center">
                  Some quick example text to build on the card title,
                  and make up the bulk of the card&apos;s content.
                </p>

                <h4 className="text-center">Price: 0.001 ETH</h4>

                <div className="d-flex justify-content-center">
                  <button type="button" className="btn btn-primary">Fulfill Wish!</button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 7 */}
          <div className="col-12 col-sm-6 col-md-3 d-flex">
            <div className="card w-100 mb-3">
              <img
                className="card-img-top img-fluid"
                src="https://picsum.photos/300/150?random=7"
                alt=""
              />
              <div className="card-body">
                <h5 className="card-title text-center">Card title</h5>

                <div className="mb-3">
                  <div className="text-center">
                    <span className="badge badge-pill bg-success">Wisher: awongh</span>
                  </div>
                  <div className="text-center">
                    <span className="badge badge-pill bg-success">Wisher Address: abcdef</span>
                  </div>
                </div>

                <p className="card-text text-center">
                  Some quick example text to build on the card title,
                  and make up the bulk of the card&apos;s content.
                </p>

                <h4 className="text-center">Price: 0.001 ETH</h4>

                <div className="d-flex justify-content-center">
                  <button type="button" className="btn btn-primary">Fulfill Wish!</button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 8 */}
          <div className="col-12 col-sm-6 col-md-3 d-flex">
            <div className="card w-100 mb-3">
              <img
                className="card-img-top img-fluid"
                src="https://picsum.photos/300/150?random=8"
                alt=""
              />
              <div className="card-body">
                <h5 className="card-title text-center">Card title</h5>

                <div className="mb-3">
                  <div className="text-center">
                    <span className="badge badge-pill bg-success">Wisher: mr_t</span>
                  </div>
                  <div className="text-center">
                    <span className="badge badge-pill bg-success">Wisher Address: abcdef</span>
                  </div>
                </div>

                <p className="card-text text-center">
                  Some quick example text to build on the card title,
                  and make up the bulk of the card&apos;s content.
                </p>

                <h4 className="text-center">Price: 0.001 ETH</h4>

                <div className="d-flex justify-content-center">
                  <button type="button" className="btn btn-primary">Fulfill Wish!</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
