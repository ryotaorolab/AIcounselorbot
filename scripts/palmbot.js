const { google } = require("googleapis");
const privatekey = require("./privatekey.json");

module.exports = (robot) => {
  let questionSentId = {};
  let ankeat = "";
  let ansernum = 0;
  let roomid = "";
  let ja_text = "";
  var api_param = "generalNT_en_ja"; // API値 (https://xxx.jp/api/mt/generalNT_ja_en/ の場合は、"generalNT_ja_en")
  let configtransform = "";
  robot.respond(/診断$/i, (res) => {
    ankeat = "";
    res.send({
      question: "最近どう？",
      options: ["元気だ", "気力が沸かない", "イライラする", "不安だ"],
      onsend: (sent) => {
        questionSentId[res.message.rooms[res.message.room].id] =
          sent.message.id;
        ansernum = 1;
        roomid = `${res.message.room}`;
      },
    });
  });

  robot.respond("select", (res) => {
    if (res.json.response === null) {
      res.send(`Your question is ${res.json.question}.`);
    } else {
      if (ansernum === 1) {
        res.send({
          question: "普段何してる？",
          options: [
            "外に出ている",
            "家にいることが多い",
            "ずっとスマホをしていることが多い",
            "スポーツをしている",
          ],
          onsend: (sent) => {
            questionSentId[res.message.rooms[res.message.room].id] =
              sent.message.id;

            if ("元気だ" === `${res.json.options[res.json.response]}`) {
              ankeat += "I'm fine,";
            }
            if ("気力が沸かない" === `${res.json.options[res.json.response]}`) {
              ankeat += "am not energetic enough,";
            }
            if ("イライラする" === `${res.json.options[res.json.response]}`) {
              ankeat += "get irritated,";
            }
            if ("不安だ" === `${res.json.options[res.json.response]}`) {
              ankeat += "Anxiety,";
            }
            ansernum = 2;
          },
        });
      }
      if (ansernum === 2) {
        res.send({
          question: "趣味はある？",
          options: [
            "自慢できる趣味がある",
            "普通の趣味がある",
            "なんとも言えない趣味がある",
            "何も趣味がない",
          ],
          onsend: (sent) => {
            questionSentId[res.message.rooms[res.message.room].id] =
              sent.message.id;
            if ("外に出ている" === `${res.json.options[res.json.response]}`) {
              ankeat += "I'm usually outside,";
            }
            if ("気力が沸かない" === `${res.json.options[res.json.response]}`) {
              ankeat += "Usually stay home most of the time,";
            }
            if (
              "ずっとスマホをしていることが多い" ===
              `${res.json.options[res.json.response]}`
            ) {
              ankeat += "I'm usually on my phone all the time,";
            }
            if (
              "スポーツをしている" === `${res.json.options[res.json.response]}`
            ) {
              ankeat += "I usually play sports,";
            }
            ansernum = 3;
          },
        });
      }
      if (ansernum === 3) {
        res.send({
          question: "今力を注いでいることは",
          options: [
            "趣味に力を入れている",
            "何も力を入れていない",
            "パチンコに力を入れている",
            "色々と力を入れて頑張っている",
          ],
          onsend: (sent) => {
            questionSentId[res.message.rooms[res.message.room].id] =
              sent.message.id;
            if (
              "自慢できる趣味がある" ===
              `${res.json.options[res.json.response]}`
            ) {
              ankeat += "I have hobbies to be proud of,";
            }
            if (
              "普通の趣味がある" === `${res.json.options[res.json.response]}`
            ) {
              ankeat += "I have a general hobby.,";
            }
            if (
              "なんとも言えない趣味がある" ===
              `${res.json.options[res.json.response]}`
            ) {
              ankeat += "I have an indescribable hobby.,";
            }
            if ("何も趣味がない" === `${res.json.options[res.json.response]}`) {
              ankeat += "I have no hobbies.,";
            }
            ansernum = 4;
          },
        });
      }
      if (ansernum === 4) {
        res.send({
          question: "将来の不安は",
          options: [
            "将来の先行きが不安だ",
            "希望に満ち溢れてる",
            "お金を溶かして将来の不安を無くしてる",
            "ぼちぼち将来が不安だ",
          ],
          onsend: (sent) => {
            questionSentId[res.message.rooms[res.message.room].id] =
              sent.message.id;
            if (
              "趣味に力を入れている" ===
              `${res.json.options[res.json.response]}`
            ) {
              ankeat += "I put a lot of effort into my hobbies,";
            }
            if (
              "何も力を入れていない" ===
              `${res.json.options[res.json.response]}`
            ) {
              ankeat += "No effort put into any activities,";
            }
            if (
              "パチンコに力を入れている" ===
              `${res.json.options[res.json.response]}`
            ) {
              ankeat += "I am passionate about pachinko,";
            }
            if (
              "色々と力を入れて頑張っている" ===
              `${res.json.options[res.json.response]}`
            ) {
              ankeat +=
                "We are working hard and putting in a lot of effort in a wide variety of areas,";
            }
            ansernum = 5;
          },
        });
      }
      if (ansernum === 5) {
        res.send({
          text: "あと少し！あとは、自分の今の思いを短く書いてみて",
          onsend: (sent) => {
            if (
              "将来の先行きが不安だ" ===
              `${res.json.options[res.json.response]}`
            ) {
              ankeat += "I'm worried about the future,";
            }
            if (
              "希望に満ち溢れてる" === `${res.json.options[res.json.response]}`
            ) {
              ankeat += "My future is full of hope.,";
            }
            if (
              "お金を溶かして将来の不安を無くしてる" ===
              `${res.json.options[res.json.response]}`
            ) {
              ankeat +=
                "By melting your money, you're eliminating uncertainty about your future,";
            }
            if (
              "ぼちぼち将来が不安だ" ===
              `${res.json.options[res.json.response]}`
            ) {
              ankeat += "I'm a little nervous about the future,";
            }
            ansernum = 6;
            // main();
          },
        });
      }
    }
  });

  robot.respond(/(.*)/, (res) => {
    if (ansernum === 6) {
      api_param = "generalNT_ja_en";
      //   freemasseage_ja = transformtext(`${res.match[1]}`);
      configtransform = "freeText";
      res.send({
        text: "ありがとう！AIがあなたに合った動画を探しています。しばらくお待ちください。",
        //   ankeat += freemasseage_ja;
        onsend: (sent) => {
          transformtext(`${res.match[1]}`);
          //   ankeat += freemasseage_ja;
          ansernum = 7;
        },
        // res.send(`Your message is ${res.match[1]}`);
      });
    }
  });

  let freemasseage_ja = "";
  // timers/promisesをロード
  const { setTimeout } = require("timers/promises");

  async function freemasseage_jaattend() {
    console.log("a" + ja_text);
    let logfreemasseage = freemasseage_ja;
    await setTimeout(0);
    ankeat += ja_text;
    main();
  }
  let searchword_ja = "";
  const { DiscussServiceClient } = require("@google-ai/generativelanguage");
  const { GoogleAuth } = require("google-auth-library");

  const MODEL_NAME = "models/chat-bison-001";
  // API_KEY = process.env.API_KEY;
  const API_KEY = "AIzaSyC20b-Qiu2XH8LpqnQkfetgTH6ZWd46K9g";
  const client = new DiscussServiceClient({
    authClient: new GoogleAuth().fromAPIKey(API_KEY),
  });

  async function main() {
    const result = await client.generateMessage({
      model: MODEL_NAME, // Required. The model to use to generate the result.
      temperature: 0.4, // Optional. Value `0.0` always uses the highest-probability result.
      candidateCount: 1, // Optional. The number of candidate results to generate.
      prompt: {
        // optional, preamble context to prime responses
        context:
          "Please be the computer that returns only the video search word. Never tell us any extra information other than the search word. For example, no explanations, introductory stories, closing remarks, etc.Please provide a single Youtube search word that will bring up videos recommended for people who have the following factors.",
        // Optional. Examples for further fine-tuning of responses.
        examples: [
          {
            input: { content: "I'm not feeling well, I have hope." },
            output: {
              content: `inspirational videos`,
            },
          },
        ],
        // Required. Alternating prompt/response messages.
        messages: [
          {
            content:
              "Please be the computer that returns only the video search word. Never tell us any extra information other than the search word. For example, no explanations, introductory stories, closing remarks, etc.Please provide a single Youtube search word that will bring up videos recommended for people who have the following factors. " +
              ankeat,
          },
        ],
      },
    });

    robot.send(
      { room: roomid },
      "Google PaLM2というAIであなたに合った動画を探しています。キーワード :" +
        ankeat
    );
    console.log(result[0].candidates[0].content);
    console.log(robot.brain.rooms());
    api_param = "generalNT_en_ja"; // API値 (https://xxx.jp/api/mt/generalNT_ja_en/ の場合は、"generalNT_ja_en");
    configtransform = "AI";
    ja_text = transformtext(result[0].candidates[0].content);
    robot.send({ room: roomid }, ja_text);
  }
  function transformresult() {
    // robot.send({ room: roomid }, ja_text);

    //
    let searchWord = ja_text;
    youtube.search.list(
      {
        part: "snippet",
        q: searchWord,
        maxResults: 3,
      },
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          let urlStr = searchWord + "\n";
          //console.log(data.data.items);
          for (let i in data.data.items) {
            urlStr +=
              "https://youtube.com/watch?v=" +
              data.data.items[i].id.videoId +
              "\n";
          }
          robot.send({ room: roomid }, urlStr);
        }
      }
    );
  }

  // require('dotenv').config();

  var url = "https://mt-auto-minhon-mlt.ucri.jgn-x.jp"; // 基底URL (https://xxx.jpまでを入力)
  var key = "16d30b16408838ab841a3bb29d6144fa062b1934d"; // API key
  var secret = "511fbc1a3b7b7ed2809be88992e2e16f"; // API secret
  var name = "wakkunab"; // ログインID

  var api_name = "mt"; // API名 (https://xxx.jp/api/mt/generalNT_ja_en/ の場合は、"mt")

  var axios = require("axios");
  var oauth = require("axios-oauth-client");
  const getClientCredentials = oauth.clientCredentials(
    axios.create(),
    url + "/oauth2/token.php",
    key,
    secret
  );

  async function transformtext(ja_transform) {
    const auth = await getClientCredentials();

    var params = {
      access_token: auth.access_token,
      key: key, // API Key
      api_name: api_name,
      api_param: api_param,
      name: name, // ログインID
      type: "json", // レスポンスタイプ
      text: ja_transform, // 翻訳テキスト
    };

    // クエリパラメータで渡さないと523エラーが返ってくる
    var searchParams = new URLSearchParams();
    for (let key in params) {
      searchParams.append(key, params[key]);
    }

    const res = await axios.post(url + "/api/", searchParams);
    console.log(res.data.resultset.result.text);
    ja_text = res.data.resultset.result.text;
    if (configtransform === "AI") {
      transformresult();
    }
    if (configtransform === "freeText") {
      freemasseage_jaattend();
    }
    return res.data.resultset.result.text;
  }

  //YoutubeAPI
  let jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ["https://www.googleapis.com/auth/youtube"]
  );

  jwtClient.authorize((err, tokens) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Google Oauth authorization succeeded");
  });

  let youtube = google.youtube({
    version: "v3",
    auth: jwtClient,
  });
};
