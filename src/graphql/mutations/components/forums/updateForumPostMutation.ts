import { gql } from "@apollo/client";
import IForumPost from "../../../../types/IForumPost";

export interface IUpdateForumPostMutationData {
  updateForumPost: IForumPost;
}

const updateForumPostMutation = gql`
  mutation UpdateForumPost($postId: ID!, $content: String!) {
    updateForumPost(postId: $postId, content: $content) {
      id
      content
    }
  }
`;

export default updateForumPostMutation;