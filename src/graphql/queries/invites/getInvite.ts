import { gql } from "@apollo/client";
import IInvite from "../../../types/IInvite";

export interface IGetInviteData {
  invite: IInvite
}

const getInvite = gql`
  query getInvite($id: ID!) {
    invite(id: $id) {
      id
      createdAt
      planet {
        id
        name
        owner {
          id
        }
        members {
          id
        }
      }
    }
  }
`;

export default getInvite;