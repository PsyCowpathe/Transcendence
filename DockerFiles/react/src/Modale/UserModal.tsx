import React, { useState } from "react";
import {useEffect } from 'react';
import { AffMyUserPage } from "../Pages/UserPage";
import '../NewChat/truc.css'
import { AffTheUser } from "../Pages/UserModalPage";
interface User {
  name: string;
}

interface Props {
  user: User;
  onClose: () => void;
}

const UserInfoModal: React.FC<Props> = ({ user, onClose }) => {
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
              <h2>User Information</h2>
              <button onClick={handleCloseModal}>Close</button>
            </div>
            <div className="modal-body">
             <div className="test">
              <AffTheUser MyName={user}/>
              </div>
              <div/>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfoModal;