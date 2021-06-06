import gql from "graphql-tag";

export interface IUploadCustomEmojiData {
  uploadCustomEmoji: string
}

const uploadCustomEmojiMutation = gql`
  mutation UploadCustomEmoji($name: String!, $size: Int!, $type: String!, planetId: ID) {
    uploadCustomEmoji(name: $name, size: $size, type: $type, planetId: $planetId)
  }
`;

export default uploadCustomEmojiMutation;