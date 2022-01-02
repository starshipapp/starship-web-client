import { gql } from "@apollo/client";
import IChat from "../../../../types/IChat";

export interface IGetChatData {
  chat: IChat
}

const getChat = gql`
  query getChat($id: ID!) {
    chat(id: $id) {
      id
      channels {
        id
        name
        type
        unread
        mentioned
        topic
      }
      unread
      mentioned
    }
  }
`;

export default getChat;