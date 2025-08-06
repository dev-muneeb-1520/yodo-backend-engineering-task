const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static("src/public"));

io.on("connection", (socket) => {
  console.log("New user connected");

  socket.on("join", ({ userId }) => {
    const user = addUser({ id: socket.id, userId });
    socket.join(userId);
    io.emit("userList", getUsersInRoom(userId));
  });

  socket.on("message", ({ userId, message }) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(userId).emit("message", { userId: user.userId, message });
    }
  });

  socket.on("privateMessage", ({ userId, recipientId, message }) => {
    const sender = getUser(socket.id);
    const recipient = getUsersInRoom().find(
      (user) => user.userId === recipientId
    );
    if (sender && recipient) {
      io.to(recipient.id).emit("message", { userId: sender.userId, message });
    } else {
      socket.emit("message", {
        userId: "System",
        message: "Recipient not found",
      });
    }
  });

  socket.on("groupMessage", ({ message }) => {
    const user = getUser(socket.id);
    if (user) {
      io.emit("message", { userId: user.userId, message });
    }
  });

  socket.on("adminBroadcast", ({ message }) => {
    const user = getUser(socket.id);
    if (user && user.isAdmin) {
      io.emit("message", { userId: "Admin", message });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    removeUser(socket.id);
    io.emit("userList", getUsersInRoom());
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
