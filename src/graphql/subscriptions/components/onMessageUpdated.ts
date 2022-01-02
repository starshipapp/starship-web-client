import gql from "graphql-tag";

const onMessageUpdated = gql`
  subscription OnMessageUpdated($channelId: ID!) {
    messageUpdated(channelId: $channelId) {
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

export default onMessageUpdated;
