import { unified } from "unified";
import markdown from "remark-parse";
import gfm from "remark-gfm";
import math from "remark-math";
import { remarkToSlate } from "remark-slate-transformer";

interface MdastContent {
  type: string,
  value?: string,
  children?: MdastContent[]
}

function boilChildren(value: MdastContent[], isChild?: boolean) {
  let text = "";

  for(const content of value) {
    if(content.value) {
      text += content.value;
    }
    console.log(content.type, isChild);
    if(content.type === "paragraph" && (isChild || content !== value[0])) {
      text += "\n\n";
    }
    if(content.children) {
      text += boilChildren(content.children, true);
    }
  }

  return text;
}

function convertMdToSlate(toConvert: string) {
  console.log(toConvert);
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
        if(typeof(node.checked) == "boolean") {
          return {
            type: "action_item",
            checked: node.checked,
            // eslint-disable-next-line
            children: [{text: boilChildren(node.children)}]
          };
        }
        return {
          type: "li",
          children: [{
            type: "lic",
            // eslint-disable-next-line
            children: next(node.children)
          }]
        };
      },
      "list": (node, next) => {
        console.log(node.type, node.data);
        return {
          type: node.ordered ? "ol" : "ul",
          // eslint-disable-next-line
          children: next(node.children)
        };
      },
      "link": (node, next) => ({
        type: "a",
        url: node.url,
        // eslint-disable-next-line
        children: next(node.children)
      }),
      "code": (node, next) => ({
        type: "code_block",
        lang: "javascript",
        children: node.value.split("\n").map((value) => ({
          type: "code_line",
          children: [{text: value}]
        }))
      }),
      "blockquote": (node, next) => ({
        type: "blockquote",
        children: [{text: boilChildren(node.children)}]
      }),
      "tableRow": (node, next) => ({
        type: "tr",
        // eslint-disable-next-line
        children: next(node.children)
      }),
      "tableCell": (node, next) => ({
        type: "td",
        // eslint-disable-next-line
        children: next(node.children)
      }),
    }
  }).processSync(toConvert).result;
}



export default convertMdToSlate;
