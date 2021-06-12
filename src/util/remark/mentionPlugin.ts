// Unified types are really bad, we need to ignore a whole bunch of
// errors to get this to work
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Transformer, Plugin } from "unified";
import {findAndReplace, ReplaceFunction} from 'mdast-util-find-and-replace';

const RE_EMOJI = /(?:@)\b[-.\w]+\b/gu;

const mentionPlugin: Plugin = function() {
  // @ts-ignore
  const replace: ReplaceFunction = function(match) {
    return {
      type: 'text',
      value: match,
      data: {
        hName: 'span',
        hProperties: { className: "Markdown-mention" },
        hChildren: [{ type: "text", value: match }]
      }
    };
  };

  const transformer: Transformer = function(tree) {
    // @ts-ignore
    findAndReplace(tree, RE_EMOJI, replace);
  };

  return transformer;
};

export default mentionPlugin;