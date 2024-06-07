import React, { useRef, useEffect } from 'react';
import { Page, Header, Content } from '@backstage/core-components';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { useApi, configApiRef } from '@backstage/core-plugin-api';

const TerminalPage = () => {
  const configApi = useApi(configApiRef);
  const websocketServer = configApi.getString("webterminal.baseUrl");
  const terminalRef = useRef(null);
  const socketRef = useRef(null);
  useEffect(() => {
    if (terminalRef.current) {
      const terminal = new Terminal();
      const fitAddon = new FitAddon();
      terminal.loadAddon(fitAddon);
      terminal.open(terminalRef.current);
      fitAddon.fit();
      terminal.writeln("Connecting to the server...");
      const socket = new WebSocket(websocketServer);
      socketRef.current = socket;
      socket.onopen = () => {
        console.log("WebSocket connection opened");
      };
      socket.onmessage = (event) => {
        terminal.write(event.data);
      };
      terminal.onData((data) => {
        socket.send(data);
      });
      const handleResize = () => fitAddon.fit();
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
        socket.close();
        terminal.dispose();
      };
    }
    return void 0;
  }, []);
  return /* @__PURE__ */ React.createElement(Page, { themeId: "tool" }, /* @__PURE__ */ React.createElement(
    Header,
    {
      title: "Welcome to WebTerminal in Backstage!",
      subtitle: "this is a terminal page in backstage powered by xterm.js and websocket."
    }
  ), /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement("div", { ref: terminalRef, style: { height: "100%", width: "100%" } })));
};

export { TerminalPage, TerminalPage as default };
//# sourceMappingURL=TerminalPage.esm.js.map
