/**
 * https://medium.com/@purposenigeria/build-a-restful-api-with-node-js-and-express-js-d7e59c7a3dfb
 */

const path = require("path");
const fs = require("fs");
const express = require("express");
const cookieParser = require("cookie-parser");
require("es6-promise").polyfill();
require("isomorphic-fetch");

const CLIENT_ID = "testnogc";
const CLIENT_SECRET = "QpwL5tke4Pnpja7X";
const COOKIE_NAME = "lllllogin";

const app = express();
app.use(express.urlencoded());
app.use(cookieParser());

app.post("/login", (req, res, next) => {
  if (!req.body.username) {
    res.status(404).json({ error: 'User Not Found' })
  } else {
    const buff64 = new Buffer(CLIENT_ID+":"+CLIENT_SECRET);
    fetch("https://reqres.in/api/oauth/token", {
      method: "post",
      credentials: "same-origin",
      body: JSON.stringify({
        "grant_type": "password",
        "username": req.body.username,
        "password": req.body.password
      }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + buff64.toString("base64"),
      }
    })
    .then(response => response.json()
    .then(data => ({status: response.status, body: data})))
    .then(function(ress) {
      res.cookie(COOKIE_NAME, ress.body, {
        maxAge: ress.body.expires_in,
        domain: req.hostname,
        httpOnly: true
      });
      res.status(ress.status).json({ message: 'successful' });
    }).catch(error => {
      console.error(`request failed ${error}`);
      res.status(400).json({ error: 'The username or password you entered is incorrect' });
    });
  }
});

app.get("/", (req, res) => {
  console.info("cookies", req.cookies);
  res.send("Hello");
});

app.listen(3001);
