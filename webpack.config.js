const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

module.exports = (config, { webpack }) => {
  config.plugins.push(new BundleAnalyzerPlugin())
  return config
}
