import { gql } from "@apollo/client";
import IForumReply from "../../../../types/IForumReply";

export interface IForumReplyReactMutationData {
  forumReplyReact: IForumReply
}

const forumReplyReactMutation = gql`
  mutation forumReplyReactMutation($replyId: ID!, $emojiId: String!) {
    forumReplyReact(replyId: $replyId, emojiId: $emojiId) {
      id
      reactions {
        emoji
        reactors
      }
    }
  }
`;

export default forumReplyReactMutation;