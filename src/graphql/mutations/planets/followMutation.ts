import { gql } from "@apollo/client";
import IPlanet from "../../../types/IPlanet";

export interface IFollowMutationData {
  followPlanet: IPlanet
}

const followMutation = gql`
  mutation Follow($planetId: ID!) {
    followPlanet(planetId: $planetId) {
      id
      followerCount
    }
  }
`;

export default followMutation;