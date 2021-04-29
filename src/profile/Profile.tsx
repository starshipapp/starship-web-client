import { useMutation, useQuery } from "@apollo/client";
import { AnchorButton, Classes, Dialog, Divider, Intent, Tag } from "@blueprintjs/core";
import React from "react";
import toggleBanMutation, { IToggleBanMutationData } from "../graphql/mutations/planets/toggleBanMutation";
import banUserMutation, { IBanUserMutationData } from "../graphql/mutations/users/banUserMutation";
import getCurrentUser, { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";
import getUser, { IGetUserData } from "../graphql/queries/users/getUser";
import IPlanet from "../types/IPlanet";
import fixPFP from "../util/fixPFP";
import { GlobalToaster } from "../util/GlobalToaster";
import permissions from "../util/permissions";
import "./css/Profile.css";

interface IProfileProps {
  onClose: () => void,
  isOpen: boolean,
  planet?: IPlanet,
  userId: string
}

function Profile(props: IProfileProps): JSX.Element {
  const { data, loading, refetch } = useQuery<IGetUserData>(getUser, {variables: {id: props.userId}});
  const { data: currentData, loading: currentLoading } = useQuery<IGetCurrentUserData>(getCurrentUser, {errorPolicy: "all"});
  const [banUser] = useMutation<IBanUserMutationData>(banUserMutation);
  const [toggleBan] = useMutation<IToggleBanMutationData>(toggleBanMutation);
  const creationDateText = (!loading && data?.user && data?.user.createdAt) ? new Date(Number(data.user.createdAt)).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "loading";

  return (
    <Dialog className="bp3-dark" title={data?.user && data.user.username} onClose={props.onClose} isOpen={props.isOpen}>
      {loading ? <div></div> : (data?.user && <>
      <div className={Classes.DIALOG_BODY}>
        <div className="Profile-container">
          <div className="Profile-icon">
            {data.user.profilePicture ? <div className="Profile-pfp"><img alt={data.user.username} src={`${fixPFP(data.user.profilePicture)}?t=${Number(Date.now())}`} /></div> : <div className="Profile-pfp" />}
          </div>
          <div className="Profile-info">
            <div className="Profile-name">{data.user.username}</div>
            <div className="Profile-date">User since {creationDateText}</div>
            <Divider />
            <div className="Profile-tags">
              {data.user.admin && <Tag intent={Intent.DANGER}>Global Admin</Tag>}
              {data.user.banned && <Tag intent={Intent.DANGER}>Globally Banned</Tag>}
              {data.user.id.length === 17 && <Tag>Early Alpha Tester</Tag>}
            </div>
          </div>
        </div>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          {!currentLoading && currentData?.currentUser && permissions.checkAdminPermission(currentData.currentUser) && !permissions.checkAdminPermission(data.user) && <AnchorButton 
            text={data.user.banned ? "Global Unban" : "Global Ban"} 
            intent={Intent.DANGER}
            onClick={() => {
              banUser({variables: {userId: props.userId}}).then(() => {
                void refetch();
                GlobalToaster.show({message: "Sucessfully toggled ban state on user.", intent: Intent.SUCCESS});
              }).catch((err: Error) => {
                GlobalToaster.show({message: err.message, intent: Intent.DANGER});
              });
            }}
          />}
          {!currentLoading && props.planet && currentData?.currentUser && permissions.checkFullWritePermission(currentData.currentUser, props.planet) && !permissions.checkFullWritePermission(data.user, props.planet) && <AnchorButton
            text={(props.planet.banned && props.planet.banned.includes({id: props.userId})) ? "Unban" : "Ban"}
            intent={Intent.DANGER}
            onClick={() => {
              toggleBan({variables: {planetId: props.planet?.id, userId: props.userId}}).then(() => {
                void refetch();
                GlobalToaster.show({message: `Successfully ${(props.planet?.banned && props.planet.banned.includes({id: props.userId})) ? "un" : ""}banned user.`, intent: Intent.SUCCESS});
              }).catch((err: Error) => {
                GlobalToaster.show({message: err.message, intent: Intent.DANGER});
              });
            }}
          />}
          <AnchorButton text="Close" onClick={props.onClose} />
        </div>
      </div>
      </>)}
    </Dialog>
  );
}

export default Profile;