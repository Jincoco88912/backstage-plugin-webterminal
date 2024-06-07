import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const webTerminalPlugin = createPlugin({
  id: 'web-terminal',
  routes: {
    root: rootRouteRef,
  },
});

export const WebTerminalPage = webTerminalPlugin.provide(
  createRoutableExtension({
    name: 'WebTerminalPage',
    component: () =>
      import('./components').then(m => m.TerminalPage),
    mountPoint: rootRouteRef,
  }),
);
