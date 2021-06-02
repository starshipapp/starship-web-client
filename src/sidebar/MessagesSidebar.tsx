import { useQuery } from "@apollo/client";
import { MenuDivider, MenuItem } from "@blueprintjs/core";
import React from "react";
import { Link } from "react-router-dom";
import getCurrentUser, { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";
import permissions from "../util/permissions";
import PlanetSwitcher from "./PlanetSwitcher";

interface IMessagesSidebarProps {
  toggleHidden: () => void
}

function MessagesSidebar(props: IMessagesSidebarProps): JSX.Element {
  const { data: userData } = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });  
  return (<>
    <MenuItem
      icon="chat"
      text="Messages"
    >
      {userData?.currentUser && permissions.checkAdminPermission(userData.currentUser) && <MenuDivider title="ADMIN TOOLS"/>}
      {userData?.currentUser && <div className="PlanetSidebar-switcher">
        <PlanetSwitcher toggleHidden={props.toggleHidden}/>
      </div>}
    </MenuItem>
    <Link className="link-button" to="/messages"><MenuItem text="Notifications" icon="notifications"/></Link>
    <MenuDivider title="DIRECT MESSAGES"/>
  </>);
}

export default MessagesSidebar;