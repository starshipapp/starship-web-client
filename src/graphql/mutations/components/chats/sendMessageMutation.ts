import gql from "graphql-tag";
import IMessage from "../../../../types/IMessage";

export interface ISendMessageMutationData {
  sendMessage: IMessage
}

const sendMessageMutation = gql`
  mutation sendMessage($channelId: ID!, $content: String!, $attachments: [ID], $replyTo: ID) {
    sendMessage(channelId: $channelId, content: $content, attachments: $attachments, replyTo: $replyTo) {
      id
      content
      createdAt
    }
  }
`;

export default sendMessageMutation;