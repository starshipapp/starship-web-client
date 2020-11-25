import { gql } from "@apollo/client";
import IPlanet from "../../../types/IPlanet";

export interface ISetCSSMutationData {
  setCSS: IPlanet
}

const setCSSMutation = gql`
  mutation SetCSS($planetId: ID!, $css: String!) {
    setCSS(planetId: $planetId, css: $css) {
      id
      css
    }
  }
`;
export default setCSSMutation;