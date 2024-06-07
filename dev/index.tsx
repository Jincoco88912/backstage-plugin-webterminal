import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { webTerminalPlugin, WebTerminalPage } from '../src/plugin';

createDevApp()
  .registerPlugin(webTerminalPlugin)
  .addPage({
    element: <WebTerminalPage />,
    title: 'Root Page',
    path: '/web-terminal',
  })
  .render();
