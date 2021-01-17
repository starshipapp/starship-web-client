import { gql } from "@apollo/client";

export interface IDeleteForumReplyMutationData {
  deleteForumReply: boolean
}

const deleteForumReplyMutation = gql`
  mutation DeleteForumReply($replyId: ID!) {
    deleteForumReply(replyId: $replyId)
  }
`;

export default deleteForumReplyMutation;