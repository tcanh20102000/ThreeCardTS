const webpack = require("webpack");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const withReport = process.env.npm_config_withReport;

module.exports = {
  mode: "production",
  devtool: "source-map",
  plugins: [
    new webpack.DefinePlugin({
      "process.env.name": JSON.stringify("Codevolution"),
    }),
    withReport? new BundleAnalyzerPlugin(): '',
  ],
};
