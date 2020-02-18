const webpack = require("webpack");
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const path = require("path")

module.exports = {
    entry: ["./src/index.ts"],
    watch: false,
    devtool: "source-map",
    mode: "production",
    performance: { hints: false },
    module: {
      rules: [
        {
            test: /\.scss$/,
            use: [
              'vue-style-loader',
              'css-loader?url=false'
            ]
        },
        {
          test: /\.scss$/,
          use: 'sass-loader'
        },
        {
            test: /\.vue$/,
            loader: "vue-loader"
        },
        {
            test: /\.ts$/,
            exclude: /node_modules/,
            loader: "ts-loader",
            options: {
                appendTsSuffixTo: [/\.vue$/],
            }
        },
      ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.vue'],
        alias: {
            '@': path.resolve(__dirname, 'src/'),
            vue$: 'vue/dist/vue.esm.js'
        },
    },
    plugins: [
      new webpack.ProgressPlugin(),
      new VueLoaderPlugin()
    ]
  };