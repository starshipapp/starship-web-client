import { unified } from "unified";
import markdown from "remark-parse";
import gfm from "remark-gfm";
import math from "remark-math";
import { remarkToSlate } from "remark-slate-transformer";

function convertMdToSlate(toConvert: string) {
  return unified().use(markdown).use(gfm).use(math).use(remarkToSlate, {
    overrides: {
      "heading": (node, next) => ({
        type: "h" + String(node.depth),
        // eslint-disable-next-line
        children: next(node.children)
      }),
      "paragraph": (node, next) => ({
        type: "p",
        // eslint-disable-next-line
        children: next(node.children)
      }),
      "listItem": (node, next) => {
        return {
          type: "li",
          children: [{
            type: "lic",
            // eslint-disable-next-line
            children: next(node.children)
          }]
        };
      },
      "list": (node, next) => ({
        type: node.ordered ? "ol" : "ul",
        // eslint-disable-next-line
        children: next(node.children)
      }),
      "link": (node, next) => ({
        type: "a",
        url: node.url,
        // eslint-disable-next-line
        children: next(node.children)
      }),
    }
  }).processSync(toConvert).result;
}

export default convertMdToSlate;
