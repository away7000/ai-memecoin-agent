import { scanTokens } from "./services/scanner.js";
import { shouldBuy } from "./strategy/decision.js";
import { startTelegram } from "./bot/telegram.js";

let cooldown = false;

// 🔥 1. START TELEGRAM DULU
startTelegram(process.env.TELEGRAM_TOKEN, () => {}, () => "Running");

// 🔥 2. BARU LOOP SCANNER
setInterval(async () => {
  console.log("🔍 Scanning...");

  const tokens = await scanTokens();

  for (let token of tokens.slice(0, 2)) {
    const { decision } = shouldBuy(token);

    if (decision) {
      console.log("🔥 BUY:", token.symbol);
    } else {
      console.log("❌ Skip:", token.symbol);
    }
  }

}, 20000); // 🔥 20 detik

async function scanLoop() {
  if (cooldown) {
    console.log("⏳ cooldown...");
    return;
  }

  const tokens = await scanTokens();

  if (tokens.length === 0) {
    cooldown = true;
    console.log("⚠️ no valid tokens, pause...");

    setTimeout(() => {
      cooldown = false;
    }, 60000);

    return;
  }

  for (let token of tokens.slice(0, 2)) {
    console.log("🔥 Candidate:", token.symbol);
  }
}

setInterval(scanLoop, 30000);
