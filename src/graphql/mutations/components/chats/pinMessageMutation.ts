import gql from "graphql-tag";
import IMessage from "../../../../types/IMessage";

export interface IPinMessageMutationData {
  pinMessage: IMessage
}

const pinMessageMutation = gql`
  mutation pinMessage($messageId: ID!) {
    pinMessage(messageId: $messageId) {
      id
      pinned
    }
  }
`;

export default pinMessageMutation;
