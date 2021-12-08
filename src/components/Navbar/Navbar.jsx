/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Offcanvas, CloseButton } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export default function Navbar({
  hasNavbar,
}) {
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleCloseOffCanvas = () => setShowOffcanvas(false);
  const handleShowOffCanvas = (e) => {
    e.preventDefault();
    setShowOffcanvas(true);
  };

  if (hasNavbar) {
    return (
      <>
        <nav className="navbar navbar-dark bg-dark fixed-top">
          <div className="container-fluid">
            <div className="row w-100">
              <div className="col-12">
                <a
                  className="navbar-menu"
                  href="/show-offcanvas"
                  role="button"
                  onClick={handleShowOffCanvas}
                >
                  <FontAwesomeIcon icon={faBars} />
                </a>

              </div>
            </div>
          </div>
        </nav>
        <Offcanvas className="text-white bg-dark" show={showOffcanvas} onHide={handleCloseOffCanvas}>
          <Offcanvas.Header>
            <Offcanvas.Title>Wish Upon a Santa</Offcanvas.Title>
            <CloseButton variant="white" onClick={handleCloseOffCanvas} />
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="d-flex flex-column">
              <ul className="offcanvas-body-top nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/" aria-current="page" onClick={handleCloseOffCanvas}>Home</Link>
                </li>
              </ul>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </>
    );
  }
  return null;
}
