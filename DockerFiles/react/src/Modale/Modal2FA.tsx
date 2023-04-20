import React, { useState } from "react";
import {useEffect } from 'react';
import { AffMyUserPage } from "../Pages/UserPage";
import '../css/modal.css'

import { AffTheUser } from "../Pages/UserModalPage";
import ProfilePictureUploader from "../Pages/NewProfilPic";
import { ChangeLogin } from "../Pages/LoginPage";
import { Set2FA } from "../Pages/Set2FA";
interface User {
  name: string;
}

interface Props {

  onClose: () => void;
}

const ModalSet2FA: React.FC<Props> = ({ onClose }) => {
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
          <div className="modaltwo">
            <div className="modal-header">
              <h2>2FA</h2>
              <button onClick={handleCloseModal}>Close</button>
            </div>
            <div className="modal-body">
             <div className="test">
              <Set2FA/>
              </div>
              <div/>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalSet2FA;