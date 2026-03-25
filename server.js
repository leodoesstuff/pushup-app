const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// serve frontend
app.use(express.static(path.join(__dirname, "public")));

const FILE = "./data.json";

// ===== LOAD DATA =====
function loadData() {
  try {
    return JSON.parse(fs.readFileSync(FILE));
  } catch {
    return [];
  }
}

// ===== SAVE DATA =====
function saveData(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// ===== API =====

// get leaderboard
app.get("/scores", (req, res) => {
  res.json(loadData());
});

// save score
app.post("/scores", (req, res) => {
  const { name, score } = req.body;

  let data = loadData();

  let player = data.find(p => p.name === name);

  if (player) {
    player.score += score;
  } else {
    data.push({ name, score });
  }

  data.sort((a, b) => b.score - a.score);

  saveData(data);

  res.json({ success: true });
});

// fallback route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(3000, () => console.log("Server running on port 3000"));
