import { useMutation, useQuery } from "@apollo/client";
import { Button, Intent, Spinner } from "@blueprintjs/core";
import React from "react";
import { useHistory, useParams } from "react-router-dom";
import useInviteMutation, { IUseInviteMutationData } from "../graphql/mutations/invites/useInviteMutation";
import getInvite, { IGetInviteData } from "../graphql/queries/invites/getInvite";
import getCurrentUser, { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";
import { GlobalToaster } from "../util/GlobalToaster";
import "./css/Invite.css";

interface IInviteParams {
  inviteId: string
}

function Invite(): JSX.Element {
  const {inviteId} = useParams<IInviteParams>();
  const {data: invite} = useQuery<IGetInviteData>(getInvite, { variables: {id: inviteId}, errorPolicy: 'all' });
  const {loading, data, refetch} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const [useInvite] = useMutation<IUseInviteMutationData>(useInviteMutation);
  const history = useHistory();

  const use = function() {
    console.log("a");
    // it thinks this is a hook
    // it is not
    // this is very annoying
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useInvite({variables: {id: invite?.invite.id}}).then((data) => {
      GlobalToaster.show({message: `Sucessfully joined ${invite?.invite.planet?.name ?? "unknown planet"}.`, intent: Intent.SUCCESS});
      history.push(`/planet/${data.data?.useInvite.id ?? "null"}`);
      void refetch();
    }).catch((err: Error) => {
      GlobalToaster.show({message: err.message, intent: Intent.DANGER});
    });
  };

  return (
    <>
      {invite || loading ? <div className="Invite">
        <div className="Invite-container">
          <div className="Invite-title">
            {invite?.invite ? <span>You&apos;ve been invited to become a member of</span> : <span>This invite does not exist or has been used.</span>}
          </div>
          {invite?.invite && <div className="Invite-name">
            {invite?.invite && <span>{invite.invite.planet && invite.invite.planet.name}</span>}
          </div>}
          {invite?.invite && data?.currentUser && (invite?.invite.planet?.members?.some(e => e.id === data?.currentUser.id) || invite?.invite.planet?.owner?.id === data?.currentUser?.id ? <Button text="You're already in this planet." disabled={true}/> : <Button text="Join" onClick={() => use()}/>)}
          {invite?.invite && !data?.currentUser && <p>Sign in to join</p>}
        </div>
        <div className="Invite-debug">
          inviteId: {inviteId}<br/>
          {invite?.invite && <span>planetId: {invite.invite.planet?.id}</span>}
        </div>
      </div> : <Spinner className="Invite-spinner"/>}
    </>
  );
}

export default Invite;