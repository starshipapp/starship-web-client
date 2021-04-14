import { gql } from '@apollo/client';
import IUser from '../../../types/IUser';

export interface IGetCurrentUserData {
  currentUser: IUser
}

const getCurrentUser = gql`
  query getCurrentUser {
    currentUser {
      id
      username
      admin
      profilePicture
      banned
      createdAt
      following {
        id
        name
        followerCount
        description
      }
      memberOf {
        id
        name
      }
      usedBytes
      capWaived
    }
  }
`;

export default getCurrentUser;