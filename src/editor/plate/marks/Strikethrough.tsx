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
    hotkey: 'mod+shift+x',
  },
  deserializeHtml: {
    rules: [
      { validNodeName: ['S', 'DEL', 'STRIKE'] },
      {
        validStyle: {
          textDecoration: 'line-through',
        },
      },
    ],
    query: (el) =>
      !someHtmlElement(el, (node) => node.style.textDecoration === 'none'),
  },
});
