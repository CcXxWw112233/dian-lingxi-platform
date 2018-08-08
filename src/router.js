// import React from 'react';
// import { Router, Route, Switch } from 'dva/router';
// import IndexPage from './routes/IndexPage/index';
// import Products from './routes/Products/index';
// import Login from './routes/Login/index';
// import Register from './routes/Register/index';
// import RegisterSuccess from './routes/RegisterSuccess'
// import ResetPassword from './routes/ResetPassword'
// import RetrievePassword from './routes/RetrievePassword'
// function RouterConfig({ history }) {
//   return (
//     <Router history={history}>
//       <Switch>
//         <Route path="/" exact component={IndexPage} />
//         <Route path="/products" exact component={Products} />
//         <Route path="/login" exact component={Login} />
//         <Route path="/register" exact component={Register} />
//         <Route path="/registerSuccess" exact component={RegisterSuccess} />
//         <Route path="/resetPassword" exact component={ResetPassword} />
//         <Route path="/retrievePassword" exact component={RetrievePassword} />
//       </Switch>
//     </Router>
//   );
// }
//
// export default RouterConfig;
import React from 'react'
import PropTypes from 'prop-types'
// import  './components/Message'
import { Switch, Route, Redirect, routerRedux, Router } from 'dva/router'
import dynamic from 'dva/dynamic'
const { ConnectedRouter } = routerRedux

const Routers = function ({ history, app }) {
  // const error = dynamic({
  //   app,
  //   component: () => import('./routes/error'),
  // })
  const routes = [
    // {
    //   path: '/login',
    //   component: () => import('./routes/dashboard/'),
    // }, {
    //   path: '/setting',
    //   models: app,
    //   component: () => import('./routes/setting/'),
    // },
    {
      path: '/login',
      models: () => [import('./models/login')],
      component: () => import('./routes/Login/'),
    }, {
      path: '/register',
      models: () => [import('./models/register')],
      component: () => import('./routes/Register/'),
    }, {
      path: '/registerSuccess',
      models: () => [import('./models/registerSuccess')],
      component: () => import('./routes/RegisterSuccess/'),
    }, {
      path: '/resetPassword',
      models: () => [import('./models/resetPassword')],
      component: () => import('./routes/ResetPassword/'),
    }, {
      path: '/retrievePassword',
      models: () => [import('./models/retrievePassword')],
      component: () => import('./routes/RetrievePassword/'),
    }

  ]

  return (
    <Router history={history}>
      <Switch>
        {
          routes.map(({ path, ...dynamics }, key) => (
            <Route key={key}
                   exact
                   path={path}
                   component={dynamic({
                     app,
                     ...dynamics,
                   })}
            />
          ))
        }
      </Switch>
    </Router>
  )
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
