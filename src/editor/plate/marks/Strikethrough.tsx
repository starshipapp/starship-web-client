import {
  createPluginFactory,
  onKeyDownToggleMark,
  someHtmlElement,
  ToggleMarkPlugin,
} from '@udecode/plate';

/**
 * Enables support for strikethrough formatting.
 */
export const createStrikethroughPlugin = createPluginFactory<ToggleMarkPlugin>({
  key: 'delete',
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
          fontStyle: 'delete',
        },
      },
    ],
    query: (el) =>
      !someHtmlElement(el, (node) => node.style.fontStyle === 'normal'),
  },
});
