import {
  createPluginFactory,
  findHtmlParentElement,
  onKeyDownToggleMark,
  someHtmlElement,
  ToggleMarkPlugin,
} from '@udecode/plate';

/**
 * Enables support for inline code formatting.
 */
export const createInlineCodePlugin = createPluginFactory<ToggleMarkPlugin>({
  key: 'inlineCode',
  isLeaf: true,
  handlers: {
    onKeyDown: onKeyDownToggleMark,
  },
  options: {
    hotkey: 'mod+e',
  },
  deserializeHtml: {
    rules: [
      { validNodeName: ['CODE'] },
      {
        validStyle: {
          fontFamily: "Consolas"
        },
      },
    ],
    query: (el) => {
      const blockAbove = findHtmlParentElement(el, 'P');
      if (blockAbove?.style.fontFamily === 'Consolas') return false;

      return !findHtmlParentElement(el, 'PRE');
    }
  },
});
