import React, { useState } from "react";
import {useEffect } from 'react';
import '../css/modal.css'
import '../css/UserPage.css';


import { ChangeLoginMod } from "../Pages/LoginModal";


interface Props {

  onClose: () => void;
}

const LoginModal: React.FC<Props> = ({ onClose }) => {
  const [showModal, setShowModal] = useState(false);

useEffect(() => {
     setShowModal(true);
    }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    onClose();
  };
  return (
    <>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>New Login</h2>
              <button className="user-button"  onClick={handleCloseModal}>Close</button>
            </div>
            <div className="modal-body">
             <div className="test">
              <ChangeLoginMod/>
              </div>
              <div/>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginModal;