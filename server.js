const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const OWNER = 'muhamadnurizanfakir';
const REPO = 'stcreporting';
const FILE_PATH = 'data/events.json';
const BRANCH = 'main';
const TOKEN = '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'; // Replace with your PAT

const githubApi = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
        'Authorization': `token ${TOKEN}`,
        'Accept': 'application/vnd.github+json'
    }
});

// Get events
app.get('/events', async (req, res) => {
    try {
        const response = await githubApi.get(`/repos/${OWNER}/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`);
        const content = Buffer.from(response.data.content, 'base64').toString();
        res.json(JSON.parse(content));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Save events
app.post('/events', async (req, res) => {
    try {
        // 1. Get current file SHA
        const getFile = await githubApi.get(`/repos/${OWNER}/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`);
        const sha = getFile.data.sha;

        // 2. Update file
        const newContent = Buffer.from(JSON.stringify(req.body, null, 2)).toString('base64');
        await githubApi.put(`/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`, {
            message: 'Update events from calendar',
            content: newContent,
            sha: sha,
            branch: BRANCH
        });

        res.json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
