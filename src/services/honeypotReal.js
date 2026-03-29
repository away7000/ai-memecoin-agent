import { simulateBuy, simulateSell } from "../services/swapSim.js";

export async function checkTradeSafety(token) {
  try {
    // 1) simulate BUY
    const buyQuote = await simulateBuy(token.address);

    if (!buyQuote) {
      console.log("❌ Tidak bisa BUY");
      return { safe: false, reason: "NO_BUY_ROUTE" };
    }

    const tokenOut = Number(buyQuote.outAmount);

    // 2) simulate SELL
    const sellQuote = await simulateSell(token.address, tokenOut);

    if (!sellQuote) {
      console.log("🚨 Honeypot (tidak bisa SELL)");
      return { safe: false, reason: "NO_SELL_ROUTE" };
    }

    const solBack = Number(sellQuote.outAmount);

    // 3) hitung loss %
    const loss = ((TEST_AMOUNT - solBack) / TEST_AMOUNT) * 100;

    console.log(`🔍 Slippage Loss: ${loss.toFixed(2)}%`);

    // 🔥 threshold
    if (loss > 30) {
      console.log("⚠️ Slippage terlalu tinggi");
      return { safe: false, reason: "HIGH_SLIPPAGE", loss };
    }

    return { safe: true, loss };

  } catch (err) {
    console.error("Safety check error:", err);
    return { safe: false, reason: "ERROR" };
  }
}
