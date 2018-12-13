const path = require('path')
const webpack = require('webpack');

module.exports = {
  target: 'electron-main',
  entry: { main: './src/index.ts' },
  mode: "development",
  output: {
    path: path.resolve(__dirname,'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx', '.json']
  },
  node: {
    __dirname: false
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production'
    })
  ]
}