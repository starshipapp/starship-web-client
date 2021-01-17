import { gql } from "@apollo/client";
import IForumReply from "../../../../types/IForumReply";

export interface IInsertForumReplyMutationData {
  insertForumReply: IForumReply
}

const insertForumReplyMutation = gql`
  mutation InsertForumReply($postId: ID!, $content: String!) {
    insertForumReply(postId: $postId, content: $content) {
      id
      content
    }
  }
`;

export default insertForumReplyMutation;