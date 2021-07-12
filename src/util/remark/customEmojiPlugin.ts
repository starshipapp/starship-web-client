// Unified types are really bad, we need to ignore a whole bunch of
// errors to get this to work
/* eslint-disable @typescript-eslint/ban-ts-comment */
import ICustomEmoji from "../../types/ICustomEmoji";
import { Transformer, Plugin } from "unified";
import {findAndReplace, ReplaceFunction} from 'mdast-util-find-and-replace';

interface ICustomEmojiPluginOptions {
  planetEmojis?: ICustomEmoji[],
  userEmojis?: ICustomEmoji[],
}

const RE_EMOJI = /:\+1:|:-1:|:[\w-]+:/g;

const customEmojiPlugin: Plugin<[ICustomEmojiPluginOptions]> = function(options) {
  let emojis: ICustomEmoji[] = [];


  if(options.planetEmojis) {
    emojis = emojis.concat(options.planetEmojis);
  }

  if(options.userEmojis) {
    emojis = emojis.concat(options.userEmojis);
  }

  // @ts-ignore
  const replace: ReplaceFunction = function(match) {
    const emojiString = (match as string).replace(/:/g, "");
    const emojiSearch = emojis.filter((value) => value.name && value.name === emojiString);
    if(emojiSearch[0]) {
      return {
        type: 'text',
        value: match as string,
        data: {
          hName: 'img',
          hProperties: { className: "Markdown-custom-emoji", src: emojiSearch[0].url }
        },
      };
    } else {
      return match as string;
    }
  };

  const transformer: Transformer = function(tree) {
    // @ts-ignore
    findAndReplace(tree, RE_EMOJI, replace);
  };

  return transformer;
};

export default customEmojiPlugin;