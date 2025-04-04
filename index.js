const { log } = require("console");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");

const server = app.listen(PORT, () => {
  console.log(`listen on port ${PORT}`);
});

const io = require("socket.io")(server, {
  cors: {
    origin: "",
    methods: ["GET", "POST"],
  },
});

let socketConnected = new Set();
io.on("connection", onConnected);

app.use(express.static(path.join(__dirname, "public")));

function onConnected(socket) {
  socketConnected.add(socket.id);

  io.emit("client-total", socketConnected.size);
  socket.on("disconnect", () => {
    console.log(socket.id);
    socketConnected.delete(socket.id);
    io.emit("client-total", socketConnected.size);
  });

  socket.on("message", (data) => {
    console.log(data);

    socket.broadcast.emit("chat-message", data);
  });
}
