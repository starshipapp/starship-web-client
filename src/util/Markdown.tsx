/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from 'react-syntax-highlighter';
import {vs2015} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { NormalComponents, SpecialComponents } from "react-markdown/src/ast-to-react";

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

interface IMarkdownProps {
  children: string
}

function Markdown(props: IMarkdownProps): JSX.Element {
  const components: Partial<NormalComponents & SpecialComponents> = {
    code({node, className, ...props}) {
      const match = /language-(\w+)/.exec(className as string || '');
      return match
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ? <SyntaxHighlighter language={match[1]} PreTag="div" style={vs2015} {...props} />
        : <code className={className as string} {...props} />;
    }
  };

  return ( 
    <ReactMarkdown
      children={props.children}
      remarkPlugins={[math, emoji, footnotes, hint, toc, slug]}
      rehypePlugins={[katex]}
      components={components}
    />
  );
}

export default Markdown;