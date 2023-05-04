import React from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import "../css/NavLink.css";
import { ToastContainer, toast } from 'react-toastify';

interface MyNavLinkProps extends NavLinkProps {
  label: string;
  activeClassName?: string;
}

const MyNavLink = ({ to, label, ...rest }: MyNavLinkProps) => {
  return (
    <NavLink
      to={to}

      className="nav-link"
      {...rest}
    >
      {label}
    </NavLink>
  );
};



export default MyNavLink;
