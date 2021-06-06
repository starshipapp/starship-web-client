import { CustomEmoji } from "emoji-mart";
import ICustomEmoji from "../types/ICustomEmoji";

const generateEmojiMartEmojis = function(planetEmojis?: [ICustomEmoji], userEmojis?: [ICustomEmoji]): CustomEmoji[] {
  const emojiArray: CustomEmoji[] = [];

  if(planetEmojis) {
    for(const emoji of planetEmojis) {
      const emojiMartEmoji: CustomEmoji = {
        name: emoji.name ?? "unknown",
        short_names: [`ceid:${emoji.id}`],
        imageUrl: emoji.url ?? "unknown"
      };
      emojiArray.push(emojiMartEmoji);
    }
  }

  if(userEmojis) {
    for(const emoji of userEmojis) {
      const emojiMartEmoji: CustomEmoji = {
        name: emoji.name ?? "unknown",
        short_names: [`ceid:${emoji.id}`],
        imageUrl: emoji.url ?? "unknown"
      };
      emojiArray.push(emojiMartEmoji);
    }
  }

  return emojiArray;
};

export default generateEmojiMartEmojis;