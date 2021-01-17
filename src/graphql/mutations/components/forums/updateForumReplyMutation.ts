import { gql } from "@apollo/client";
import IForumReply from "../../../../types/IForumReply";

export interface IUpdateForumReplyMutationData {
  updateForumReply: IForumReply
}

const updateForumReplyMutation = gql`
  mutation UpdateForumReply($replyId: ID!, $content: String!) {
    updateForumReply(replyId: $replyId, content: $content) {
      id
      content
    }
  }
`;

export default updateForumReplyMutation;