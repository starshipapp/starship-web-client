import { useQuery } from '@apollo/client';
import { faCog, faSignOutAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { filesize } from 'filesize';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProgressBar from '../components/display/ProgressBar';
import Intent from '../components/Intent';
import MenuItem from '../components/menu/MenuItem';
import Label from '../components/text/Label';
import getCurrentUser, { IGetCurrentUserData } from '../graphql/queries/users/getCurrentUser';
import getCap from '../util/getCap';
import getCapString from '../util/getCapString';
import MessagesSidebar from './MessagesSidebar';
import Notifications from './Notifications';
import PlanetSidebar from './PlanetSidebar';
import PlanetSwitcher from './PlanetSwitcher';
import SettingsSidebar from './SettingsSidebar';
import GAdminSidebar from './GAdminSidebar';
import logo from '../assets/images/logo.svg';
import blackLogo from '../assets/images/black-logo.svg';
import Divider from '../components/display/Divider';

interface IMainSidebarProps {
  forcefullyResetLink: () => void
  context: string
  hidden: boolean
  hide: () => void
}

function MainSidebar(props: IMainSidebarProps): JSX.Element {
  const { client, loading, data } = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const {planet, component} = useParams();

  let className = "absolute h-full top-0 left-0 w-full z-20 flex-shrink-0 overflow-y-scroll overflow-x-visible scrollbar-none md:z-auto md:static md:w-56 md:block";

  if(props.hidden) {
    className += " hidden";
  }

  return (
    <div className={className}>
      <div id="MainSidebar" className="py-1 bg-gray-200 dark:bg-gray-800 min-h-full flex flex-col">
        <div className="px-3 py-2" onClick={props.hide} >
          <Link className="link-button" to="/">
            <img src={logo} alt="logo" className="h-7 hidden dark:block"/>  
            <img src={blackLogo} alt="logo" className="h-7 dark:hidden"/>  
          </Link>
        </div>
        {props.context === "home" && <PlanetSwitcher toggleHidden={props.hide}/>}
        {props.context === "planet" && planet && <PlanetSidebar toggleHidden={props.hide} planet={planet ?? ""} home={!component} component={component ?? "not-an-id"}/>}
        {data?.currentUser && props.context === "settings" && <SettingsSidebar toggleHidden={props.hide}/>}
        {data?.currentUser && props.context === "messages" && <MessagesSidebar toggleHidden={props.hide}/>}
        {data?.currentUser?.admin && props.context === "gadmin" && <GAdminSidebar toggleHidden={props.hide}/>}
        {loading ? <MenuItem>Loading...</MenuItem>: (data?.currentUser ? <>
          <div className="mt-auto"/>
          <Divider/>
          <Notifications currentUser={data.currentUser}/>
          <div className="px-3 py-1.5">
            <Label>
              {filesize(data.currentUser.usedBytes ?? 0).toLocaleString()} of {getCapString(data.currentUser)} used
            </Label>
            <ProgressBar
              progress={(data.currentUser.usedBytes ?? 0) / getCap(data.currentUser)}
              intent={(data.currentUser.usedBytes ?? 0) < getCap(data.currentUser) ? Intent.PRIMARY : Intent.DANGER}
            />
          </div>
          <Link to="/settings" className="link-button"><MenuItem onClick={props.hide} icon={faCog}>Settings</MenuItem></Link>
          <MenuItem icon={faSignOutAlt} onClick={() => {
            localStorage.removeItem("token");
            props.forcefullyResetLink();
            void client.cache.gc();
            void client.resetStore();
            props.hide();
          }}>Logout</MenuItem>
        </> : <>
          <div className="mt-auto"/>
          <Divider/>
          <Link className="link-button" to="/login"><MenuItem icon={faSignOutAlt}>Login</MenuItem></Link>
        </>)}
        <div className="p-6 md:hidden"/>
      </div>
    </div>
  );
}

export default MainSidebar;
