require("dotenv").config();

const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);

// socket.io attach
const io = socketio(server);

// set ejs view engine
app.set("view engine", "ejs");

// static files serve
app.use(express.static(path.join(__dirname, "public")));

// default route
app.get("/", (req, res) => {
  res.render("index"); // views/index.ejs file render karega
});

io.on("connection", (socket) => {
  socket.on("sendLocation", (data) => {
    io.emit("receive-location", { id: socket.id, ...data });
  });

  socket.on("disconnect", () => {
    io.emit("user-disconnect", socket.id);
  });
});


// server listen
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log("Server running on ");
});
