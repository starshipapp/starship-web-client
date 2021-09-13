import gql from "graphql-tag";

export interface IDeleteMessageMutationData {
  deleteMessage: boolean
}

const deleteMessageMutation = gql`
  mutation deleteMessage($messageId: ID!) {
    deleteMessage(messageId: $messageId)
  }
`;

export default deleteMessageMutation;