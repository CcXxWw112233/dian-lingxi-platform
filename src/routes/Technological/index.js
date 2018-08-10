import React from 'react';
import { connect } from 'dva';
import QueueAnim from  'rc-queue-anim'
import globalClassNmae from '../../globalset/css/globalClassName.less'
import HeaderNav from './components/HeaderNav'
import { Route, Router, Switch, Link } from 'dva/router'
import Login from '../Login/index'
import Register from '../Register/index'

const getEffectOrReducerByName = name => `technological/${name}`
const Technological = (options) => {
  const { dispatch, history, technological } = options
  const { datas = {}} = technological
  const { chirldRoute } = datas
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

  //按名称匹配子路由-------------
  const componentObj = {
    '/login': Login,
    '/register': Register
  }
  const filterRouteComponent = (chirldRoute) =>{
    let component
     for (let i in componentObj) {
       if (i === chirldRoute){
         component = componentObj[i]
         break
       }
     }
     return component
  }
  //--------------------

  return (
      <div className={globalClassNmae.page_style_3} >
        <HeaderNav {...HeaderNavProps}/>
        <div>
          {chirldRoute ? (
            <Switch>
              <Route path={`/technological${chirldRoute}`} expected  component={filterRouteComponent(chirldRoute)}/>
            </Switch>
          ) : ('')}
        </div>
      </div>
  );
};

// export default Products;
export default connect(({ technological }) => ({
  technological,
}))(Technological);

