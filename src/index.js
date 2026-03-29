import { scanTokens } from "./services/scanner.js";
import { shouldBuy } from "./strategy/decision.js";
import { logTrade } from "./services/logger.js";

setInterval(async () => {
  const tokens = await scanTokens();

  for (let token of tokens.slice(0, 5)) {
    const { decision, features } = shouldBuy(token);

    if (decision) {
      console.log("🔥 BUY:", token.symbol);

      const result = Math.random() > 0.5 ? 1 : 0;
      logTrade(features, result);
    } else {
      console.log("❌ Skip:", token.symbol);
    }
  }

}, 10000);
