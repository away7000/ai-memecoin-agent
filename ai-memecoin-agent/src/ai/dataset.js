export function extractFeatures(token) {
  return [
    token.liquidity / 100000,
    token.volume_5m / 50000,
    token.price_change_5m / 100,
    token.age_minutes / 60,
    token.buys / (token.buys + token.sells || 1),
    token.liquidity_locked ? 1 : 0,
    token.mint_enabled ? 0 : 1
  ];
}
