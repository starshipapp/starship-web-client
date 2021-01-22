import { useMutation, useQuery } from '@apollo/client';
import { Button, Divider, Icon, Intent, Tooltip } from '@blueprintjs/core';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import followMutation, { IFollowMutationData } from '../graphql/mutations/planets/followMutation';
import getCurrentUser, { IGetCurrentUserData } from '../graphql/queries/users/getCurrentUser';
import Profile from '../profile/Profile';
import IPlanet from '../types/IPlanet';
import { GlobalToaster } from '../util/GlobalToaster';
import isMobile from '../util/isMobile';
import permissions from '../util/permissions';
import { reportObjectType } from '../util/reportTypes';
import './css/InfoStrip.css';
import ModTools from './ModTools';
import ReportDialog from './ReportDialog';

interface IInfoStripProps {
  planet: IPlanet
}

function InfoStrip(props: IInfoStripProps): JSX.Element {
  const {data, loading, refetch} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const [follow] = useMutation<IFollowMutationData>(followMutation); 
  const [showReport, setReport] = useState<boolean>(false);
  const [showProfile, setProfile] = useState<boolean>(false);
  const [showTools, setTools] = useState<boolean>(false);

  return (
    <div className={`InfoStrip`}>
      <ModTools
        isOpen={showTools}
        onClose={() => setTools(false)}
        planet={props.planet}
      />
      <Profile isOpen={showProfile} onClose={() => setProfile(false)} userId={props.planet.owner?.id ?? ""}/>
      <ReportDialog 
        isOpen={showReport} 
        onClose={() => setReport(false)}
        objectId={props.planet.id}
        objectType={reportObjectType.PLANET}
        userId={props.planet.owner?.id ?? ""}
      />
      {props.planet.verified && <Tooltip content="Verified" className="InfoStrip-icon bp3-dark"><Icon icon="tick-circle"/></Tooltip>}
      {props.planet.partnered && <Tooltip content="Partnered" className="InfoStrip-icon bp3-dark"><Icon icon="unresolve"/></Tooltip>}
      {(props.planet.verified || props.planet.partnered) && <Divider/>}
      {<div className="InfoStrip-username" onClick={() => setProfile(true)}><Icon icon="user" className="InfoStrip-indicator-icon"/>{props.planet.owner?.username}</div>}
      <Divider/>
      {(props.planet.followerCount !== null && props.planet.followerCount !== undefined) && <div className="InfoStrip-followers">{isMobile() && <Icon icon="people" className="InfoStrip-indicator-icon"/>}{props.planet.followerCount}{isMobile() ? "" : (props.planet.followerCount === 1 ? " Follower" : " Followers")}</div>}
      {(props.planet.followerCount === null || props.planet.followerCount === undefined) && <div className="InfoStrip-followers">{isMobile() && <Icon icon="people" className="InfoStrip-indicator-icon"/>}0{!isMobile() && " Followers"}</div>}
      {!loading && data?.currentUser && <>
        <div className="InfoStrip">
          <Tooltip content="Follow">
            <Button className="InfoStrip-follow" minimal={true} icon={(data?.currentUser.following && data?.currentUser.following.some(e => e.id === props.planet.id) ) ? "minus" : "plus"} onClick={() => {
              follow({variables: {planetId: props.planet.id}}).then(() => {
                void refetch();
              }).catch((error: Error) => {
                GlobalToaster.show({message: error.message, intent: Intent.DANGER});
              });
            }}/>
          </Tooltip>
          <Tooltip content="Report">
            <Button icon="flag" minimal={true} onClick={() => setReport(true)}/>
          </Tooltip>
        </div>
        {permissions.checkFullWritePermission(data?.currentUser, props.planet) && <div className="InfoStrip">
          <Divider/>
          <Link className="link-button" to={`/planet/${props.planet.id}/admin`}><Button text={isMobile() ? "" : "Admin"} icon="wrench" intent="danger" minimal={true}/></Link>
        </div>}
        {permissions.checkAdminPermission(data?.currentUser) && <div className="InfoStrip">
          <Divider/>
          <Button text={isMobile() ? "" : "Mod Tools"} icon="wrench" minimal={true} onClick={() => setTools(true)}/>  
        </div>}
      </>}
    </div>
  );
}

export default InfoStrip;
