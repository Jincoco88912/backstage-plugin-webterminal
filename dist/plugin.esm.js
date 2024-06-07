import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes.esm.js';

const webTerminalPlugin = createPlugin({
  id: "web-terminal",
  routes: {
    root: rootRouteRef
  }
});
const WebTerminalPage = webTerminalPlugin.provide(
  createRoutableExtension({
    name: "WebTerminalPage",
    component: () => import('./components/index.esm.js').then((m) => m.TerminalPage),
    mountPoint: rootRouteRef
  })
);

export { WebTerminalPage, webTerminalPlugin };
//# sourceMappingURL=plugin.esm.js.map
