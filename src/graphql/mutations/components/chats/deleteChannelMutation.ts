import gql from "graphql-tag";

export interface IDeleteChannelMutationData {
  deleteChannel: boolean;
}

const deleteChannelMutation = gql`
  mutation DeleteChannel($channelId: ID!) {
    deleteChannel(channelId: $channelId)
  }
`;

export default deleteChannelMutation;