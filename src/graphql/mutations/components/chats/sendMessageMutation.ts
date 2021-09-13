import gql from "graphql-tag";
import IMessage from "../../../../types/IMessage";

export interface ISendMessageMutationData {
  sendMessage: IMessage
}

const sendMessageMutation = gql`
  mutation sendMessage($channelId: ID!, $message: String!, attachments: [ID]!, replyTo: ID) {
    sendMessage(channelId: $channelId, message: $message, attachments: $attachments, replyTo: $replyTo) {
      id
      content
      createdAt
    }
  }
`;

export default sendMessageMutation;