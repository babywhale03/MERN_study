const express = require("express");
const app = express();

app.use(express.static(__dirname + "/public"));

app.get("/", (요청, 응답) => {
  응답.sendFile(__dirname + "/index.html");
});

app.get("/news", (요청, 응답) => {
  응답.send("오늘 비옴");
});

app.get("/shop", (요청, 응답) => {
  응답.send("쇼핑 페이지임");
});

app.get("/about", (요청, 응답) => {
  응답.sendFile(__dirname + "/about.html");
});
