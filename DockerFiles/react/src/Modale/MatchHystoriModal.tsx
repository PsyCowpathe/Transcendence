import React, { useState } from "react";
import {useEffect } from 'react';
import '../css/modal.css';
import { MatchHist } from "../Pages/MatchHistory";
interface User {
    name: string;
    uid : number
  }
  
  interface Props {
    User: User;
    onClose: () => void;
  }

const MatchHistMod: React.FC<Props> = ({ onClose, User }) => {
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
              <h2>Match History</h2>
              <button onClick={handleCloseModal}>Close</button>
            </div>
            <div className="modal-body">
             <div className="test">
              <MatchHist User={User} />
              </div>
              <div/>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MatchHistMod;