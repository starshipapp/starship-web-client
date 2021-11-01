import { useMutation, useQuery } from "@apollo/client";
import insertInviteMutation, { IInsertInviteMutationData } from "../../graphql/mutations/invites/insertInviteMutation";
import IPlanet from "../../types/IPlanet";
import getPlanet, { IGetPlanetData } from "../../graphql/queries/planets/getPlanet";
import removeInviteMutation, { IRemoveInviteMutationData } from "../../graphql/mutations/invites/removeInviteMutation";
import SubPageHeader from "../../components/subpage/SubPageHeader";
import List from "../../components/list/List";
import ListItem from "../../components/list/ListItem";
import ListNoItems from "../../components/list/ListNoItems";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faPlus, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import Toasts from "../../components/display/Toasts";
import Button from "../../components/controls/Button";
import removeMemberMutation, { IRemoveMemberMutationData } from "../../graphql/mutations/planets/removeMemberMutation";
import Intent from "../../components/Intent";

interface IAdminMembersProps {
  planet: IPlanet
}

function AdminMembers(props: IAdminMembersProps): JSX.Element {
  const {refetch} = useQuery<IGetPlanetData>(getPlanet, {variables: {planet: props.planet.id}, errorPolicy: 'all'});
  const baseurl = window.location.protocol + "//" + window.location.host + "/invite/";
  const [insertInvite] = useMutation<IInsertInviteMutationData>(insertInviteMutation);
  const [removeInvite] = useMutation<IRemoveInviteMutationData>(removeInviteMutation);
  const [removeMember] = useMutation<IRemoveMemberMutationData>(removeMemberMutation);

  const createInvite = function() {
    insertInvite({variables: {planetId: props.planet.id}}).then(() => {
      Toasts.success("Invite created.");
      void refetch();
    }).catch((err: Error) => {
      Toasts.danger(err.message);
    });
  };
 
  return (
    <div className="w-full">
      <SubPageHeader>Members</SubPageHeader>
      <List
        className="mb-3"
        name={`${String(props.planet.members?.length ?? 0)} member${props.planet.members?.length === 1 ? "" : "s"}`}
      >
        {props.planet.members && props.planet.members.length > 0 ? props.planet.members.map((member) => {
          return (
            <ListItem
              key={member.id}
              actions={<Button
                small
                intent={Intent.DANGER}
                icon={faBan}
                onClick={() => {
                  removeMember({variables: {planetId: props.planet.id, userId: member.id}}).then(() => {
                    Toasts.success("Member removed.");
                    void refetch();
                  }).catch((err: Error) => {
                    Toasts.danger(err.message);
                  });
                }}
              />}
            >{member.username}</ListItem>
          );
        }) : <ListNoItems
          actions={<Button
            small
          >Create Invite</Button>}
          icon={<FontAwesomeIcon icon={faUser}/>}
        >No members</ListNoItems>}
      </List>
      <SubPageHeader>Invites</SubPageHeader>
      <List
        name={`${String(props.planet.invites?.length ?? 0)} invite${props.planet.invites?.length === 1 ? "" : "s"}`}
        actions={<Button
          small
          minimal
          onClick={createInvite}
          icon={faPlus}
        >Create Invite</Button>}
      >
        {props.planet.invites && props.planet.invites.length > 0 ? props.planet.invites.map((invite) => {
          return (
            <ListItem
              key={invite.id}
              actions={<Button
                small
                intent={Intent.DANGER}
                icon={faTrash}
                onClick={() => {
                  removeInvite({variables: {inviteId: invite.id}}).then(() => {
                    Toasts.success("Invite removed.");
                    void refetch();
                  }).catch((err: Error) => {
                    Toasts.danger(err.message);
                  });
                }}
              />}
            ><a href={baseurl + invite.id}>{baseurl + invite.id}</a></ListItem>
          );
        }) : <ListNoItems
          actions={<Button
            small
            onClick={createInvite}
          >Create Invite</Button>}
          icon={<FontAwesomeIcon icon={faUser}/>}
        >No invites</ListNoItems>}
      </List>
    </div>
  );
}

export default AdminMembers;
