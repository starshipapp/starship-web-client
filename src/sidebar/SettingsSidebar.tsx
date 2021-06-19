import { useQuery } from "@apollo/client";
import { MenuDivider, MenuItem } from "@blueprintjs/core";
import React from "react";
import { Link } from "react-router-dom";
import getCurrentUser, { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";
import permissions from "../util/permissions";
import PlanetSwitcher from "./PlanetSwitcher";

interface ISettingsSidebarProps {
  toggleHidden: () => void
}

function SettingsSidebar(props: ISettingsSidebarProps): JSX.Element {
  const { data: userData } = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });  

  return (<>
    <MenuItem
      icon="settings"
      text="Settings"
    >
      {userData?.currentUser && permissions.checkAdminPermission(userData.currentUser) && <MenuDivider title="ADMIN TOOLS"/>}
      {userData?.currentUser && <div className="PlanetSidebar-switcher">
        <PlanetSwitcher toggleHidden={props.toggleHidden}/>
      </div>}
    </MenuItem>
    <MenuDivider/>
    <Link className="link-button" to="/settings"><MenuItem text="Profile" icon="user"/></Link>
    <Link className="link-button" to="/settings/security"><MenuItem text="Security" icon="lock"/></Link>
    <Link className="link-button" to="/settings/emojis"><MenuItem text="Emojis" icon="emoji"/></Link>
    <Link className="link-button" to="/settings/notifications"><MenuItem text="Notifications" icon="notifications"/></Link>
    <MenuDivider/>
    <Link className="link-button" to="/settings/about"><MenuItem text="About Starship" icon="info-sign"/></Link>
  </>);
}

export default SettingsSidebar;