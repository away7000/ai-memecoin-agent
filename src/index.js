import { scanTokens } from "./services/scanner.js";
import { shouldBuy } from "./strategy/decision.js";
import { isSafeAdvanced } from "./strategy/safety.js";
import { logTrade } from "./services/logger.js";
import { checkTradeSafety } from "./strategy/honeypotReal.js";
import { startTelegram, isAutoMode } from "./bot/telegram.js";

const bot = startTelegram(
  process.env.TELEGRAM_TOKEN,
  () => {},
  () => "Running"
);


 for (let token of tokens.slice(0, 1)) {

  // 🛡️ SAFETY CHECK REAL
  const safety = await checkTradeSafety(token);

  if (!safety.safe) {
    console.log(`❌ SKIP ${token.symbol} | ${safety.reason}`);
    continue;
  }

  console.log(`✅ SAFE ${token.symbol} | Loss ${safety.loss?.toFixed(2)}%`);

  // lanjut AI decision
  const { decision, features } = shouldBuy(token);

  if (decision) {
    console.log("🔥 BUY:", token.symbol);
  }
}

async function scanLoop() {
  if (!isAutoMode()) return;

  console.log("🔍 Scanning...");

  const tokens = await scanTokens();

  for (let token of tokens.slice(0, 1)) {
    const safe = await isSafeAdvanced(token);

    if (!safe) {
      console.log("❌ Unsafe:", token.symbol);
      continue;
    }

    const { decision, features } = shouldBuy(token);

    if (decision) {
      console.log("🔥 BUY:", token.symbol);

      // 📢 ALERT TELEGRAM
      bot.sendMessage(
        bot._chatId,
        `🔥 BUY SIGNAL\n${token.symbol}\nLiquidity: ${token.liquidity}`
      );

      // 🧠 simulate result (nanti ganti real)
      const result = Math.random() > 0.5 ? 1 : 0;

      logTrade(features, result, token);
    } else {
      console.log("❌ Skip:", token.symbol);
    }

    await new Promise(r => setTimeout(r, 1000));
  }
}

setInterval(scanLoop, 30000);
