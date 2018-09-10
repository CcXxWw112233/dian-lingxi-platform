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
  const { dispatch, model } = options
  const app = dva();
  //导航栏props-------------
  const HeaderNavProps = {
    model,
    logout() {
      dispatch({
        type: getEffectOrReducerByName('logout'),
      })
    },
    routingJump(path) {
      dispatch({
        type: getEffectOrReducerByName('routingJump'),
        payload: {
          route:path,
        },
      })
    },
    updateDatas (payload) {
      dispatch({
        type: getEffectOrReducerByName('updateDatas') ,
        payload:payload
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
    }, {
      path: '/technological/newsDynamic',
      component: () => import('./components/NewsDynamic'),
    }
  ]
  return (
      <div className={globalClassNmae.page_style_3} style={{ minWidth:1200, position: 'relative'}}>
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
// export default connect(({ technological }) => {
//   return({
//     technological,
//   })
//
// })(Technological);


//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ modal, technological, loading }) {
  return { modal, model: technological, loading }
}
export default connect(mapStateToProps)(Technological)
