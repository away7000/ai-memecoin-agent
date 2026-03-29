import { validateWithHelius } from "./scannerHelius.js";
import { scanGMGN } from "./scannerGMGN.js";

export async function scanTokens() {
  const tokens = await scanGMGN();

  return tokens;
}
