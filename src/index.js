import '@babel/polyfill'
import 'raf/polyfill';
// import 'react-dom'
import dva from 'dva';
import './index.css';

//兼容ie10及以下
Object.setPrototypeOf = require('setprototypeof');
// var browser=navigator.appName
// var b_version=navigator.appVersion
// var version=b_version.split(";");
// var trim_Version=version[1]
// if(browser=="Microsoft Internet Explorer")
// {
//   alert(trim_Version);
// }
// 1. Initialize
const app = dva({
  // history: createHistory(), //参考自https://www.jianshu.com/p/2e9e45e9a880
  // onError(e, dispatch) {
  //   console.log(e.message);
  // },
});

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/workspace-global').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

