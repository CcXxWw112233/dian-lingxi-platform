import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './routes/IndexPage/index';
import Products from './routes/Products/index';
import Login from './routes/Login/index';
import Register from './routes/Register/index';
import RegisterSuccess from './routes/RegisterSuccess'
import ResetPassword from './routes/ResetPassword'
import RetrievePassword from './routes/RetrievePassword'
function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/products" exact component={Products} />
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
        <Route path="/registerSuccess" exact component={RegisterSuccess} />
        <Route path="/resetPassword" exact component={ResetPassword} />
        <Route path="/retrievePassword" exact component={RetrievePassword} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
