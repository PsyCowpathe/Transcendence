import React from "react";
import "../css/NotFound.css";
import { useNavigate } from "react-router-dom";
import { TopBar } from "./TopBar";

const NotFound: React.FC = () => {
    const navigate = useNavigate();
    const ComeBackHome = () => {
        navigate("/changepic");
    };


  return (
    <div className="not-found-container">
      <h1 className="not-found-heading">Oops! 404 Page Not Found</h1>
      <p className="not-found-message">The page you are looking for does not exist.</p>
      <button onClick={ComeBackHome}>Come Back Home</button>
    </div>
  );
};

export default NotFound;