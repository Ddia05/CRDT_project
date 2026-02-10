const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const PORT = 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('CRDT Server is running!');
});

// Create a single HTTP server so Express and WebSockets share port 5000
const server = http.createServer(app);

// Attach WebSocket server to the same HTTP server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  // Optional: notify the client that connection is established
  ws.send('Connected to CRDT WebSocket server');

  ws.on('message', (message) => {
    // Broadcast received message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server and WebSocket running on port ${PORT}`);
});
