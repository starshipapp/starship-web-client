import { gql } from "@apollo/client";
import IPlanet from "../../../types/IPlanet";

export interface IUpdateNameMutationData {
  updateName: IPlanet
}

const updateNameMutation = gql`
  mutation UpdateName($planetId: ID!, $name: String!) {
    updateName(planetId: $planetId, name: $name) {
      id
      name
    }
  }
`;

export default updateNameMutation;