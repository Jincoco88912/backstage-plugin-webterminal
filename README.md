
# Backstage Plugin WebTerminal

This plugin seamlessly integrates a WebTerminal into your Backstage application, offering a convenient way for users to interact with a terminal interface within your app. Powered by xterm.js and WebSocket technology, it delivers a robust and responsive terminal experience.

## Setup

### 1. Add the plugin to your frontend app

Start by installing the plugin package in your Backstage frontend app:

```bash
cd packages/app && yarn add @jincoco/backstage-plugin-webterminal
```

### 2. Configure the plugin in `app-config.yaml`

Next, configure the plugin in your `app-config.yaml` file to specify the WebSocket server URL:

```yaml
# app-config.yaml, you can use wss:// or ws://
webterminal:
  baseUrl: wss://your.websocket.server
```
Ensure you replace wss://your.websocket.server with the actual WebSocket server URL.

### 3. Import and use the components

- `TerminalPage`: This component represents the WebTerminal page.

Here's an example of how to integrate these components into your Backstage app:

```tsx
// Example in your routes configuration file
// App.tsx
import { WebTerminalPage } from '@jincoco/backstage-plugin-webterminal';

// Adding WebTerminalPage to your routes
<Route path="/web-terminal" element={<WebTerminalPage />} />
```

### 4. Ensure that your websocket server setting
Ensure your WebSocket server is correctly configured. Below is an example of setting up a simple terminal server using node-pty and WebSocket. This example uses Node.js to create the WebSocket server and manage the terminal sessions:

```js
// server.js
// A example of a simple terminal server using node-pty and WebSocket
const express = require('express');
const WebSocket = require('ws');
const pty = require('node-pty');

const app = express();
const port = 3838;

// Serve static files from the React app
app.use(express.static('build'));

// Start the server
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  // Create a new pty process
  const shell = process.env.SHELL || 'bash';
  const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env,
  });

  // Handle data from the pty process
  ptyProcess.onData((data) => {
    ws.send(data);
  });

  // Handle data from the WebSocket
  ws.on('message', (msg) => {
    ptyProcess.write(msg);
  });

  // Cleanup when the connection is closed
  ws.on('close', () => {
    ptyProcess.kill();
  });
});
```
### NGINX configuration for proxying with SSL
If you're using NGINX to proxy with SSL, ensure your configuration includes the necessary settings:
```
server {
    listen 443 ssl;

    ssl_certificate /etc/nginx/ssl/certificate.crt;
    ssl_certificate_key /etc/nginx/ssl/certificate.key;

    server_name my.server.url;

    location / {
        proxy_pass http://my.websocket.ip:3838;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```
- `proxy_set_header Upgrade $http_upgrade`: This ensures that the WebSocket connection is upgraded from HTTP to WebSocket protocol.

- `proxy_set_header Connection 'upgrade'`: This keeps the connection open and instructs NGINX to maintain the connection upgrade.

Make sure to replace with your actual server name and update SSL certificate paths accordingly.

## Features
Interactive Terminal: Users can interact with a terminal interface directly within your Backstage app.

WebSocket Integration: Utilizes WebSocket for real-time communication between the frontend and backend.WebSocket

Customizable Configuration: Easily configure the WebSocket server URL to suit your environment.

## Screenshots
![alt text](https://i.imgur.com/YvpebbO.png)

## Contributing

We welcome contributions to improve this plugin. If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.