import { gql } from '@apollo/client';

const getSidebarUser = gql`
  query getSidebarUser {
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
      }
      memberOf {
        id
        name
      }
    }
  }
`;

export default getSidebarUser;