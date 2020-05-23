/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");

const browserbenchConfig = {
  name: "browserbench",
  target: "web",
  mode: "production",
  performance: { hints: false },
  entry: path.resolve(__dirname, "src/browserbench/browser.bench.ts"),
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
        test: /\.ts$/,
        loader: "transform-loader?brfs"
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: "ts-loader"
      }
    ]
  }
};

// WARNING: THIS IS A HACK
//   The goal of libConfig is to inline .glsl files using
//   transform-loader and not minifiy or "pack" anything at all

const glob = require("glob");
const EmitAllPlugin = require("webpack-emit-all-plugin");
const DisableOutputWebpackPlugin = require("disable-output-webpack-plugin");

const libConfig = {
  name: "lib",
  target: "web",
  mode: "none",
  performance: { hints: false },
  optimization: {
    minimize: false
  },
  entry: glob.sync("./lib/**/!(*.d|*.test|*.bench).js"),
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
        test: /\.js$/,
        loader: "transform-loader?brfs"
      }
    ]
  },
  plugins: [
    new DisableOutputWebpackPlugin(),
    new EmitAllPlugin({
      ignorePattern: /node_modules/,
      path: "."
    })
  ]
};

module.exports = [browserbenchConfig, libConfig];
