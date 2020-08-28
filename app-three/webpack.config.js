const path = require("path");
const axios = require("axios");
const capitalize = require("lodash.capitalize");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = async (_, args) => {
  const PRODUCTION = "production";
  const DEVELOPMENT = "development";
  const MODE = args.mode;
  const DIR_SRC = path.resolve(__dirname, "src");
  const IS_NOT_DEVELOPMENT = MODE !== DEVELOPMENT;
  const IS_DEVELOPMENT = !IS_NOT_DEVELOPMENT;
  const ISOLATION_CHUNKS = ["app-three", "shell"];

  const { data: locConfig } = 
    await axios("http://mochi-ice-cream.config.s3-website-ap-southeast-2.amazonaws.com/loc.config.json");

  const envConfig = IS_NOT_DEVELOPMENT
    ? {appOne: MODE, utilities: MODE }
    : require("./env.config.json");

  const remotes = {
    appOne: `${locConfig.appOne[envConfig.appOne].href}remoteEntry.js`,
    utilities: `${locConfig.utilities[envConfig.utilities].href}remoteEntry.js`,
  };

  console.log(
    "Building Application [Three]",
    args,
    JSON.stringify({
      location: locConfig,
      environment: envConfig,
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
      publicPath: locConfig.appThree[MODE].href,
    },

    mode: MODE,

    devtool: "source-map",

    resolve: {
      extensions: [".ts", ".js", '.vue'],
    },

    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: {
            loader: "ts-loader",
            options: {
              appendTsSuffixTo: [/\.vue$/],
            }
          },
          exclude: /node_modules/,
          include: [DIR_SRC],
        },
        {
          test: /\.vue$/,
          loader: "vue-loader",
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
      ],
    },

    plugins: [
      new ModuleFederationPlugin({
        name: "app-three",
        library: { type: "var", name: "appThree" },
        filename: "remoteEntry.js",
        exposes: {
          "./Wrapper": "./src/index",
        },
        shared: ["single-spa-vue", "vue"],
        remotes: {
          // We tell the application to consume itself as a remote 🙃 so that we
          // can load it up in an isolated Micro Front-end shell away from the
          // "full" application experience.
          //
          // This allows us to resolve async shared dependancies without modifying
          // the `eagar` settings and can use same federated config to deploy an
          // "isolated" and "full" Micro Front-end bundle.
          appThree: "appThree",

          // Add remotes as "generic" federated references.
          // @example 
          // ✅ { "foo": "foo" }
          // ❎ { "foo": "foo@http://.../remoteEntry.js" }
          ...Object
            .keys(remotes)
            .reduce((acc, key) => 
              ({ ...acc, [key]: key }), {})
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
        ),
        remotes
      }),
      
      new webpack.EnvironmentPlugin({
        MODE: capitalize(MODE)
      }),

      new MiniCssExtractPlugin(),

      new VueLoaderPlugin()
    ],

    ...IS_DEVELOPMENT && {
      devServer: {
        port: locConfig.appThree[DEVELOPMENT].port,
      }
    },
  };
};
