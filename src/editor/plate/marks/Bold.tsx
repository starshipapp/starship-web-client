import {
  createPluginFactory,
  onKeyDownToggleMark,
  someHtmlElement,
  ToggleMarkPlugin,
} from '@udecode/plate';

/**
 * Enables support for bold formatting.
 */
export const createBoldPlugin = createPluginFactory<ToggleMarkPlugin>({
  key: 'strong',
  isLeaf: true,
  handlers: {
    onKeyDown: onKeyDownToggleMark,
  },
  options: {
    hotkey: 'mod+b',
  },
  deserializeHtml: {
    rules: [
      { validNodeName: ['B'] },
      {
        validStyle: {
          fontStyle: ['600', '700', 'bold'],
        },
      },
    ],
    query: (el) =>
      !someHtmlElement(el, (node) => node.style.fontWeight === 'normal'),
  },
});
