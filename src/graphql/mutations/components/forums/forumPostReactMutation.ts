import { gql } from "@apollo/client";
import IForumPost from "../../../../types/IForumPost";

export interface IForumPostReactMutationData {
  forumPostReact: IForumPost
}

const forumPostReactMutation = gql`
  mutation ForumPostReact($postId: ID!, $emojiId: String!) {
    forumPostReact(postId: $postId, emojiId: $emojiId) {
      id
      reactions {
        emoji
        reactors
      }
    }
  }
`;

export default forumPostReactMutation;