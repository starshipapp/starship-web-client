import gql from "graphql-tag";

const onMessageRemoved = gql`
  subscription OnMessageRemovedt($channelId: ID!) {
    messageRemoved(channelId: $channelId) {
      id 
    }
  }
`;

export default onMessageRemoved;
