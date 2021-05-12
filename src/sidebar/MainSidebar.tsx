import { useMutation, useQuery } from '@apollo/client';
import { Button, Checkbox, Classes, Icon, Intent, Menu, MenuDivider, MenuItem, Popover, Position, ProgressBar, Tag } from '@blueprintjs/core';
import fileSize from 'filesize';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import insertPlanetMutation, { IInsertPlanetMutationData } from '../graphql/mutations/planets/insertPlanetMutation';
import getNotifications, { IGetNotificationsData } from '../graphql/queries/misc/getNotifications';
import getCurrentUser, { IGetCurrentUserData } from '../graphql/queries/users/getCurrentUser';
import getCap from '../util/getCap';
import getCapString from '../util/getCapString';
import { GlobalToaster } from '../util/GlobalToaster';
import isMobile from '../util/isMobile';
import './css/MainSidebar.css';
import Notifications from './Notifications';

function MainSidebar(): JSX.Element {
  const { client, loading, data, refetch } = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const { data: notifications, refetch: refetchNotifs} = useQuery<IGetNotificationsData>(getNotifications, {errorPolicy: 'all'});
  const [insertPlanet] = useMutation<IInsertPlanetMutationData>(insertPlanetMutation);
  const [planetName, setPlanetName] = useState<string>("");
  const [privatePlanet, setPrivate] = useState<boolean>(false);
  const [showPopout, setPopout] = useState<boolean>(false);
  const [isHidden, setHidden] = useState<boolean>(isMobile());

  const history = useHistory();
  const notifCount = notifications?.notifications ? notifications.notifications.filter((value) => value.isRead === false).length : 0;

  const createPlanet = function() {
    if(planetName === "") {
      GlobalToaster.show({message: "Please enter a name.", intent: Intent.DANGER});
      return;
    }

    insertPlanet({variables: {name: planetName, private: privatePlanet}}).then((value) => {
      if(value.data && value.data.insertPlanet) {
        GlobalToaster.show({message: "Planet sucessfully created!", intent: Intent.SUCCESS});
        void refetch();
        history.push("/planet/" + value.data.insertPlanet.id);
        setPopout(false);
        toggleHidden();
      } else {
        GlobalToaster.show({message: "An unknown data error occured.", intent: Intent.DANGER});
      }
    }).catch((error) => {
      GlobalToaster.show({message: "An unknown server error occured.", intent: Intent.DANGER});
    });
  };

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
        {loading ? <MenuItem text="Loading..."/> : (data?.currentUser ? <>
          {data.currentUser.admin && <Link className="link-button" to="/gadmin/"><MenuItem icon="warning-sign" text="Admin"/></Link>}
          <MenuDivider title="MY PLANETS"/>
          {data.currentUser.memberOf?.map((value) => (
            <Link onClick={toggleHidden} className="link-button" to={"/planet/" + value.id}><MenuItem icon="globe-network" key={value.id} text={value.name}/></Link>
          ))}
          <Popover 
            className="MainSidebar-insert-planet-popover" 
            modifiers={{preventOverflow: 
              {boundariesElement: 'window'}, 
              hide: {enabled: false}, 
              flip: {behavior: isMobile() ? "flip" : "counterclockwise"}
            }} 
            position={Position.RIGHT} 
            isOpen={showPopout}
            onClose={() => setPopout(false)}
          >
            <MenuItem icon="new-object" text="New Planet" className="MainSidebar-insert-planet-button" onClick={() => {
              setPopout(!showPopout);
              if(isMobile()) {
                setHidden(true);
              }
            }}/>
            <div className="MainSidebar-insert-planet-box">
              <input className={Classes.INPUT} value={planetName} onChange={(e) => setPlanetName(e.target.value)}/>
              <div className="MainSidebar-insert-planet-bottom">
                <Checkbox label="Private" checked={privatePlanet} onChange={() => setPrivate(!privatePlanet)} className="MainSidebar-insert-planet-checkbox" onKeyPress={(e) => {
                  if(e.key === "Enter") {
                    createPlanet();
                  }
                }}/>
                <Button small={true} className="MainSidebar-insert-planet-submit" text="Create" onClick={createPlanet}/>
              </div>
            </div>
          </Popover>
          {data.currentUser.following && data.currentUser.following.length > 0 && <MenuDivider title="FOLLOWING"/>}
          {data.currentUser.following?.map((value) => (
            <Link onClick={toggleHidden} className="link-button" to={"/planet/" + value.id}><MenuItem icon="globe-network" key={value.id} text={value.name}/></Link>
          ))}
          <MenuDivider/>
          <MenuItem 
            icon="user" 
            className="MainSidebar-notification-item"
            text={data.currentUser.username} 
            labelElement={notifCount > 0 ? <Tag className="MainSidebar-notif-icon" round={true} intent="danger">{notifCount}</Tag> : null} 
            onClick={() => {
              toggleHidden();
            }}
          > 
            {notifications && notifications.notifications && <Notifications notifications={notifications.notifications} refetch={() => refetchNotifs()}/>}
          </MenuItem>
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
            void client.cache.gc();
            void client.resetStore();
            toggleHidden();
          }}/>
        </> : <Link className="link-button" to="/login"><MenuItem icon="log-in" text="Login"/></Link>)}
      </Menu>
    </div>
  );
}

export default MainSidebar;
