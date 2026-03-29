import { scanDex } from "./scannerDex.js";
import { validateWithHelius } from "./scannerHelius.js";

export async function scanTokens() {
  const tokens = await scanDex();

  const results = [];

  for (let token of tokens) {
    const isValid = await validateWithHelius(token);

    if (isValid) {
      results.push({
        ...token,
        liquidity_locked: true,
        mint_enabled: false
      });

      console.log("✅ VALID:", token.symbol);
    } else {
      console.log("❌ REJECT:", token.symbol);
    }

    // 🔥 delay biar gak kena limit
    await new Promise(r => setTimeout(r, 500));
  }

  return results;
}
