const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const socketio = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const formatMessage = require("./utils/messages");
const {
    userJoin,
    getCurrentUser,
  } = require("./utils/users");

const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to Mongo!");
  })
  .catch((err) => {
    console.error("Error connecting to Mongo", err);
  });

const chatSchema = new mongoose.Schema({
  name: String,
  message: String,
});
const Chat = mongoose.model("Chat", chatSchema);

const message1 = new Chat({
  name: "Bot",
  message: "Welcome to Go Chat",
});

const message2 = new Chat({
  name: "Bot",
  message: "A user has left the chat",
});

const message3 = new Chat({
  name: "Bot",
  message: "A user has joined chat",
});
// const item1 = new Chat({
//     name: "Welcome to your toDo list",
//   });
// Chat.insertMany(message2)
// Chat.insertMany(message1)
// Chat.insertMany(message3)
app.post("/", function(req, res){
  let itemName = req.body.username;
  console.log(itemName)    
})
io.on("connection", (socket) => {
    socket.on("joinRoom", ({username}) =>{
const user = userJoin(socket.id, username)
console.log(user.username)
        socket.emit("message", formatMessage(message1.name, message1.message));

    })


  socket.broadcast.emit(
    "message",
    formatMessage(message3.name, message3.message)
  );

  socket.on("disconnect", () => {
    io.emit("message", formatMessage(message2.name, message2.message));
  });

  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    const message0 = new Chat({
      name: user.username,
      message: msg,
    });
    message0.save();
    io.emit("message", formatMessage(message0.name, message0.message));
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
