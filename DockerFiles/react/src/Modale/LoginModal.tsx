import React, { useState } from "react";
import {useEffect } from 'react';
import '../NewChat/truc.css'
import { ChangeLoginMod } from "../Pages/LoginModal";
interface User {
  name: string;
}

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
  console.log("nfdcjhvbdlkhfcnzfdc-")
  const pute : boolean = true
  return (
    <>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>New Login</h2>
              <button onClick={handleCloseModal}>Close</button>
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