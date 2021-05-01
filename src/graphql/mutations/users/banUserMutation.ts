import gql from "graphql-tag";
import IUser from "../../../types/IUser";

export interface IBanUserMutationData {
  banUser: IUser
}

const banUserMutation = gql`
  mutation BanUser($userId: ID!) {
    banUser(userId: $userId) {
      id
      banned
    }
  }
`;

export default banUserMutation;