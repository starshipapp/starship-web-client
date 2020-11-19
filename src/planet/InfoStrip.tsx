import { useMutation, useQuery } from '@apollo/client';
import { Button, Divider, Icon, Tooltip } from '@blueprintjs/core';
import React, { useState } from 'react';
import followMutation, { IFollowMutationData } from '../graphql/mutations/planets/followMutation';
import getCurrentUser, { IGetCurrentUserData } from '../graphql/queries/users/getCurrentUser';
import Profile from '../profile/Profile';
import IPlanet from '../types/IPlanet';
import permissions from '../util/permissions';
import './css/InfoStrip.css';

interface IInfoStripProps {
  planet: IPlanet
}

function InfoStrip(props: IInfoStripProps): JSX.Element {
  const {data, loading, refetch} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const [follow] = useMutation<IFollowMutationData>(followMutation);
  const [showProfile, setProfile] = useState<boolean>(false);

  return (
    <div className={`InfoStrip`}>
      <Profile isOpen={showProfile} onClose={() => setProfile(false)} userId={props.planet.owner?.id as string}/>
      {props.planet.verified && <Tooltip content="Verified" className="InfoStrip-icon bp3-dark"><Icon icon="tick-circle"/></Tooltip>}
      {props.planet.partnered && <Tooltip content="Partnered" className="InfoStrip-icon bp3-dark"><Icon icon="unresolve"/></Tooltip>}
      {(props.planet.verified || props.planet.partnered) && <Divider/>}
      {<div className="InfoStrip-username" onClick={() => setProfile(true)}>Created by {props.planet.owner?.username}</div>}
      <Divider/>
      {(props.planet.followerCount !== null && props.planet.followerCount !== undefined) && <div className="InfoStrip-followers">{props.planet.followerCount} {props.planet.followerCount === 1 ? "Follower" : "Followers"}</div>}
      {(props.planet.followerCount === null || props.planet.followerCount === undefined) && <div className="InfoStrip-followers">0 Followers</div>}
      {!loading && data?.currentUser && <>
        <div className="InfoStrip">
          <Divider/>
          <Button text={(data?.currentUser.following && data?.currentUser.following.some(e => e.id === props.planet.id) ) ? "Unfollow" : "Follow"} onClick={() => {
            follow({variables: {planetId: props.planet.id}}).then(() => {
              void refetch();
            }).catch((error) => {
              console.log(error);
            });
          }}/>
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
