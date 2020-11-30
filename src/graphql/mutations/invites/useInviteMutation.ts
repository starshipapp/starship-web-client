import { gql } from "@apollo/client";
import IPlanet from "../../../types/IPlanet";

export interface IUseInviteMutationData {
  useInvite: IPlanet
}

const useInviteMutation = gql`
  mutation UseInvite($id: ID!) {
    useInvite(inviteId: $id) {
      id
      members {
        id
      }
    }
  }
`;

export default useInviteMutation;