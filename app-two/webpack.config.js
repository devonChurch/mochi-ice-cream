const path = require("path");
const axios = require("axios");
const capitalize = require("lodash.capitalize");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = async (_, args) => {
  const PRODUCTION = "production";
  const DEVELOPMENT = "development";
  const MODE = args.mode;
  const DIR_SRC = path.resolve(__dirname, "src");
  const IS_NOT_DEVELOPMENT = MODE !== DEVELOPMENT;
  const IS_DEVELOPMENT = !IS_NOT_DEVELOPMENT;
  const ISOLATION_CHUNKS = ["app-two", "shell"];

  const locConfig = await axios("http://mochi-ice-cream.config.s3-website-ap-southeast-2.amazonaws.com/loc.config.json");
  const { appTwo: appTwoLoc } = locConfig.data;

  console.log(
    "Building Application [Two]",
    args,
    JSON.stringify({
      location: { appTwoLoc },
      consts: { DIR_SRC, MODE, IS_NOT_DEVELOPMENT, IS_DEVELOPMENT }
    }, null, 2));

  return {
    entry: {
      main: path.resolve(DIR_SRC, "index"),

      // The Shell is a dedicated entry point specifically for getting the application
      // up and running when its running in an isolated environment. "Isolated"
      // meaning that it is not part of the "full" Micro Front-end experience,
      // and is being loaded on its own.
      //
      // This allows developers to developer in isolation locally and see the
      // application in a live isolated context after deployment.
      shell: path.resolve(DIR_SRC, "shell")
    },

    output: {
      publicPath: appTwoLoc[MODE].href,
    },

    mode: MODE,

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
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
      ],
    },

    plugins: [
      new ModuleFederationPlugin({
        name: "app-two",
        library: { type: "var", name: "appTwo" },
        filename: "remoteEntry.js",
        exposes: {
          "./Wrapper": "./src/index",
        },
        shared: ["angular", "single-spa-angularjs"],
        remotes: {
          // We tell the application to consume itself as a remote 🙃 so that we
          // can load it up in an isolated Micro Front-end shell away from the
          // "full" application experience.
          //
          // This allows us to resolve async shared dependancies without modifying
          // the `eagar` settings and can use same federated config to deploy an
          // "isolated" and "full" Micro Front-end bundle.
          appTwo: "appTwo"
        }
      }),

      new HtmlWebpackPlugin({
        template: path.resolve(DIR_SRC, "index.html"),
        // We make sure that the `remoteEntry.js` (app-two) and the `shell.js`
        // are loaded into the HTML scaffold IN THAT ORDER.
        // 
        // @note we are not supplying the generic `main.js` into the HTML scaffold
        // as we want to emulate the SingleSPA initialisation sequence with all
        // of its async imports.
        chunks: ISOLATION_CHUNKS,
        chunksSortMode: (prevChunk, nextChunk) => (
          ISOLATION_CHUNKS.indexOf(prevChunk)
          - ISOLATION_CHUNKS.indexOf(nextChunk)
        )
      }),
      
      new webpack.EnvironmentPlugin({
        MODE: capitalize(MODE)
      }),

      new MiniCssExtractPlugin(),
    ],

    ...IS_DEVELOPMENT && {
      devServer: {
        port: appTwoLoc[DEVELOPMENT].port,
      }
    },
  };
};
