let cache = [];
let lastFetch = 0;

export async function scanGMGN() {
  const now = Date.now();

  // 📦 1. CACHE (biar gak sering hit API)
  if (now - lastFetch < 60000 && cache.length > 0) {
    console.log("📦 GMGN cache");
    return cache;
  }

  try {
    const res = await fetch("https://gmgn.ai/defi/quotation/v1/rank/sol", {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
      }
    });

    // 🔥 2. AMBIL TEXT DULU (bukan json)
    const text = await res.text();

    // 🚫 3. DETECT HTML (ini yang bikin error kamu)
    if (text.startsWith("<")) {
      console.log("🚫 GMGN kena block (HTML)");
      return cache; // fallback ke cache
    }

    // ✅ 4. BARU PARSE JSON
    const data = JSON.parse(text);

    if (!data?.data?.rank) {
      console.log("❌ GMGN data kosong");
      return cache;
    }

    // 🔄 5. SIMPAN KE CACHE
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
