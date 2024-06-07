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