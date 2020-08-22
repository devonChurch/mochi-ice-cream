const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const DIR_SRC = path.resolve(__dirname, "src");
const PORT = 8001;
const DEVELOPMENT_HREF = `http://localhost:${PORT}/`;

module.exports = (_, args) =>
  console.log("Webpack args", _, args) || {
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
        name: "app-one",
        library: { type: "var", name: "appOne" },
        filename: "remoteEntry.js",
        remotes: {},
        exposes: {
          "./Wrapper": "./src/index",
        },
        shared: ["angular", "single-spa-angularjs"],
      }),

      new HtmlWebpackPlugin({
        template: path.resolve(DIR_SRC, "index.html"),
      }),
    ],

    devServer: {
      port: PORT
    }
  };
