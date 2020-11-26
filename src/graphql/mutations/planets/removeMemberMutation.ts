import { gql } from "@apollo/client";
import IPlanet from "../../../types/IPlanet";

export interface IRemoveMemberMutationData {
  removeMember: IPlanet;
}

const removeMemberMutation = gql`
  mutation RemoveMember($planetId: ID!, $userId: ID!) {
    removeMember(planetId: $planetId, userId: $userId) {
      id
      members {
        id
      }
    }
  }
`;

export default removeMemberMutation;