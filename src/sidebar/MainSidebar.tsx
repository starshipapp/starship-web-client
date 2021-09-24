import { useQuery } from '@apollo/client';
import { faCog, faGripLines, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import fileSize from 'filesize';
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProgressBar from '../components/display/ProgressBar';
import Intent from '../components/Intent';
import MenuItem from '../components/menu/MenuItem';
import Label from '../components/text/Label';
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
import logo from '../assets/images/logo.svg';
import blackLogo from '../assets/images/black-logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Divider from '../components/display/Divider';

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

  let className = "MainSidebar w-64 overflow-y-scroll overflow-x-visible";

  if(isHidden) {
    className += "MainSidebar-hidden";
  }

  return (
    <div className={className}>
      <div id="MainSidebar" className="max-w-5xl py-1 bg-gray-200 dark:bg-gray-800 min-h-full flex flex-col">
        <div className="px-3 py-2" onClick={toggleHidden} >
          <Link className="link-button" to="/">
            <img src={logo} alt="logo" className="h-7 hidden dark:block"/>  
            <img src={blackLogo} alt="logo" className="h-7 dark:hidden"/>  
          </Link>
        </div>
        <FontAwesomeIcon onClick={toggleHidden} icon={faGripLines} className="hidden"/>
        {props.context === "home" && <PlanetSwitcher toggleHidden={toggleHidden}/>}
        {props.context === "planet" && planet && <PlanetSidebar toggleHidden={toggleHidden} planet={planet ?? ""} home={!component} component={component ?? "not-an-id"}/>}
        {data?.currentUser && props.context === "settings" && <SettingsSidebar toggleHidden={toggleHidden}/>}
        {data?.currentUser && props.context === "messages" && <MessagesSidebar toggleHidden={toggleHidden}/>}
        {loading ? <MenuItem>Loading...</MenuItem>: (data?.currentUser ? <>
          <div className="mt-auto"/>
          <Divider/>
          <Notifications currentUser={data.currentUser}/>
          <div className="px-3 py-1.5">
            <Label>
              {fileSize(data.currentUser.usedBytes ?? 0)} of {getCapString(data.currentUser)} used
            </Label>
            <ProgressBar
              progress={(data.currentUser.usedBytes ?? 0) / getCap(data.currentUser)}
              intent={(data.currentUser.usedBytes ?? 0) < getCap(data.currentUser) ? Intent.PRIMARY : Intent.DANGER}
            />
          </div>
          <Link to="/settings" className="link-button"><MenuItem onClick={toggleHidden} icon={faCog}>Settings</MenuItem></Link>
          <MenuItem icon={faSignOutAlt} onClick={() => {
            localStorage.removeItem("token");
            props.forcefullyResetLink();
            void client.cache.gc();
            void client.resetStore();
            toggleHidden();
          }}>Logout</MenuItem>
        </> : <>
          <div className="mt-auto"/>
          <Divider/>
          <Link className="link-button" to="/login"><MenuItem icon={faSignOutAlt}>Login</MenuItem></Link>
        </>)}
      </div>
    </div>
  );
}

export default MainSidebar;
