import fs from "fs";

export function trainModel() {
  const data = JSON.parse(fs.readFileSync("./data/trades.json"));

  const weights = new Array(data[0].features.length).fill(0);
  let bias = 0;
  const lr = 0.1;

  for (let epoch = 0; epoch < 100; epoch++) {
    for (let d of data) {
      const x = d.features;
      const y = d.result;

      let z = bias;
      for (let i = 0; i < x.length; i++) {
        z += weights[i] * x[i];
      }

      const pred = 1 / (1 + Math.exp(-z));
      const error = y - pred;

      for (let i = 0; i < x.length; i++) {
        weights[i] += lr * error * x[i];
      }

      bias += lr * error;
    }
  }

  fs.writeFileSync("./model/model.json", JSON.stringify({ weights, bias }));
}
