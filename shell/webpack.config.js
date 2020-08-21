const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const DIR_SRC = path.resolve(__dirname, "src");

module.exports = {
  entry: "./src/index",

  mode: "development",

  devtool: "source-map",

  resolve: {
    extensions: [".ts", ".js"],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
        include: [DIR_SRC]
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin()
  ]
};
