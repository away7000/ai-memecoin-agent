import fs from "fs";

const FILE = "./data/trades.json";

export function logTrade(features, result, token) {
  let data = [];

  if (fs.existsSync(FILE)) {
    data = JSON.parse(fs.readFileSync(FILE));
  }

  data.push({
    features,
    result, // 1 profit, 0 rugpull/loss
    symbol: token.symbol,
    timestamp: Date.now()
  });

  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}
