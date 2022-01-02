import gql from "graphql-tag";
import IMessage from "../../../../types/IMessage";

export interface IReactToMessageMutationData {
  reactToMessage: IMessage
}

const reactToMessageMutation = gql`
  mutation reactToMessage($messageId: ID!, $emojiId: String!) {
    reactToMessage(messageId: $messageId, emojiId: $emojiId) {
      id
      reactions {
        emoji
        reactors
      }
    }
  }
`;

export default reactToMessageMutation;