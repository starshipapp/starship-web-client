import React from "react";
import { Menu, MenuItem } from "@blueprintjs/core";
import "./css/GAdminSidebar.css";
import { Link } from "react-router-dom";

function GAdminSidebar(): JSX.Element {
  return (
    <div className="GAdminSidebar bp3-dark">
      <Menu className="GAdminSidebar-menu">
        <div className="GAdminSidebar-menu-logo">starship<span className="GAdminSidebar-version">admin</span></div>
        <Link className="link-button" to="/gadmin/"><MenuItem icon="home" text="Home"/></Link>
        <Link className="link-button" to="/gadmin/reports"><MenuItem icon="warning-sign" text="Reports"/></Link>
        <Link className="link-button" to="/gadmin/planets"><MenuItem icon="control" text="Planets"/></Link>
        <Link className="link-button" to="/gadmin/users"><MenuItem icon="user" text="Users"/></Link>
      </Menu>
    </div>
  );
}

export default GAdminSidebar;