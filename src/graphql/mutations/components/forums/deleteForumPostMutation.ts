import { gql } from "@apollo/client";

export interface IDeleteForumPostMutationData {
  deleteForumPost: boolean
}

const deleteForumPostMutation = gql`
  mutation DeleteForumPost($postId: ID!) {
    deleteForumPost(postId: $postId)
  }
`;

export default deleteForumPostMutation;