const path = require('path')
const NODE_ENV = process.env.NODE_ENV

let plugins = []
if ('production' == NODE_ENV) {
  plugins = ['transform-remove-console']
}
export default {
  entry: {
    index: './src/index.js',
    vendor: [
      'react',
      'react-dom',
      'dva',
      'react-router',
      'moment',
      'js-cookie',
      // 'rc-queue-anim',
      // 'react-beautiful-dnd',
      'lodash'
    ]
    // lingxi_im: ['lingxi-im'],
    // antd: ['antd']
    // components: [
    //   /*组件*/
    //   './src/components'
    // ],
    // services: ['./src/services']
  },
  commons: [
    {
      names: ['vendor'],
      minChunks: Infinity
    }
  ],
  extraBabelPlugins: [
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' }],
    ...plugins
  ],
  alias: {
    '@': path.resolve(__dirname, './src'),
    src: path.resolve(__dirname, './src')
  },
  hash: true,
  manifest: {
    basePath: '/app/'
  },
  html: {
    template: './public/index.ejs'
  }
}
