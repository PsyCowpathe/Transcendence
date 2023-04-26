import React from "react";
import "../css/Buttons.css"; // fichier CSS pour la mise en forme du bouton

const Button = ({ onClick, children } : any) => {
  return (
    <button className=".button" onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;