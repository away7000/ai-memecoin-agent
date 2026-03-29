export function calculateScore(token) {
  let score = 0;

  if (token.liquidity >= 10000) score += 10;
  if (token.liquidity >= 25000) score += 10;

  if (token.volume_5m >= 5000) score += 10;
  if (token.volume_5m >= 15000) score += 10;

  if (token.price_change_5m >= 5) score += 5;
  if (token.price_change_5m >= 10) score += 10;

  if (token.age_minutes <= 30) score += 10;

  const totalTx = token.buys + token.sells;
  if (totalTx > 0) {
    const ratio = token.buys / totalTx;
    if (ratio > 0.6) score += 10;
  }

  if (token.liquidity_locked) score += 5;
  if (!token.mint_enabled) score += 5;

  return score;
}
