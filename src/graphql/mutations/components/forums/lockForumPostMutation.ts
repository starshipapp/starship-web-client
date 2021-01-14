import { gql } from "@apollo/client";
import IForumPost from "../../../../types/IForumPost";

export interface ILockForumPostMutationData {
  lockForumPost: IForumPost
}

const lockForumPostMutation = gql`
  mutation LockForumPost($postId: ID!) {
    lockForumPost(postId: $postId) {
      id
      locked
    }
  }
`;

export default lockForumPostMutation;