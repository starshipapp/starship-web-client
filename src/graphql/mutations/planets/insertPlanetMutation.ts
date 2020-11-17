import { gql } from "@apollo/client";
import IPlanet from "../../../types/IPlanet";

export interface IInsertPlanetMutationData {
  insertPlanet: IPlanet
}

const insertPlanetMutation = gql`
  mutation InsertPlanet($name: String!, $private: Boolean!) {
    insertPlanet(name: $name, private: $private) {
      id
      name
    }
  }
`;

export default insertPlanetMutation;