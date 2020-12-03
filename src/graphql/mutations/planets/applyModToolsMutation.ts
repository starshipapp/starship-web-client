import { gql } from "@apollo/client";
import IPlanet from "../../../types/IPlanet";

export interface IApplyModToolsData {
  applyModTools: IPlanet
}

const applyModToolsMutation = gql`
  mutation ApplyModTools($planetId: ID!, $featured: Boolean!, $verified: Boolean!, $partnered: Boolean!, $featuredDescription: String!) {
    applyModTools(planetId: $planetId, featured: $featured, verified: $verified, partnered: $partnered, featuredDescription: $featuredDescription) {
      id
      featuredDescription
      featured
      verified
      partnered
    }
  }
`;

export default applyModToolsMutation;