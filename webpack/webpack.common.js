const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
//const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, "..", "./src/index.tsx"),
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          { loader: "style-loader" },
          // Translates CSS into CommonJS
          {
            loader: "css-loader",
            options: { importLoaders: 1, modules: true },
          },
          // Compiles Sass to CSS
          { loader: "sass-loader" },
        ],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: "asset/inline",
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "..", "./build"),
    filename: "bundle.js",
    publicPath: "/",
  },
  devServer: {
    historyApiFallback: true,
    compress: true,
    public: "store-client-nestroia1.c9users.io",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "..", "./src/index.html"),
    }),
    // new CopyPlugin({
    //   patterns: [{ from: "source", to: "dest", noErrorOnMissing: true }],
    // }),
  ],
  stats: "errors-only",
};
