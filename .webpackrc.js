const path = require('path')
const NODE_ENV = process.env.NODE_ENV

let plugins = []
if ('production' == NODE_ENV) {
  plugins = [
    "transform-remove-console"
  ]
}
export default {
  "extraBabelPlugins": [
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }],
    ...plugins
  ],
  alias: {
    '@': path.resolve(__dirname, './src')
  },
  "hash": true,
  "manifest": {
    "basePath": "/app/"
  },
  "html": {
    "template": "./src/index.ejs"
  }
}

