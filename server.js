const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let events = [
  { id: "1", title: "Team Meeting", start: "2025-12-05" },
  { id: "2", title: "Project Deadline", start: "2025-12-10" },
  { id: "3", title: "Client Call", start: "2025-12-15" }
];

app.get("/events", (req, res) => {
  res.json(events);
});

app.post("/events", (req, res) => {
  events = req.body;
  res.json({ status: "success" });
});

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
