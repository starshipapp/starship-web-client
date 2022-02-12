import { CodeBlockElement, CodeLineElement, createBlockquotePlugin, createCodeBlockPlugin, createCodePlugin, createExitBreakPlugin, createHeadingPlugin, createLinkPlugin, createListPlugin, createParagraphPlugin,  createPlugins, createResetNodePlugin, createSoftBreakPlugin, createTablePlugin, createTodoListPlugin, createTrailingBlockPlugin, createUnderlinePlugin, ELEMENT_BLOCKQUOTE, ELEMENT_CODE_BLOCK, ELEMENT_PARAGRAPH, ELEMENT_TD, ELEMENT_TODO_LI, isBlockAboveEmpty, isSelectionAtBlockStart, KEYS_HEADING, LinkElement, StyledElement, StyledLeaf, TodoListElement, withProps } from "@udecode/plate";
import { createItalicPlugin } from "./marks/Italic";
import { createBoldPlugin } from "./marks/Bold";
import { createStrikethroughPlugin } from "./marks/Strikethrough";
import { createInlineCodePlugin } from "./marks/InlineCode";

function generatePlugins() {
  return createPlugins([
    // Blocks
    createParagraphPlugin(),
    createBlockquotePlugin(),
    createHeadingPlugin(),
    createListPlugin(),
    createCodeBlockPlugin(),
    createTodoListPlugin(),
    createTablePlugin(),

    // Inlines
    createLinkPlugin(),

    // Marks
    createItalicPlugin(),
    createBoldPlugin(),
    createStrikethroughPlugin(),
    createInlineCodePlugin(),
    createUnderlinePlugin(),

    // Utility
    createResetNodePlugin({
      options: {
        rules: [
          {
            types: [ELEMENT_BLOCKQUOTE, ELEMENT_TODO_LI],
            defaultType: ELEMENT_PARAGRAPH,
            hotkey: 'Enter',
            predicate: isBlockAboveEmpty,
          },
          {
            types: [ELEMENT_BLOCKQUOTE, ELEMENT_TODO_LI],
            defaultType: ELEMENT_PARAGRAPH,
            hotkey: 'Backspace',
            predicate: isSelectionAtBlockStart,
          },
        ],
      }
    }),
    createSoftBreakPlugin({
      options: {
        rules: [
          { hotkey: 'shift+enter' },
          {
            hotkey: 'enter',
            query: {
              allow: [ELEMENT_CODE_BLOCK, ELEMENT_BLOCKQUOTE, ELEMENT_TD],
            },
          },
        ],
      }
    }),
    createTrailingBlockPlugin(),
    createExitBreakPlugin({
      options: {
        rules: [
          {
            hotkey: 'mod+enter',
          },
          {
            hotkey: 'mod+shift+enter',
            before: true,
          },
          {
            hotkey: 'enter',
            query: {
              start: true,
              end: true,
              allow: KEYS_HEADING,
            },
          },
        ],
      }
    })
  ], {
    components: {
      "emphasis": withProps(StyledLeaf, {
        as: 'i'
      }),
      "strong": withProps(StyledLeaf, {
        as: 'b'
      }),
      "delete": withProps(StyledLeaf, {
        as: 's'
      }),
      "inlineCode": withProps(StyledLeaf, {
        as: 'code'
      }),
      "underline": withProps(StyledLeaf, {
        as: 'u'
      }),
      "blockquote": withProps(StyledElement, {
        as: 'blockquote'
      }),
      "p": withProps(StyledElement, {
        as: 'p'
      }),
      "h1": withProps(StyledElement, {
        as: 'h1'
      }),
      "h2": withProps(StyledElement, {
        as: 'h2'
      }),
      "h3": withProps(StyledElement, {
        as: 'h3'
      }),
      "h4": withProps(StyledElement, {
        as: 'h4'
      }),
      "h5": withProps(StyledElement, {
        as: 'h5'
      }),
      "h6": withProps(StyledElement, {
        as: 'h6'
      }),
      "li": withProps(StyledElement, {
        as: 'li'
      }),
      "ul": withProps(StyledElement, {
        as: 'ul'
      }),
      "ol": withProps(StyledElement, {
        as: 'ol'
      }),
      "lic": withProps(StyledElement, {
        as: 'p'
      }),
      "list": withProps(StyledElement, {
        as: 'ul'
      }),
      "a": LinkElement,
      "code_block": withProps(StyledElement, {
        as: "pre"
      }),
      "code_line": withProps(StyledElement, {
        as: "div"
      }),
      "action_item": TodoListElement,
      "table": withProps(StyledElement, {
        as: "table"
      }),
      "tr": withProps(StyledElement, {
        as: "tr"
      }),
      "td": withProps(StyledElement, {
        as: "td"
      }),
      "th": withProps(StyledElement, {
        as: "th"
      })
    }
  });
}

export default generatePlugins;
