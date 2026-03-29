let cache = [];
let lastFetch = 0;

export async function scanGMGN() {
  const now = Date.now();

  if (now - lastFetch < 60000 && cache.length > 0) {
    console.log("📦 GMGN cache");
    return cache;
  }

  try {
    const res = await fetch("https://gmgn.ai/defi/quotation/v1/rank/sol", {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const data = await res.json();

    cache = data.data.rank.slice(0, 10).map(token => ({
      symbol: token.symbol,
      address: token.address,
      liquidity: token.liquidity || 0,
      volume_5m: token.volume || 0,
      price_change_5m: token.priceChange || 0,
      age_minutes: token.age || 0,
      buys: token.buys || 0,
      sells: token.sells || 0
    }));

    lastFetch = now;

    return cache;

  } catch (err) {
    console.error("GMGN error:", err);
    return cache;
  }
}
