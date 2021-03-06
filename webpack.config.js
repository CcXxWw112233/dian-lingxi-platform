// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin
// "webpack-bundle-analyzer": "^4.1.0"
const NODE_ENV = process.env.NODE_ENV
const webpack = require('webpack')
let plugins = []
if ('production' == NODE_ENV) {
  plugins = [
    // new BundleAnalyzerPlugin({ analyzerPort: 8333 }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en-gb|zh-cn/)
  ]
}
module.exports = (config, { webpack }) => {
  for (let index = 0; index < plugins.length; index++) {
    const element = plugins[index]
    config.plugins.push(element)
  }
  return config
}
