import {
  createPluginFactory,
  onKeyDownToggleMark,
  someHtmlElement,
  ToggleMarkPlugin,
} from '@udecode/plate';

/**
 * Enables support for italic formatting.
 */
export const createItalicPlugin = createPluginFactory<ToggleMarkPlugin>({
  key: 'emphasis',
  isLeaf: true,
  handlers: {
    onKeyDown: onKeyDownToggleMark,
  },
  options: {
    hotkey: 'mod+i',
  },
  deserializeHtml: {
    rules: [
      { validNodeName: ['EM', 'I'] },
      {
        validStyle: {
          fontStyle: 'italic',
        },
      },
    ],
    query: (el) =>
      !someHtmlElement(el, (node) => node.style.fontStyle === 'normal'),
  },
});
