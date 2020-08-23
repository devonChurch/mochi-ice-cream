const path = require("path");
const axios = require("axios");
const capitalize = require("lodash.capitalize");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = async (_, args) => {
  const PRODUCTION = "production";
  const DEVELOPMENT = "development";
  const MODE = args.mode;
  const DIR_SRC = path.resolve(__dirname, "src");
  // We set `eagar` === `true` in scenarios where we are build the application
  // to run in isolation as a "full" experience. There is no dependancy orchestration
  // outside of a Micro Front-end set up.
  const IS_EAGAR = (args.env || {}).intent === "full";
  const IS_NOT_DEVELOPMENT = MODE !== DEVELOPMENT;
  const IS_DEVELOPMENT = !IS_NOT_DEVELOPMENT;

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
    entry: path.resolve(DIR_SRC, "index"),

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
        shared: [
          {
            angular: { eager: IS_EAGAR },
          },
          {
            "single-spa-angularjs": { eager: IS_EAGAR },
          },
        ],
      }),

      new HtmlWebpackPlugin({
        template: path.resolve(DIR_SRC, "index.html"),
      }),
      
      new webpack.EnvironmentPlugin({
        MODE: capitalize(MODE)
      })
    ],

    ...IS_DEVELOPMENT && {
      devServer: {
        port: appTwoLoc[DEVELOPMENT].port,
      }
    },
  };
};
