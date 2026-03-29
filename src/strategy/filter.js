export function isSafeToken(token) {
  // 1. liquidity minimal
  if (token.liquidity < 10000) return false;

  // 2. volume harus ada
  if (token.volume_5m < 2000) return false;

  // 3. buy pressure
  const total = token.buys + token.sells;
  if (total === 0) return false;

  const buyRatio = token.buys / total;
  if (buyRatio < 0.55) return false;

  // 4. age (hindari terlalu baru)
  if (token.age_minutes < 2) return false;

  return true;
}
