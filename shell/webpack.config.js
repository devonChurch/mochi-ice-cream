const path = require("path");
const axios = require("axios");
const capitalize = require("lodash.capitalize");
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

  const locConfig = await axios("http://mochi-ice-cream.config.s3-website-ap-southeast-2.amazonaws.com/loc.config.json");
  const { shell: shellLoc, appOne: appOneLoc, appTwo: appTwoLoc } = locConfig.data;

  const { appOne: appOneEnv, appTwo: appTwoEnv } = IS_NOT_DEVELOPMENT
    ? { appOne: PRODUCTION, appTwo: PRODUCTION }
    : require("./env.config.json");

  console.log(
    "Building Application [Shell]",
    args,
    JSON.stringify({
      location: { shellLoc, appOneLoc, appTwoLoc },
      environment: { appOneEnv, appTwoEnv },
      consts: { DIR_SRC, MODE, IS_NOT_DEVELOPMENT, IS_DEVELOPMENT },
    }, null, 2 )
  );

  return {
    entry: path.resolve(DIR_SRC, "index"),

    output: {
      publicPath: shellLoc[MODE].href,
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
        name: "shell",
        remotes: {
          appOne: `appOne@${appOneLoc[appOneEnv].href}remoteEntry.js`,
          appTwo: `appTwo@${appTwoLoc[appTwoEnv].href}remoteEntry.js`,
        },
        shared: [],
      }),

      new HtmlWebpackPlugin({
        template: path.resolve(DIR_SRC, "index.html"),
        mode: capitalize(MODE)
      }),

      new MiniCssExtractPlugin(),
    ],

    ...(IS_DEVELOPMENT && {
      devServer: {
        port: shellLoc[DEVELOPMENT].port,
      },
    }),
  };
};
