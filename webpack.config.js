// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin
const NODE_ENV = process.env.NODE_ENV
let plugins = []
if ('production' == NODE_ENV) {
  // plugins = [new BundleAnalyzerPlugin({ analyzerPort: 8333 })]
}
module.exports = (config, { webpack }) => {
  for (let index = 0; index < plugins.length; index++) {
    const element = plugins[index]
    config.plugins.push(element)
  }
  return config
}
