import gql from "graphql-tag";

const onMessageSent = gql`
  subscription OnMessageSent($channelId: ID!) {
    messageSent(channelId: $channelId) {
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
`;

export default onMessageSent;