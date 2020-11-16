import { useQuery } from '@apollo/client';
import { Icon, Menu, MenuDivider, MenuItem, Position, Tooltip } from '@blueprintjs/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { IGetCurrentUserData } from '../graphql/queries/users/getCurrentUser';
import getSidebarUser from '../graphql/queries/users/getSidebarUser';
import './css/MainSidebar.css';

function MainSidebar(): JSX.Element {
  const { client, loading, data } = useQuery<IGetCurrentUserData>(getSidebarUser, { errorPolicy: 'all' });

  return (
    <div className="MainSidebar">
      <Menu className="MainSidebar-menu">
        <div className="MainSidebar-menu-logo">
          <Link to="/">starship</Link>
          <Tooltip content="EXPERIMENTAL NON-PRODUCTION BUILD" position={Position.RIGHT}>
            <Icon className="version-warning-icon" icon="warning-sign"/>
          </Tooltip>
        </div>
        {loading ? <MenuItem text="Loading..."/> : (data?.currentUser ? <>
          {data.currentUser.admin && <MenuItem icon="warning-sign" text="Admin"/>}
          <MenuDivider title="MY PLANETS"/>
          {data.currentUser.memberOf.map((value) => (
            <MenuItem icon="globe-network" key={value.id} text={value.name}/>
          ))}
          <MenuItem icon="new-object" text="New Planet"/>
          {data.currentUser.following.length > 0 && <MenuDivider title="FOLLOWING"/>}
          {data.currentUser.following.map((value) => (
            <MenuItem icon="globe-network" key={value.id} text={value.name}/>
          ))}
          <MenuDivider/>
          <MenuItem icon="user" text={data.currentUser.username}/>
          <MenuItem icon="settings" text="Settings"/>
          <MenuItem icon="log-out" text="Logout" onClick={() => {
            localStorage.removeItem("token");
            void client.resetStore();
          }}/>
        </> : <Link to="/login"><MenuItem icon="log-in" text="Login"/></Link>)}
      </Menu>
    </div>
  );
}

export default MainSidebar;
