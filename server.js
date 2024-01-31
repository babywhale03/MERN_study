const express = require("express");
const app = express();
require("dotenv").config();
const id = process.env.ID;
const pw = process.env.PW;
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { MongoClient, ObjectId } = require("mongodb");

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

app.post("/add", async (요청, 응답) => {
  console.log(요청.body);

  try {
    if (요청.body.title == "") {
      응답.send("제목 입력 안 했는데?");
    } else {
      await db
        .collection("post")
        .insertOne({ title: 요청.body.title, content: 요청.body.content });
      응답.redirect("/list");
    }
  } catch (e) {
    console.log(e);
    응답.status(500).send("서버 에러남"); // 500 : 서버 잘못으로 인한 에러라는 뜻
  }
});

app.get("/detail/:id", async (요청, 응답) => {
  try {
    let result = await db
      .collection("post")
      .findOne({ _id: new ObjectId(요청.params.id) });
    console.log(요청.params);
    if (result == null) {
      응답.status(400).send("이상한 url 입력함");
    }
    응답.render("detail.ejs", { result: result });
  } catch (e) {
    console.log(e);
    응답.status(400).send("이상한 url 입력함"); // 4xx: 유저 문제
  }
});

app.get("/edit/:id", async (요청, 응답) => {
  let result = await db
    .collection("post")
    .findOne({ _id: new ObjectId(요청.params.id) });
  응답.render("edit.ejs", { result: result });
});

app.put("/edit", async (요청, 응답) => {
  await db.collection("post").updateOne({ _id: 1 }, { $inc: { like: 2 } });
  // await db
  //   .collection("post")
  //   .updateOne(
  //     { _id: new ObjectId(요청.body.id) },
  //     { $set: { title: 요청.body.title, content: 요청.body.content } }
  //   );
  // 응답.redirect("/list");
});

app.delete("/delete", async (요청, 응답) => {
  console.log(요청.query);
  await db
    .collection("post")
    .deleteOne({ _id: new ObjectId(요청.query.docid) });
  응답.send("삭제완료");
});

// app.get("/list/:id", async (요청, 응답) => {
//   let result = await db
//     .collection("post")
//     .find()
//     .skip((요청.params.id - 1) * 5) // 큰 숫자 넣으면 수행 시간 오래 걸림
//     .limit(5)
//     .toArray();
//   응답.render("list.ejs", { 글목록: result });
// });

/* 장점 : 매우 빠름, 단점 : '다음' 버튼으로 바꿔야 함 */
app.get("/list/next/:id", async (요청, 응답) => {
  let result = await db
    .collection("post")
    .find({ _id: { $gt: new ObjectId(요청.params.id) } })
    .limit(5)
    .toArray();
  응답.render("list.ejs", { 글목록: result });
});
