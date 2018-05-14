import * as functions from "firebase-functions";
import React from "react";
import { renderToString } from "react-dom/server";
import App from "./src/App";
import getFacts from "./src/facts";
import express from "express";
import fs from "fs";

const index = fs.readFileSync(__dirname + "/index.html", "utf8");

const app = express();
app.get("**", (req, res) => {
  getFacts().then(facts => {
    const html = renderToString(<App facts={facts} />);
    const finalHTML = index.replace("<!--::APP::-->", html);
    res.set("Cache-control", "public, max-age=600, s-maxage=1200");
    res.send(finalHTML);
  });
});

export let ssrapp = functions.https.onRequest(app);
