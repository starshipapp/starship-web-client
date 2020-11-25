import { gql } from "@apollo/client";
import IPlanet from "../../../types/IPlanet";

export interface ITogglePrivateMutationData {
  togglePrivate: IPlanet
}

const togglePrivateMutation = gql`
  mutation TogglePrivate($planetId: ID!) {
    togglePrivate(planetId: $planetId) {
      id
      private
    }
  }
`;

export default togglePrivateMutation;