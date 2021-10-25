/* eslint-disable @typescript-eslint/ban-ts-comment */
import ReactMarkdown from "react-markdown";
import { NormalComponents } from "react-markdown/lib/complex-types";
import { SpecialComponents } from "react-markdown/lib/ast-to-react";

// remark plugins
import math from "remark-math";
import emoji from "remark-emoji";
import footnotes from "remark-footnotes";
import toc from "remark-toc";
// @ts-ignore
import slug from "remark-slug";
// @ts-ignore
import hint from "remark-hint";
// rehype plugins
import katex from "rehype-katex";
import customEmojiPlugin from "./remark/customEmojiPlugin";
import ICustomEmoji from "../types/ICustomEmoji";

import "./css/Markdown.css";
import mentionPlugin from "./remark/mentionPlugin";

interface IMarkdownProps {
  children: string
  planetEmojis?: ICustomEmoji[]
  userEmojis?: ICustomEmoji[]
}

function Markdown(props: IMarkdownProps): JSX.Element {
  const components: Partial<NormalComponents & SpecialComponents> = {
    /* code({node, className, ...props}) {
      const match = /language-(\w+)/.exec(className as string || '');
      return match
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ? <SyntaxHighlighter language={match[1]} PreTag="div" style={vs2015} {...props} />
        : <code className={className as string} {...props} />;
    }*/
  };

  return ( 
    <ReactMarkdown
      children={props.children}
      remarkPlugins={[math, emoji, footnotes, hint, toc, slug, mentionPlugin, [customEmojiPlugin, {planetEmojis: props.planetEmojis, userEmojis: props.userEmojis}]]}
      rehypePlugins={[katex]}
      components={components}
    />
  );
}

export default Markdown;
