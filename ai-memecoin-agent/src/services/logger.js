import fs from "fs";

const FILE = "./data/trades.json";

export function logTrade(features, result) {
  let data = [];

  if (fs.existsSync(FILE)) {
    data = JSON.parse(fs.readFileSync(FILE));
  }

  data.push({ features, result });

  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}
