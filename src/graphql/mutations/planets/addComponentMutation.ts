import { gql } from "@apollo/client";
import IPlanet from "../../../types/IPlanet";

export interface IAddComponentMutationData {
  addComponent: IPlanet
}

const addComponentMutation = gql`
  mutation AddComponent($planetId: ID!, $name: String!, $type: String!) {
    addComponent(planetId: $planetId, name: $name, type: $type) {
      id
      components {
        name
        componentId
        type
      }
    }
  }
`;

export default addComponentMutation;