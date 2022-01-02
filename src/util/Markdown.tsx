/* eslint-disable @typescript-eslint/ban-ts-comment */
import ReactMarkdown from "react-markdown";
import { NormalComponents } from "react-markdown/lib/complex-types";
import { SpecialComponents } from "react-markdown/lib/ast-to-react";
import { memo } from "react";

// remark plugins
import math from "remark-math";
import emoji from "remark-emoji";
import toc from "remark-toc";
// @ts-ignore
import slug from "remark-slug";
// @ts-ignore
import hint from "remark-hint";
import gfm from "remark-gfm";


// rehype plugins
import katex from "rehype-katex";

// custom plgins
import customEmojiPlugin from "./remark/customEmojiPlugin";
import ICustomEmoji from "../types/ICustomEmoji";

import "./css/Markdown.css";
import mentionPlugin from "./remark/mentionPlugin";

interface IMarkdownProps {
  children: string
  className?: string
  planetEmojis?: ICustomEmoji[]
  userEmojis?: ICustomEmoji[]
  /**
   * Optimize for long form text. This will increase the font size of the
   * document to 16px inorder to make it more readable.
   *
   * @default false
   */
  longForm?: boolean
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


  const useLatex = (localStorage.getItem("useLatex")) ?? "html";
  const plugins = [emoji, hint, toc, slug, gfm, mentionPlugin, [customEmojiPlugin, {planetEmojis: props.planetEmojis, userEmojis: props.userEmojis}]];

  if(useLatex !== "false") {
    plugins.push(math);
  }

  return ( 
    <ReactMarkdown
      children={props.children}
      remarkPlugins={plugins}
      rehypePlugins={useLatex !== "false" ? [[katex, {output: useLatex === "true" ? "htmlAndMathml" : useLatex}]] : []}
      components={components}
      className={`${props.longForm ? "text-document" : ""} ${props.className ?? ""}`}
    />
  );
}

export default memo(Markdown, (prev, next) => {
  if(next.children !== prev.children) {
    return false;
  }
  if(next.className !== prev.className) {
    return false;
  }

  return true;
});

// export default Markdown;
