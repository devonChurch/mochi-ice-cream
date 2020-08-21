const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const DIR_SRC = path.resolve(__dirname, "src");
const PORT = 8002;
const DEVELOPMENT_HREF = `http://localhost:${PORT}/`;

module.exports = (args) =>
  console.log("Webpack args", args) || {
    entry: path.resolve(DIR_SRC, "index"),

    output: {
      publicPath: DEVELOPMENT_HREF,
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
        name: "app-two",
        library: { type: "var", name: "appTwo" },
        filename: "remoteEntry.js",
        remotes: {},
        exposes: {
          "./Wrapper": "./src/index",
        },
        shared: [],
      }),

      new HtmlWebpackPlugin({
        template: path.resolve(DIR_SRC, "index.html"),
      }),
    ],

    devServer: {
      port: PORT
    }
  };
