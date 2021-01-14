import { gql } from "@apollo/client";
import IForumPost from "../../../../types/IForumPost";

export interface IStickyForumPostMutationData {
  stickyForumPost: IForumPost
}

const stickyForumPostMutation = gql`
  mutation StickyForumPost($postId: ID!) {
    stickyForumPost(postId: $postId) {
      id
      stickied
    }
  }
`;

export default stickyForumPostMutation;