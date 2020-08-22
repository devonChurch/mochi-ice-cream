const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const DIR_SRC = path.resolve(__dirname, "src");
const PORT = 8002;
const DEVELOPMENT_HREF = `http://localhost:${PORT}/`;

module.exports = (_, args) => {
  console.log("Building Application [Two]", args);

  // We set `eagar` === `true` in scenarios where we are build the application
  // to run in isolation as a "full" experience. There is no dependancy orchestration
  // outside of a Micro Front-end set up.
  const IS_EAGAR = args.env.intent === "full";

  return {
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
    ],

    devServer: {
      port: PORT
    }
  };
};