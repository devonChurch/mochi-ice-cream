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
  const ISOLATION_CHUNKS = [
    "shell", // `shell` is the name of the federated module.
    "main" // `main` represents what Webpack names the entry by default.
  ];

  const { data: locConfig } =
    await axios("http://mochi-ice-cream.config.s3-website-ap-southeast-2.amazonaws.com/loc.config.json");

  const envConfig = IS_NOT_DEVELOPMENT
    ? { appOne: MODE, appTwo: MODE, appThree: MODE, utilities: MODE }
    : require("./env.config.json");

  const remotes = {
    appOne: `${locConfig.appOne[envConfig.appOne].href}remoteEntry.js`,
    appTwo: `${locConfig.appTwo[envConfig.appTwo].href}remoteEntry.js`,
    appThree: `${locConfig.appThree[envConfig.appThree].href}remoteEntry.js`,
    utilities: `${locConfig.utilities[envConfig.utilities].href}remoteEntry.js`,
  };

  console.log(
    "Building Application [Shell]",
    args,
    JSON.stringify({
      location: locConfig,
      environment: envConfig,
      consts: { DIR_SRC, MODE, IS_NOT_DEVELOPMENT, IS_DEVELOPMENT },
    }, null, 2 )
  );

  return {
    entry: path.resolve(DIR_SRC, "index"),

    output: {
      publicPath: locConfig.shell[MODE].href,
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

        library: { type: "var", name: "shell" },
        filename: "remoteEntry.js",
        exposes: {
          "./Wrapper": "./src/index",
        },
        
        remotes: {
          // Set the `shell` to consume its own `remoteEntry` so that we can swap
          // out the "full" federated declaration and instead mimic the isolated
          // application experience closer.
          shell: "shell",

          // Add remotes as "generic" federated references.
          // @example 
          // ✅ { "foo": "foo" }
          // ❎ { "foo": "foo@http://.../remoteEntry.js" }
          ...Object
            .keys(remotes)
            .reduce((acc, key) => 
              ({ ...acc, [key]: key }), {})
        },
        
        shared: [],
      }),

      new HtmlWebpackPlugin({
        template: path.resolve(DIR_SRC, "index.html"),
        mode: capitalize(MODE),
        // We make sure that the `remoteEntry.js` (shell) and `main.js` are loaded
        // into the HTML scaffold IN THAT ORDER.
        chunks: ISOLATION_CHUNKS,
        chunksSortMode: (prevChunk, nextChunk) => (
          ISOLATION_CHUNKS.indexOf(prevChunk)
          - ISOLATION_CHUNKS.indexOf(nextChunk)
        ),
        remotes
      }),

      new MiniCssExtractPlugin(),
    ],

    ...(IS_DEVELOPMENT && {
      devServer: {
        port: locConfig.shell[DEVELOPMENT].port,
      },
    }),
  };
};
