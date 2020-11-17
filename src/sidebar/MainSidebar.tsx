import { useQuery } from '@apollo/client';
import { Icon, Menu, MenuDivider, MenuItem, Position, Tooltip } from '@blueprintjs/core';
import React from 'react';
import { Link } from 'react-router-dom';
import getCurrentUser, { IGetCurrentUserData } from '../graphql/queries/users/getCurrentUser';
import './css/MainSidebar.css';

function MainSidebar(): JSX.Element {
  const { client, loading, data } = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });

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
          {data.currentUser.memberOf?.map((value) => (
            <Link to={"/planet/" + value.id}><MenuItem icon="globe-network" key={value.id} text={value.name}/></Link>
          ))}
          <MenuItem icon="new-object" text="New Planet"/>
          {data.currentUser.following && data.currentUser.following.length > 0 && <MenuDivider title="FOLLOWING"/>}
          {data.currentUser.following?.map((value) => (
            <Link to={"/planet/" + value.id}><MenuItem icon="globe-network" key={value.id} text={value.name}/></Link>
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
