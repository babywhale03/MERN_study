const express = require("express");
const app = express();
require("dotenv").config();
const id = process.env.ID;
const pw = process.env.PW;

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { MongoClient } = require("mongodb");

let db;
const url = `mongodb+srv://${id}:${pw}@cluster0.nmv3tex.mongodb.net/?retryWrites=true&w=majority`;
new MongoClient(url)
  .connect()
  .then((client) => {
    console.log("DB연결성공");
    db = client.db("forum");
    app.listen(8080, () => {
      console.log("http://localhost:8080 에서 서버 실행 중...");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (요청, 응답) => {
  응답.sendFile(__dirname + "/index.html");
});

app.get("/news", (요청, 응답) => {
  db.collection("post").insertOne({ title: "어쩌구" });
  // 응답.send("오늘 비옴");
});

app.get("/list", async (요청, 응답) => {
  let result = await db.collection("post").find().toArray();
  console.log(result);
  응답.render("list.ejs", { 글목록: result });
});

app.get("/time", (요청, 응답) => {
  응답.render("time.ejs", { data: new Date() });
});

app.get("/write", (요청, 응답) => {
  응답.render("write.ejs");
});

app.post("/add", (요청, 응답) => {
  console.log(요청.body);
});
