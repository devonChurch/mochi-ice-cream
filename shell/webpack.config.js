const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const DIR_SRC = path.resolve(__dirname, "src");
const SHELL_PORT = 8000;
const APP_ONE_PORT = 8001;

const createDevelopmentHref = (port) => `http://localhost:${port}/`;

module.exports = {
  entry: path.resolve(DIR_SRC, "index"),

  output: {
    publicPath: createDevelopmentHref(SHELL_PORT),
  },

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
        include: [DIR_SRC],
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      library: { type: "var", name: "shell" },
      filename: "remoteEntry.js",
      remotes: {
        "appOne": "appOne",
      },
      exposes: {},
      shared: [],
    }),

    new HtmlWebpackPlugin({
      template: path.resolve(DIR_SRC, "index.html"),
    }),
  ],

  devServer: {
    port: SHELL_PORT
  }
};
