const path = require("path");
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const baseConfig = require("./base.webpack.config");

const additionalConfig = {
  mode: "development",
  devtool: "source-map",
  devServer: {
    // publicPath: path.resolve(__dirname, '../dist')
  },
  devtool: "eval",
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../template/index.html"),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../assets"),
          to: path.resolve(__dirname, "../dist/assets"),
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(__dirname, "../manifest/*"),
          to: path.resolve(__dirname, "../dist/"),
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(__dirname, "../src/assets"),
          to: path.resolve(__dirname, "../dist/assets"),
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
};

module.exports = merge(baseConfig, additionalConfig);
