import React, { useEffect, useRef } from 'react';
import { Page, Header, Content } from '@backstage/core-components';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

import { useApi } from '@backstage/core-plugin-api';
import { configApiRef } from '@backstage/core-plugin-api';

export const TerminalPage = () => {
  const configApi = useApi(configApiRef);
  const websocketServer = configApi.getString('webterminal.baseUrl');

  const terminalRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (terminalRef.current) {
      const terminal = new Terminal();
      const fitAddon = new FitAddon();
      terminal.loadAddon(fitAddon);

      terminal.open(terminalRef.current);
      fitAddon.fit();

      terminal.writeln('Connecting to the server...');

      // using ws or wss protocol to connect to the server
      const socket = new WebSocket(websocketServer);
      socketRef.current = socket;
      
      socket.onopen = () => {
        console.log('WebSocket connection opened');
      };

      socket.onmessage = (event) => {
        terminal.write(event.data);
      };

      terminal.onData((data) => {
        socket.send(data);
      });

      const handleResize = () => fitAddon.fit();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        socket.close();
        terminal.dispose();
      };
    }
    return undefined;
  }, []);

  return (
    <Page themeId="tool">
      <Header
        title="Welcome to WebTerminal in Backstage!"
        subtitle="this is a terminal page in backstage powered by xterm.js and websocket."
      />
      <Content>
        <div ref={terminalRef} style={{ height: '100%', width: '100%' }} />
      </Content>
    </Page>
  );
};

export default TerminalPage;
