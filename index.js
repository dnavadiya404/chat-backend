const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.route.js");
const messageRoutes = require("./routes/messages.route.js");
const app = express();
const socket = require("socket.io");
const db = require("./models");
const { messageRead, addSocketMessage } = require("./controllers/message.controller.js");

app.use(cors());
app.use(express.json());

db.sequelize.sync({ force: false }).then(() => {
  console.log("DB connected successfully.");
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(3002, () => {
  console.log(`Server started on 3002`);
});

const io = socket(server, {
  cors: {
    origin: '*',
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", async (data) => {
    const sendUserSocket = onlineUsers.get(data.sendTo);
    await addSocketMessage(data);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data);
      socket.to(sendUserSocket).emit("add-unread", data);
    }
  });

  socket.on("mark-seen", async (data) => {
    const sendUserSocket = onlineUsers.get(data.sendTo);
    await messageRead(data);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("mark-done", data);
    }
  });

  socket.on("typing", (data) => {
    const sendUserSocket = onlineUsers.get(data.sendTo);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("typing", data);
    }
  })
});
