import gql from "graphql-tag";
import IChannel from "../../../../types/IChannel";

export interface ISetChannelTopicMutationData {
  setChannelTopic: IChannel
}

const setChannelTopicMutation = gql`
  mutation SetChannelTopic($channelId: ID!, $topic: String!) {
    setChannelTopic(channelId: $channelId, topic: $topic) {
      id
      topic
    }
  }
`;

export default setChannelTopicMutation;