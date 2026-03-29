import { calculateScore } from "./scoring.js";
import { predict } from "../ai/model.js";
import { extractFeatures } from "../ai/dataset.js";

export function shouldBuy(token) {
  const score = calculateScore(token);
  const features = extractFeatures(token);
  const aiProb = predict(features);

  console.log(`Score: ${score} | AI: ${aiProb}`);

  if (score > 50 && aiProb > 0.6) {
    return { decision: true, features };
  }

  return { decision: false, features };
}
