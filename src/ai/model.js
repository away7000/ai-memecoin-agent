import fs from "fs";

let model = null;

export function loadModel() {
  if (fs.existsSync("./model/model.json")) {
    model = JSON.parse(fs.readFileSync("./model/model.json"));
  }
}

export function predict(features) {
  if (!model) return 0.5;

  let z = model.bias;

  for (let i = 0; i < features.length; i++) {
    z += features[i] * model.weights[i];
  }

  return 1 / (1 + Math.exp(-z));
}
