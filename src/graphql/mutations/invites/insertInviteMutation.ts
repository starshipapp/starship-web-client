import { gql } from "@apollo/client";
import IInvite from "../../../types/IInvite";

export interface IInsertInviteMutationData {
  insertInvite: IInvite
}

const insertInviteMutation = gql`
  mutation InsertInvite($planetId: ID!) {
    insertInvite(planetId: $planetId) {
      id
      createdAt
    }
  }
`;

export default insertInviteMutation;