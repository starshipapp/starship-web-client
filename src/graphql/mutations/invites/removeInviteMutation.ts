import { gql } from "@apollo/client";
import IPlanet from "../../../types/IPlanet";

export interface IRemoveInviteMutationData {
  removeInvite: IPlanet
}

const removeInviteMutation = gql`
  mutation RemoveInvite($inviteId: ID!) {
    removeInvite(inviteId: $inviteId) {
      id
      invites {
        id
        createdAt
      }
    }
  }
`;

export default removeInviteMutation;