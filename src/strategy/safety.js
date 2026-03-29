import { validateWithHelius } from "../services/scannerHelius.js";

export async function isSafeAdvanced(token) {
  // 1) basic liquidity & activity
  if (token.liquidity < 10000) return false;
  if (token.volume_5m < 3000) return false;

  const total = token.buys + token.sells;
  if (total < 20) return false;

  const buyRatio = token.buys / total;
  if (buyRatio < 0.55) return false;

  // 2) age filter (hindari ultra fresh)
  if (token.age_minutes < 3) return false;

  // 3) on-chain validation (Helius)
  const heliusOK = await validateWithHelius(token);
  if (!heliusOK) return false;

  // 4) simple “suspicious spike” (anti bait)
  if (token.price_change_5m > 50) return false;

  return true;
}
