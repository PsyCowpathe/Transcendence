import React from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import "../css/NavLink.css";

interface MyNavLinkProps extends NavLinkProps {
  label: string;
}

const MyNavLink = ({ to, label, ...rest }: MyNavLinkProps) => {
  return (
    <NavLink
      to={to}

      className="navlink"
      {...rest}
    >
      {label}
    </NavLink>
  );
};



export default MyNavLink;