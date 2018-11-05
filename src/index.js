import dva from 'dva';
import './index.css';
// import createHistory from 'history/createBrowserHistory';

// 1. Initialize
// const app = dva();
const app = dva({
  // history: createHistory(), //参考自https://www.jianshu.com/p/2e9e45e9a880
  // onError(e, dispatch) {
  //   console.log(e.message);
  // },
});

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

