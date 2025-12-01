const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// GitHub config
const GITHUB_TOKEN = "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";
const REPO_OWNER = "muhamadnurizanfakir";
const REPO_NAME = "stcreporting";
const FILE_PATH = "data/events.json";
const BRANCH = "main";

const githubAPI = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

app.get("/events", async (req, res) => {
  try {
    const response = await axios.get(githubAPI, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    const content = Buffer.from(response.data.content, "base64").toString("utf8");
    res.json(JSON.parse(content));
  } catch (err) {
    res.status(500).send("Error fetching events");
  }
});

app.post("/events", async (req, res) => {
  try {
    const getRes = await axios.get(githubAPI, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });

    const sha = getRes.data.sha;
    const newContent = Buffer.from(JSON.stringify(req.body, null, 2)).toString("base64");

    await axios.put(githubAPI, {
      message: "Update events",
      content: newContent,
      sha: sha,
      branch: BRANCH
    }, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });

    res.json({ status: "success" });
  } catch (err) {
    res.status(500).send("Error updating events");
  }
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
