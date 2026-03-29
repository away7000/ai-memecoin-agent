import { calculateScore } from "./scoring.js";
import { predict } from "../ai/model.js";
import { extractFeatures } from "../ai/dataset.js";
import { isSafeToken } from "./filter.js";

export function shouldBuy(token) {
  if (!isSafeToken(token)) {
    return { decision: false, features: null };
  }

  const score = calculateScore(token);
  const features = extractFeatures(token);
  const aiProb = predict(features);

  console.log(`Score: ${score} | AI: ${aiProb}`);

  if (score > 70 && aiProb > 0.65) {
    return { decision: true, features };
  }

  return { decision: false, features };
}
