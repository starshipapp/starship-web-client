import gql from "graphql-tag";

export interface IDeletePlanetMutationData {
  deletePlanet: boolean
}

const deletePlanetMutation = gql`
  mutation DeletePlanet($planetId: ID!) {
    deletePlanet(planetId: $planetId)
  }
`;

export default deletePlanetMutation;