import gql from "graphql-tag";
import IMessage from "../../../../types/IMessage";

export interface IEditMessageMutationData {
  editMessage: IMessage
}

const editMessageMutation = gql`
  mutation editMessageMutation($messageId: ID!, $content: String!) {
    editMessage(messageId: $messageId, content: $content) {
      id
      content
      edited
    }
  }
`;

export default editMessageMutation;