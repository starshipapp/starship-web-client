import gql from "graphql-tag";
import IPlanet from "../../../types/IPlanet";

export interface IToggleBanMutationData {
  toggleBan: IPlanet
}

const toggleBanMutation = gql`
  mutation ToggleBan($planetId: ID!, $userId: ID!) {
    toggleBan(planetId: $planetId, userId: $userId) {
      id
      banned {
        id
      }
    }
  }
`;

export default toggleBanMutation;
