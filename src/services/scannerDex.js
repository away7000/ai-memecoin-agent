export async function scanDex() {
  try {
    const res = await fetch("https://api.dexscreener.com/latest/dex/pairs/solana", {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
      }
    });

    const text = await res.text();

    if (!text.startsWith("{")) {
      console.log("⚠️ Dex kena limit");
      return [];
    }

    const data = JSON.parse(text);

    return data.pairs.slice(0, 10).map(pair => ({
      symbol: pair.baseToken.symbol,
      address: pair.baseToken.address,
      liquidity: pair.liquidity?.usd || 0,
      volume_5m: pair.volume?.m5 || 0,
      price_change_5m: pair.priceChange?.m5 || 0,
      age_minutes: (Date.now() - pair.pairCreatedAt) / 60000,
      buys: pair.txns?.m5?.buys || 0,
      sells: pair.txns?.m5?.sells || 0
    }));

  } catch (err) {
    console.error("Dex error:", err);
    return [];
  }
}
