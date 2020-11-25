import { gql } from "@apollo/client";
import IPlanet from "../../../types/IPlanet";

export interface IRemoveComponentMutationData {
  removeComponent: IPlanet
}

const removeComponentMutation = gql`
  mutation RemoveComponent($planetId: ID!, $componentId: ID!) {
    removeComponent(planetId: $planetId, componentId: $componentId) {
      id
      components {
        name
        componentId
        type
      }
    }
  }
`;

export default removeComponentMutation;