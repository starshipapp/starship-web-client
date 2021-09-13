import { gql } from "@apollo/client";
import IChannel from "../../../../types/IChannel";

export interface ICreateChannelMutationData {
  createChannel: IChannel;
}

const createChannelMutation = gql`
  mutation CreateChannel($chatId: ID!, $name: String!) {
    createChannel(chatId: $chatId, name: $name) {
      id
      name
      type
      topic
      createdAt
      unread
      mentioned
      lastRead
    }
  }
`;

export default createChannelMutation;