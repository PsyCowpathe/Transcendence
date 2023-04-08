import React, { useState } from "react";
import {useEffect } from 'react';
import { AffMyUserPage } from "../Pages/UserPage";
import '../NewChat/truc.css'
import { AffTheUser } from "../Pages/UserModalPage";
import ProfilePictureUploader from "../Pages/NewProfilPic";
interface User {
  name: string;
}

interface Props {

  onClose: () => void;
}

const PicModal: React.FC<Props> = ({ onClose }) => {
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
              <h2>New Pic</h2>
              <button onClick={handleCloseModal}>Close</button>
            </div>
            <div className="modal-body">
             <div className="test">
              <ProfilePictureUploader/>
              </div>
              <div/>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PicModal;