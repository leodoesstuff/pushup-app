const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const FILE = "./data.json";

// load data
function loadData() {
  try {
    return JSON.parse(fs.readFileSync(FILE));
  } catch {
    return [];
  }
}

// save data
function saveData(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// GET leaderboard
app.get("/scores", (req, res) => {
  res.json(loadData());
});

// POST score
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

app.listen(3000, () => console.log("Server running on 3000"));
