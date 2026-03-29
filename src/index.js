import 'dotenv/config';
import { shouldBuy } from './strategy/decision.js';
import { logTrade } from './services/logger.js';
import { loadModel } from './ai/model.js';

loadModel();

console.log("🚀 AI Agent Started...");

const sampleToken = {
  symbol: "MEME",
  liquidity: 20000,
  volume_5m: 12000,
  price_change_5m: 8,
  age_minutes: 15,
  buys: 120,
  sells: 40,
  liquidity_locked: true,
  mint_enabled: false
};

setInterval(() => {
  const { decision, features } = shouldBuy(sampleToken);

  if (decision) {
    console.log("🔥 BUY EXECUTED");

    const result = Math.random() > 0.5 ? 1 : 0;
    logTrade(features, result);
  } else {
    console.log("❌ SKIP");
  }

  console.log("------------");
}, 5000);
