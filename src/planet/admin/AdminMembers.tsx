import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { Button, Icon, Intent, NonIdealState } from "@blueprintjs/core";
import React from "react";
import insertInviteMutation, { IInsertInviteMutationData } from "../../graphql/mutations/invites/insertInviteMutation";
import IPlanet from "../../types/IPlanet";
import { GlobalToaster } from "../../util/GlobalToaster";
import MemberTableItem from "./MemberTableItem";
import "./css/AdminMembers.css";
import getPlanet, { IGetPlanetData } from "../../graphql/queries/planets/getPlanet";
import removeInviteMutation, { IRemoveInviteMutationData } from "../../graphql/mutations/invites/removeInviteMutation";

interface IAdminMembersProps {
  planet: IPlanet
}

function AdminMembers(props: IAdminMembersProps): JSX.Element {
  const {refetch} = useQuery<IGetPlanetData>(getPlanet, {variables: {planet: props.planet.id}, errorPolicy: 'all'});
  const baseurl = window.location.protocol + "//" + window.location.host + "/invite/";
  const [insertInvite] = useMutation<IInsertInviteMutationData>(insertInviteMutation);
  const [removeInvite] = useMutation<IRemoveInviteMutationData>(removeInviteMutation);

  const createInvite = function() {
    insertInvite({variables: {planetId: props.planet.id}}).then(() => {
      GlobalToaster.show({message: "Successfully created invite.", intent: Intent.SUCCESS});
      void refetch();
    }).catch((err: Error) => {
      GlobalToaster.show({message: err.message, intent: Intent.DANGER});
    });
  };
 
  return (
    <div className="Admin-page  bp3-dark">
      <h2>Members</h2>
      <div className="AdminMembers-container">
        <div>
          <h3>Invites <Icon className="AdminMembers-add-icon" icon="plus" onClick={() => createInvite()}/></h3>
          {props.planet.invites && props.planet.invites.length > 0 && <table className="AdminComponents-table">
            <tbody>
              {props.planet.invites.map((value) => (
                <tr key={value.id}>
                  <td className="AdminComponents-table-name"><a href={baseurl + value.id}>{baseurl + value.id}</a></td>
                  <td className="AdminComponents-table-action"><Button intent="danger" small={true} minimal={true} icon="trash" onClick={() => {
                    removeInvite({variables: {inviteId: value.id}}).then(() => {
                      GlobalToaster.show({message: "Sucessfully removed invite.", intent: Intent.SUCCESS});
                    }).catch((err: ApolloError) => {
                      GlobalToaster.show({message: err.message, intent: Intent.DANGER});
                    });
                  }}/></td>
                </tr>
              ))}
            </tbody>
          </table>}
        </div>
        {props.planet.members && props.planet.members.length > 0 ? <table className="AdminComponents-table">
          <tbody>
            {props.planet.members.map((value) => (<MemberTableItem key={value.id} planetId={props.planet.id} userId={value.id}/>))}
          </tbody>
        </table> : <NonIdealState
          icon="people"
          title="No members!"
          description="Members can edit and add content to the planet. Members can also always access the planet, even when it's in private mode."
          action={<Button text="Create Invite" onClick={() => createInvite()}/>}
        />}
      </div>
    </div>
  );
}

export default AdminMembers;