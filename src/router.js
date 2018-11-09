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
import  './components/Message'
import { Switch, Route, Redirect, routerRedux, Router } from 'dva/router'
import dynamic from 'dva/dynamic'
const { ConnectedRouter } = routerRedux

const Routers = function ({ history, app }) {
  // const error = dynamic({
  //   app,
  //   component: () => import('./routes/error'),
  // })
  const routes = [
    {
      path: '/',
      models: () => [import('./models/initRouteRedirect')],
      component: () => import('./routes/InitRouteRedirect/index'),
    }, {
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
    }, {
      path: '/technological',
      models: () => [import('./models/technological'),
        import('./models/technological/accountSet'),
        import('./models/technological/project'),
        import('./models/technological/projectDetail'),
        import('./models/technological/newsDynamic'),
        import('./models/technological/workbench'),
        import('./models/technological/organizationMember'),
        import('./models/technological/teamshow'),
        import('./models/technological/editTeamShow'),
        import('./models/modal')
      ],
      component: () => import('./routes/Technological/'),
    },{
      path: '/emailRedirect',
      models: () => [import('./models/emailRedirect')],
      component: () => import('./routes/EmailRedirect/'),
    },{
      path: '/organization',
      models: () => [import('./models/organization')],
      component: () => import('./routes/Organization/'),
    },{
      path: '/teamShow',
      models: () => [
        import('./models/teamShow'),
        import('./models/teamShow/editTeamShow'),
        import('./models/teamShow/teamList'),
        import('./models/teamShow/teamInfo'),
        import('./models/modal')
      ],
      component: () => import('./routes/TeamShow/'),
    },
  ]
  //去掉exact
  return (
    <Router history={history}>
      <Switch>
        {
          routes.map(({ path, ...dynamics }, key) => {
            return (
              <Route key={key}
                     exact={(path.indexOf('/technological') !== -1  || path.indexOf('/teamShow') !== -1 )? false : true}
                     path={path}
                     component={dynamic({
                       app,
                       ...dynamics,
                     })}
              />
            )
          })
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
