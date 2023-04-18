import React, { useState } from "react";
import {useEffect } from 'react';
import { AffMyUserPage } from "../Pages/UserPage";
import '../css/modal.css'

import { AffTheUser } from "../Pages/UserModalPage";
interface User {
  name: string;
  uid : number
}

interface Props {
  user: User;
  Channel : string | null;
  onClose: () => void;
}

const UserInfoModal: React.FC<Props> = ({ user, Channel, onClose }) => {
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
              <AffTheUser User={user} Channel={Channel}/>
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