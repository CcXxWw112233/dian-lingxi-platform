import React from 'react';
import { connect } from 'dva';
import QueueAnim from  'rc-queue-anim'
import globalClassNmae from '../../globalset/css/globalClassName.less'
import HeaderNav from './components/HeaderNav'
import { Route, Router, Switch, Link } from 'dva/router'
import dynamic from "dva/dynamic";
import dva from "dva/index";

import modelExtend from 'dva-model-extend'
import ClassBasicModel from '../../models/technological'

const getEffectOrReducerByName = name => `technological/${name}`
const Technological = (options) => {
  const { dispatch, history, technological } = options
  const app = dva();

  //导航栏props-------------
  const HeaderNavProps = {
    setChirldrenRoute(data) {
      const chirldRoute = data
      dispatch({
        type: getEffectOrReducerByName('setChirldrenRoute'),
        payload: {
          chirldRoute,
        },
      })
    },
    routingJump(path) {
      dispatch({
        type: getEffectOrReducerByName('routingJump'),
        payload: {
          route:path,
        },
      })
    }
  }
  //-----------------

  const routes = [
    {
      path: '/technological/accoutSet',
      component: () => import('./components/AccountSet'),
    }, {
      path: '/technological/project',
      component: () => import('./components/Project'),
    }, {
      path: '/technological/projectDetail',
      component: () => import('./components/ProjectDetail'),
    }
  ]

  return (
      <div className={globalClassNmae.page_style_3} >
        <HeaderNav {...HeaderNavProps}/>
        {
          routes.map(({ path, ...dynamics }, key) =>{
            return (<Route key={key}
                   exact
                   path={path}
                   component={dynamic({
                     app,
                     ...dynamics,
                   })}
            />
          )})
        }
      </div>
  );
};

// export default Products;
export default connect(({ technological }) => ({
  technological,
}))(Technological);


