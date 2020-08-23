const path = require("path");
const axios = require("axios");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = async (_, args) => {
  const locConfig = await axios("http://mochi-ice-cream.config.s3-website-ap-southeast-2.amazonaws.com/loc.config.json");
  const { appOne: appOneLoc } = locConfig.data;
  
  const { intent, appOneEnv } = args.env || {};
  
  // We set `eagar` === `true` in scenarios where we are build the application
  // to run in isolation as a "full" experience. There is no dependancy orchestration
  // outside of a Micro Front-end set up.
  const DIR_SRC = path.resolve(__dirname, "src");
  const IS_EAGAR = intent === "full";
  const BUILD_ENV = appOneEnv;
  const IS_NOT_DEVELOPMENT = BUILD_ENV !== "development";
  const IS_DEVELOPMENT = !IS_NOT_DEVELOPMENT;

  console.log(
    "Building Application [One]",
    args,
    JSON.stringify({
      location: { appOneLoc },
      environment: { appOneEnv },
      consts: { DIR_SRC, BUILD_ENV, IS_NOT_DEVELOPMENT, IS_DEVELOPMENT }
    }, null, 2));

  return {
    entry: path.resolve(DIR_SRC, "index"),

    output: {
      publicPath: appOneLoc[BUILD_ENV].href,
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
        BUILD_ENV
      })
    ],

    ...IS_DEVELOPMENT && {
      devServer: {
        port: appOneLoc.development.port,
      }
    },
  };
};
