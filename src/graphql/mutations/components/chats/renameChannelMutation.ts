import gql from "graphql-tag";
import IChannel from "../../../../types/IChannel";

export interface IRenameChannelMutationData {
  renameChannel: IChannel;
}

const renameChannelMutation = gql`
  mutation RenameChannel($channelId: ID!, $name: String!) {
    renameChannel(channelId: $channelId, name: $name) {
      id
      name
    }
  }
`;

export default renameChannelMutation;