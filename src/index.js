import 'dotenv/config';
import { shouldBuy } from './strategy/decision.js';
import { logTrade } from './services/logger.js';
import { loadModel } from './ai/model.js';
import { startTelegram, isAutoMode } from './bot/telegram.js';

loadModel();

console.log("🚀 AI Agent Started...");

let lastStatus = "Idle...";

startTelegram(
  process.env.TELEGRAM_TOKEN,
  (state) => {
    console.log("AUTO MODE:", state);
  },
  () => lastStatus
);

// dummy token (nanti ganti API)
const token = {
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
  if (!isAutoMode()) {
    lastStatus = "⏸️ Auto OFF";
    return;
  }

  const { decision, features } = shouldBuy(token);

  if (decision) {
    lastStatus = `🔥 BUY ${token.symbol}`;

    const result = Math.random() > 0.5 ? 1 : 0;
    logTrade(features, result);

  } else {
    lastStatus = `❌ Skip ${token.symbol}`;
  }

  console.log(lastStatus);

}, 5000);
