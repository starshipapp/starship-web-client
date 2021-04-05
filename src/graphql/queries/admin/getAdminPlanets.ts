import gql from "graphql-tag";
import IPlanet from "../../../types/IPlanet";

export interface IGetAdminPlanetsData {
  adminPlanets: IPlanet[]
}

const getAdminPlanets = gql`
  query GetAdminPlanets($startNumber: Int!, $count: Int!) {
    adminPlanets(startNumber: $startNumber, count: $count) {
      id
      owner {
        id
        username
      }
      private
      followerCount
      components {
        componentId
      }
      members {
        id
      }
      createdAt
      name
    }
  }
`;

export default getAdminPlanets;