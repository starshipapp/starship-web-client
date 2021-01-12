import { gql } from '@apollo/client';
import IUser from '../../../types/IUser';

export interface IGetUserData {
  user: IUser
}

const getUser = gql`
  query getUser($id: ID!) {
    user(id: $id) {
      id
      username
      admin
      profilePicture
      banned
      createdAt
    }
  }
`;

export default getUser;