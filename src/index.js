import { scanTokens } from "./services/scanner.js";
import { shouldBuy } from "./strategy/decision.js";
import { isSafeAdvanced } from "./strategy/safety.js";
import { logTrade } from "./services/logger.js";
import { checkTradeSafety } from "./strategy/honeypotReal.js";
import { startTelegram, isAutoMode } from "./bot/telegram.js";

// 🚀 start telegram
const bot = startTelegram(
  process.env.TELEGRAM_TOKEN,
  () => {},
  () => "Running"
);

// 🔁 main loop
async function scanLoop() {
  try {
    if (!isAutoMode()) return;

    console.log("🔍 Scanning...");

    const tokens = await scanTokens();

    if (!tokens || tokens.length === 0) {
  console.log("⚠️ No tokens (GMGN gagal)");
  return;
}
    for (let token of tokens.slice(0, 1)) {

      // 🛡️ honeypot + slippage check
      const safety = await checkTradeSafety(token);

      if (!safety.safe) {
        console.log(`❌ SKIP ${token.symbol} | ${safety.reason}`);
        continue;
      }

      console.log(`✅ SAFE ${token.symbol} | Loss ${safety.loss?.toFixed(2)}%`);

      // 🔐 basic safety
      const safe = await isSafeAdvanced(token);

      if (!safe) {
        console.log("❌ Unsafe:", token.symbol);
        continue;
      }

      // 🧠 AI decision
      const { decision, features } = shouldBuy(token);

      if (decision) {
        console.log("🔥 BUY:", token.symbol);

        // 📢 Telegram alert
        if (bot._chatId) {
          bot.sendMessage(
            bot._chatId,
            `🔥 BUY SIGNAL\n${token.symbol}\nLiquidity: ${token.liquidity}`
          );
        }

        // 🧠 simulate result
        const result = Math.random() > 0.5 ? 1 : 0;
        logTrade(features, result, token);

      } else {
        console.log("❌ Skip:", token.symbol);
      }

      // ⏱️ delay biar gak kena limit
      await new Promise(r => setTimeout(r, 1000));
    }

  } catch (err) {
    console.error("❌ Loop error:", err);
  }
}

// ⏰ run tiap 30 detik
setInterval(scanLoop, 30000);
  console.log("🔍 Scanning...");

  const tokens = await scanTokens();

if (!tokens || tokens.length === 0) {
  console.log("⚠️ No tokens (GMGN gagal)");
  return;
}
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

setInterval(scanLoop, 30000);
