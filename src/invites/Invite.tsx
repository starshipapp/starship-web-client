import { useMutation, useQuery } from "@apollo/client";
import React from "react";
import { useHistory, useParams } from "react-router-dom";
import Button from "../components/controls/Button";
import Toasts from "../components/display/Toasts";
import useInviteMutation, { IUseInviteMutationData } from "../graphql/mutations/invites/useInviteMutation";
import getInvite, { IGetInviteData } from "../graphql/queries/invites/getInvite";
import getCurrentUser, { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";
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
    // it thinks this is a hook
    // it is not
    // this is very annoying
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useInvite({variables: {id: invite?.invite.id}}).then((data) => {
      Toasts.success(`Successfully joined ${invite?.invite.planet?.name ?? 'the planet'}!`);
      history.push(`/planet/${data.data?.useInvite.id ?? "null"}`);
      void refetch();
    }).catch((err: Error) => {
      Toasts.danger(err.message);
    });
  };

  return (
    <div className="dark-bg-gray-900 flex flex-col h-full w-full p-6 text-black dark:text-white">
      <div className="my-auto">
        <div className="font-extrabold text-2xl">
          {invite?.invite ? `You've been invited to` : (loading ? "Loading..." : "This invite does not exist or has been used.")}
        </div>
        <div className="font-extrabold text-5xl">
          {invite?.invite ? invite.invite.planet?.name : "Unknown Planet"}
        </div>
        <div>
          <Button
            className="mt-4"
            onClick={use}
            disabled={!invite?.invite}
          >Join</Button>
        </div>
      </div>
    </div>
  );
}

export default Invite;
