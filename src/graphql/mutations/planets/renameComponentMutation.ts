import { gql } from "@apollo/client";
import IPlanet from "../../../types/IPlanet";

export interface IRenameComponentMutationData {
  renameComponent: IPlanet
}

const renameComponentMutation = gql`
  mutation RenameComponent($planetId: ID!, $name: String!, $componentId: ID!) {
    renameComponent(planetId: $planetId, name: $name, componentId: $componentId) {
      id
      components {
        name
        componentId
        type
      }
    }
  }
`;

export default renameComponentMutation;