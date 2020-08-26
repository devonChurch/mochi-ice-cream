const path = require("path");
const axios = require("axios");
const capitalize = require("lodash.capitalize");
const webpack = require("webpack");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = async (_, args) => {
  const PRODUCTION = "production";
  const DEVELOPMENT = "development";
  const MODE = args.mode;
  const DIR_SRC = path.resolve(__dirname, "src");
  const IS_NOT_DEVELOPMENT = MODE !== DEVELOPMENT;
  const IS_DEVELOPMENT = !IS_NOT_DEVELOPMENT;
  const OPTIMIZELY_SDK = {
    development: "BQUkKJQ7UhKCVVuY8eKeV",
    production: "YAArvxpSjVqhwjJoKauJZ"
  };

  const locConfig = await axios("http://mochi-ice-cream.config.s3-website-ap-southeast-2.amazonaws.com/loc.config.json");
  const { utilities: utilitiesLoc } = locConfig.data;

  console.log(
    "Building Application [Utilities]",
    args,
    JSON.stringify({
      location: { utilitiesLoc },
      consts: { DIR_SRC, MODE, IS_NOT_DEVELOPMENT, IS_DEVELOPMENT }
    }, null, 2));

  return {
    entry: path.resolve(DIR_SRC, "index"),

    output: {
      publicPath: utilitiesLoc[MODE].href,
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
        }
      ]
    },

    plugins: [
      new ModuleFederationPlugin({
        name: "utilities",
        library: { type: "var", name: "utilities" },
        filename: "remoteEntry.js",
        exposes: {
          "./core": "./src/index",
        },
        shared: [],
        remotes: {}
      }),

      new webpack.EnvironmentPlugin({
        MODE: capitalize(MODE),
        OPTIMIZELY_SDK: IS_NOT_DEVELOPMENT
          ? OPTIMIZELY_SDK.production
          : OPTIMIZELY_SDK.development
      })
    ],

    ...IS_DEVELOPMENT && {
      devServer: {
        port: utilitiesLoc[DEVELOPMENT].port,
      }
    },
  };
};
