/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");

const distConfig = {
  name: "dist",
  target: "web",
  mode: "production",
  performance: { hints: false },
  entry: "./lib/index",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "dist.bundle.js"
  },
  externals: [],
  resolve: {
    extensions: [".ts", ".js", ".json"]
  },
  node: {
    fs: "empty"
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  }
};

const browserbenchConfig = {
  name: "browserbench",
  target: "web",
  mode: "production",
  performance: { hints: false },
  entry: path.resolve(__dirname, "src/browserbench/browserbench.ts"),
  output: {
    path: path.resolve(__dirname, "serve-browserbench/public"),
    filename: "browserbench.bundle.js",
    library: "browserbench",
    libraryTarget: "window"
  },
  externals: [],
  resolve: {
    extensions: [".ts", ".js", ".json"]
  },
  node: {
    fs: "empty"
  },
  module: {
    rules: [
      {
        loader: "babel-loader"
      }
    ]
  }
};

module.exports = [distConfig, browserbenchConfig];
