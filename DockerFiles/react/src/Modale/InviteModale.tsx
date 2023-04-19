import React, { useState } from "react";
import {useEffect } from 'react';
import '../css/modal.css'
import { ChangeLoginMod } from "../Pages/LoginModal";
import { Invite } from "../Pages/Invite";
interface User {
  name: string;
}

interface Props {

  onClose: () => void;
  channel : string | null
}

const InviteModale: React.FC<Props> = ({ onClose, channel }) => {
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
              <h2>Invite</h2>
              <button onClick={handleCloseModal}>Close</button>
            </div>
            <div className="modal-body">
             <div className="test">
              <Invite channel={channel} />
              </div>
              <div/>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InviteModale;