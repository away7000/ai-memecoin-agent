import fetch from "node-fetch";

export async function scanTokens() {
  try {
    const res = await fetch("https://api.dexscreener.com/latest/dex/pairs/solana");
    const data = await res.json();

    return data.pairs.map(pair => ({
      symbol: pair.baseToken.symbol,
      address: pair.baseToken.address,
      liquidity: pair.liquidity?.usd || 0,
      volume_5m: pair.volume?.m5 || 0,
      price_change_5m: pair.priceChange?.m5 || 0,
      age_minutes: (Date.now() - pair.pairCreatedAt) / 60000,
      buys: pair.txns?.m5?.buys || 0,
      sells: pair.txns?.m5?.sells || 0,
      liquidity_locked: true, // sementara default
      mint_enabled: false     // sementara default
    }));

  } catch (err) {
    console.error("Scanner error:", err);
    return [];
  }
}
