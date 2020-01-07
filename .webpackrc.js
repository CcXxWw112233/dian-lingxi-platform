const path = require('path')

export default {
  "extraBabelPlugins": [
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }],
    "transform-remove-console"
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

