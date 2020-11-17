import { useQuery } from '@apollo/client';
import { Button, Divider, Icon, Tooltip } from '@blueprintjs/core';
import React from 'react';
import getCurrentUser, { IGetCurrentUserData } from '../graphql/queries/users/getCurrentUser';
import IPlanet from '../types/IPlanet';
import permissions from '../util/permissions';
import './css/InfoStrip.css';

interface IInfoStripProps {
  planet: IPlanet
}

function InfoStrip(props: IInfoStripProps): JSX.Element {
  const {data, loading} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });

  return (
    <div className={`InfoStrip`}>
      {props.planet.verified && <Tooltip content="Verified" className="InfoStrip-icon bp3-dark"><Icon icon="tick-circle"/></Tooltip>}
      {props.planet.partnered && <Tooltip content="Partnered" className="InfoStrip-icon bp3-dark"><Icon icon="unresolve"/></Tooltip>}
      {(props.planet.verified || props.planet.partnered) && <Divider/>}
      {<div className="InfoStrip-username">Created by {props.planet.owner?.username}</div>}
      <Divider/>
      {(props.planet.followerCount !== null && props.planet.followerCount !== undefined) && <div className="InfoStrip-followers">{props.planet.followerCount} {props.planet.followerCount === 1 ? "Follower" : "Followers"}</div>}
      {(props.planet.followerCount === null || props.planet.followerCount === undefined) && <div className="InfoStrip-followers">0 Followers</div>}
      {!loading && data?.currentUser && <>
        <div className="InfoStrip">
          <Divider/>
          <Button text={(data?.currentUser.following && data?.currentUser.following.includes({id: props.planet.id, name: props.planet.name}) ) ? "Unfollow" : "Follow"}/>
          <Tooltip content="Report">
            <Button icon="flag" minimal={true}/>
          </Tooltip>
        </div>
        {permissions.checkFullWritePermission(data?.currentUser, props.planet) && <div className="InfoStrip">
          <Divider/>
          <Button text="Admin" icon="wrench" intent="danger" minimal={true}/>  
        </div>}
        {permissions.checkAdminPermission(data?.currentUser) && <div className="InfoStrip">
          <Divider/>
          <Button text="Mod Tools" icon="wrench" minimal={true}/>  
        </div>}
      </>}
    </div>
  );
}

export default InfoStrip;
