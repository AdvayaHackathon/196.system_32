// cdss.js
const tf = require('@tensorflow/tfjs');

class CDSS {
  constructor() {
    this.model = tf.sequential();
    this.buildModel().then(() => {});
  }

  async buildModel() {
    this.model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [100] }));
    this.model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));
    this.model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
  }

  async trainModel(data) {
    const xs = data.map((item) => item.inputs);
    const ys = data.map((item) => item.outputs);
    await this.model.fit(tf.tensor2d(xs), tf.tensor2d(ys), { epochs: 100 });
  }

  async makePrediction(inputs) {
    await this.buildModel();
    const predictions = await this.model.predict(tf.tensor2d([inputs]));
    return predictions.arraySync()[0];
  }
}

module.exports = CDSS;
