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
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';


const getEffectOrReducerByName = name => `technological/${name}`
const organizationMemberPermissions = JSON.parse(localStorage.getItem('organizationMemberPermissions')) || []
for(let i = 0; i < organizationMemberPermissions.length; i++) {
  const obj = {}
  const str = `export const ${organizationMemberPermissions[i].code.replace(/\:/gim,'_').toUpperCase()} = '${organizationMemberPermissions[i].code}' //${organizationMemberPermissions[i].name} permission_type=${organizationMemberPermissions[i].permission_type}`
  const str2 = `public static final String ${organizationMemberPermissions[i].code.replace(/\:/gim, '_').toUpperCase()} = "${organizationMemberPermissions[i].code}";  //${organizationMemberPermissions[i].name} permission_type=${organizationMemberPermissions[i].permission_type}`
  if(organizationMemberPermissions[i].permission_type === '1'){
    // console.log(str2)
  }
}
for(let i = 0; i < organizationMemberPermissions.length; i++) {
  const obj = {}
  const str = `export const ${organizationMemberPermissions[i].code.replace(/\:/gim,'_').toUpperCase()} = '${organizationMemberPermissions[i].code}' //${organizationMemberPermissions[i].name} permission_type=${organizationMemberPermissions[i].permission_type}`
  const str2 = `public static final String ${organizationMemberPermissions[i].code.replace(/\:/gim, '_').toUpperCase()} = "${organizationMemberPermissions[i].code}";  //${organizationMemberPermissions[i].name} permission_type=${organizationMemberPermissions[i].permission_type}`

  if(organizationMemberPermissions[i].permission_type === '2'){
    // console.log(str2)
  }
}
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
    },
    //组织
    getSearchOrganizationList(data) {
      dispatch({
        type: getEffectOrReducerByName('getSearchOrganizationList'),
        payload: data
      })
    },
    createOrganization(data) {
      dispatch({
        type: getEffectOrReducerByName('createOrganization'),
        payload: data
      })
    },
    updateOrganization(data) {
      dispatch({
        type: getEffectOrReducerByName('updateOrganization'),
      })
    },
    applyJoinOrganization(data) {
      dispatch({
        type: getEffectOrReducerByName('applyJoinOrganization'),
        payload: data
      })
    },
    inviteJoinOrganization(data) {
      dispatch({
        type: getEffectOrReducerByName('inviteJoinOrganization'),
        payload: data
      })
    },
    uploadOrganizationLogo(data) {
      dispatch({
        type: getEffectOrReducerByName('uploadOrganizationLogo'),
        payload: data
      })
    },
    changeCurrentOrg(data) {
      dispatch({
        type: getEffectOrReducerByName('changeCurrentOrg'),
        payload: data
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
      path: '/technological/projectDetail/:id?',
      component: () => import('./components/ProjectDetail'),
    }, {
      path: '/technological/newsDynamic',
      component: () => import('./components/NewsDynamic'),
    }, {
      path: '/technological/workbench',
      component: () => import('./components/Workbench'),
    }, {
      path: '/technological/organizationMember',
      component: () => import('./components/OrganizationMember'),
    }
  ]
  return (
    <LocaleProvider locale={zh_CN}>
      <div className={globalClassNmae.page_style_3} style={{ minWidth:1440, position: 'relative'}}>
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
    </LocaleProvider>
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
