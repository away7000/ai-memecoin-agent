export async function scanTokens() {
  try {
    const res = await fetch("https://api.dexscreener.com/latest/dex/pairs/solana");

    const text = await res.text();

    // 🔥 cek dulu apakah JSON
    if (!text.startsWith("{")) {
      console.error("❌ Bukan JSON (kemungkinan kena rate limit)");
      return [];
    }

    const data = JSON.parse(text);

    return data.pairs.map(pair => ({
      symbol: pair.baseToken.symbol,
      address: pair.baseToken.address,
      liquidity: pair.liquidity?.usd || 0,
      volume_5m: pair.volume?.m5 || 0,
      price_change_5m: pair.priceChange?.m5 || 0,
      age_minutes: (Date.now() - pair.pairCreatedAt) / 60000,
      buys: pair.txns?.m5?.buys || 0,
      sells: pair.txns?.m5?.sells || 0,
      liquidity_locked: true,
      mint_enabled: false
    }));

  } catch (err) {
    console.error("Scanner error:", err);
    return [];
  }
}
