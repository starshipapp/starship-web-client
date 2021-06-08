import gql from "graphql-tag";
import IUser from "../../../types/IUser";

export interface IToggleBlockUserData {
  toggleBlockUser: IUser
}

const toggleBlockUserMutation = gql`
  mutation ToggleBlockUser($userId: ID!) {
    toggleBlockUser(userId: $userId) {
      id
      blockedUsers {
        id
        username
        profilePicture
      }
    }
  }
`;

export default toggleBlockUserMutation;