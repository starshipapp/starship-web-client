import { useQuery } from '@apollo/client';
import { Divider, Icon, Intent, Menu, MenuDivider, MenuItem, ProgressBar } from '@blueprintjs/core';
import fileSize from 'filesize';
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import yn from 'yn';
import getCurrentUser, { IGetCurrentUserData } from '../graphql/queries/users/getCurrentUser';
import getCap from '../util/getCap';
import getCapString from '../util/getCapString';
import isMobile from '../util/isMobile';
import './css/MainSidebar.css';
import MessagesSidebar from './MessagesSidebar';
import Notifications from './Notifications';
import PlanetSidebar from './PlanetSidebar';
import PlanetSwitcher from './PlanetSwitcher';
import SettingsSidebar from './SettingsSidebar';

interface IMainSidebarProps {
  forcefullyResetLink: () => void
  context: string
}

interface IMainSidebarParams {
  planet?: string
  component?: string
}


function MainSidebar(props: IMainSidebarProps): JSX.Element {
  const { client, loading, data, refetch } = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const [isHidden, setHidden] = useState<boolean>(isMobile());
  const {planet, component} = useParams<IMainSidebarParams>();


  const toggleHidden = function() {
    if(isMobile()) {
      setHidden(!isHidden);
    }
  };

  let className = "MainSidebar";

  if(isHidden) {
    className += " MainSidebar-hidden";
  }

  return (
    <div className={className}>
      <Menu className="MainSidebar-menu">
        <div className="MainSidebar-menu-logo" onClick={toggleHidden} >
          <Link className="link-button" to="/"><div className="MainSidebar-logo"/></Link>
        </div>
        <Icon onClick={toggleHidden} icon="menu" className="MainSidebar-show-button"/>
        {props.context === "planet" && planet && <PlanetSidebar toggleHidden={toggleHidden} planet={planet ?? ""} home={!component} component={component ?? "not-an-id"}/>}
        {data?.currentUser && props.context === "settings" && <SettingsSidebar toggleHidden={toggleHidden}/>}
        {data?.currentUser && props.context === "messages" && <MessagesSidebar toggleHidden={toggleHidden}/>}
        {loading ? <MenuItem text="Loading..."/> : (data?.currentUser ? <>
          <div className="MainSidebar-user-spacer"/>
          <MenuDivider/>
          <Notifications currentUser={data.currentUser}/>
          <div className="MainSidebar-datacap">
            <div className="MainSidebar-datacap-text">
              {fileSize(data.currentUser.usedBytes ?? 0)} of {getCapString(data.currentUser)} used
            </div>
            <div className="MainSidebar-datacap-progress">
              <ProgressBar
                value={(data.currentUser.usedBytes ?? 0) / getCap(data.currentUser)}
                stripes={false}
                intent={(data.currentUser.usedBytes ?? 0) < getCap(data.currentUser) ? Intent.PRIMARY : Intent.DANGER}
              />
            </div>
          </div>
          <Link to="/settings" className="link-button"><MenuItem onClick={toggleHidden} icon="settings" text="Settings"/></Link>
          <MenuItem icon="log-out" text="Logout" onClick={() => {
            localStorage.removeItem("token");
            props.forcefullyResetLink();
            void client.cache.gc();
            void client.resetStore();
            toggleHidden();
          }}/>
        </> : <>
          <div className="MainSidebar-user-spacer"/>
          <Divider/>
          <Link className="link-button" to="/login"><MenuItem icon="log-in" text="Login"/></Link>
        </>)}
      </Menu>
    </div>
  );
}

export default MainSidebar;
