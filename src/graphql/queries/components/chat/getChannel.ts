import { gql } from "@apollo/client";
import IChannel from "../../../../types/IChannel";

export interface IGetChannelData {
  channel: IChannel;
}

const getChannel = gql`
  query getChannel($id: ID!, $count: Int!, $pinnedCount: Int!, $cursor: String, $pinnedCursor: String) {
    channel(id: $id) {
      id
      name
      createdAt
      topic
      type
      unread
      mentioned
      lastRead
      pinnedMessages(limit: $pinnedCount, cursor: $pinnedCursor) {
        cursor
        messages {
          id
          createdAt
          content
          owner {
            id
            username
            profilePicture
            customEmojis {
              id
              name
              url
            }
          }
        }
      }
      messages(limit: $count, cursor: $cursor) {
        cursor
        messages {
          id
          content
          createdAt
          pinned
          edited
          owner {
            id
            username
            profilePicture
            admin
            banned
            createdAt
            customEmojis {
              id
              name
              url
            }
          }
          mentions {
            id
            username
          }
          reactions {
            emoji
            reactors
          }
          parent {
            id
            owner {
              profilePicture
              username
            }
            content
          }
          attachments {
            id
            name
            url
            type
          }
        }
      }
    }
  }       
`;

export default getChannel;