const express = require("express");
const Datastore = require("nedb");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Starting server at ${port}`);
});
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

const database = new Datastore("database.db");
database.loadDatabase();

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/index.html");
});

app.get("/login.js", (request, response) => {
  response.sendFile(__dirname + "/login.js");
});

app.get("/login.html", (request, response) => {
  response.sendFile(__dirname + "/login.html");
});

app.post("/api", (request, response) => {
  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  database.insert(data);
  response.json(data);
});

app.get("/api", (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });
});

app.get("/bungie-api/:code", async (request, response) => {
  const authCodeParam = request.params;
  
  
  const getLastPath = (url) => {
    url = request.url;
    const paths = url.split("/"); 
    return paths.pop() || paths.pop();
  }
  
  console.log(getLastPath());
  
  const codeId = getLastPath().toString();
  console.log(codeId);
  const clientId = 40938;
  const api_key = process.env.Bungie_API;
  const bungie_secret = process.env.Bungie_Secret;
  const bungie_url = `https://www.bungie.net/Platform/App/OAuth/Token/`;
  
  let dataEncode = clientId + ':' + bungie_secret;
  let buff = new Buffer.from(dataEncode)
  let base64data = buff.toString('base64');
  console.log(dataEncode);
  console.log(buff);
  console.log(base64data);
  console.log(api_key);
  console.log(bungie_secret);
  
  const config = {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "https://polydactyl-topaz-crown.glitch.me",
      "X-API-Key": api_key,
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: 'Basic ' + base64data,
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code: codeId,
    }).toString(),
  };
  
  console.log(config.headers);
  console.log(config.body);
  

  const bungie_response = await fetch(bungie_url, config);
  
  
  const bungie_data = await bungie_response.json();

  const data = {
    bungie_token: bungie_data,
  };
  
  console.log(bungie_response);

  response.json(data);
});

app.get("/member-api/:memberIdplatFormId", async (request, response) => {
  const memberIds = request.params.memberIdplatFormId.split(',');
  const membershipId = memberIds[0];
  const platformId = memberIds[1];
  const api_key = process.env.Bungie_API;
  const memberid_url = `https://www.bungie.net/Platform/User/GetMembershipsById/` + membershipId + '/' + platformId;
  const memberConfig = {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "https://polydactyl-topaz-crown.glitch.me",
      "X-API-Key": api_key,
      "Content-Type": "application/json",
    },
  };
  const member_response = await fetch(memberid_url, memberConfig);
  const member_data = await member_response.json();
  const data = {
    member_info: member_data,
  };
  response.json(data);
});
