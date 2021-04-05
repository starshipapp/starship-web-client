import gql from "graphql-tag";
import IUser from "../../../types/IUser";

export interface IGetAdminUsersData {
  adminUsers: IUser[]
}

const getAdminUsers = gql`
  query GetAdminUsers($startNumber: Int!, $count: Int!) {
    adminUsers(startNumber: $startNumber, count: $count) {
      id
      username
      createdAt
      banned
    }
  }
`;

export default getAdminUsers;