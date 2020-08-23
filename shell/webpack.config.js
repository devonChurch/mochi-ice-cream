const path = require("path");
const axios = require("axios");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");


module.exports = async (_, args) => {
  const locConfig = await axios("http://mochi-ice-cream.config.s3-website-ap-southeast-2.amazonaws.com/loc.config.json");
  const { shell: shellLoc, appOne: appOneLoc, appTwo: appTwoLoc } = locConfig.data;
  
  const envConfig = require("./env.config.json");
  const { shell: shellEnv, appOne: appOneEnv, appTwo: appTwoEnv } = envConfig;
  
  const DIR_SRC = path.resolve(__dirname, "src");
  const BUILD_ENV = shellEnv;
  const IS_NOT_DEVELOPMENT = BUILD_ENV !== "development"
  const IS_DEVELOPMENT = !IS_NOT_DEVELOPMENT;

  console.log(
    "Building Application [Shell]",
    args,
    JSON.stringify({
      location: { shellLoc, appOneLoc, appTwoLoc },
      environment: { shellEnv, appOneEnv, appTwoEnv },
      consts: { DIR_SRC, BUILD_ENV, IS_NOT_DEVELOPMENT, IS_DEVELOPMENT }
    }, null, 2));

  return {
    entry: path.resolve(DIR_SRC, "index"),
  
    output: {
      publicPath: shellLoc[BUILD_ENV].href
    },
  
    mode: IS_DEVELOPMENT ? "development" : "production",
  
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
      }),
  
      new MiniCssExtractPlugin(),
    ],
  
    ...IS_DEVELOPMENT && {
      devServer: {
        port: shellLoc.development.port,
      }
    },
  }
};
