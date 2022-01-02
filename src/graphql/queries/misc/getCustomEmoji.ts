import gql from "graphql-tag";
import ICustomEmoji from "../../../types/ICustomEmoji";

export interface IGetCustomEmojiData {
  customEmoji: ICustomEmoji
}

const getCustomEmoji = gql`
  query CustomEmoji($id: ID!) {
    customEmoji(id: $id) {
      id
      name
      url
      planet {
        name
      }
      user {
        username
      }
    }
  }
`;

export default getCustomEmoji;