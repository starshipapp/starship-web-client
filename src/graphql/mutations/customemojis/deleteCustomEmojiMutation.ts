import gql from "graphql-tag";

export interface IDeleteCustomEmojiData {
  deleteCustomEmoji: boolean
}

const deleteCustomEmojiMutation = gql`
  mutation DeleteCustomEmoji($emojiId: ID!) {
    deleteCustomEmoji(emojiId: $emojiId)
  }
`;

export default deleteCustomEmojiMutation;