import { gql } from "@apollo/client";
import IPlanet from "../../../types/IPlanet";

export interface ISetDescriptionMutationData {
  setDescription: IPlanet
}

const setDescriptionMutation = gql`
  mutation SetDescription($planetId: ID!, $description: String!) {
    setDescription(planetId: $planetId, description: $description) {
      id
      description
    }
  }
`;

export default setDescriptionMutation;