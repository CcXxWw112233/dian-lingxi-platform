import React from 'react';
import { connect, } from 'dva';
import QueueAnim from 'rc-queue-anim'
import globalClassNmae from '../../globalset/css/globalClassName.less'
import HeaderNav from './components/HeaderNav'
import { Route, Router, Switch, Link } from 'dva/router'
import dynamic from "dva/dynamic";
import dva from "dva/index";
import indexStyles from './index.less'
import modelExtend from 'dva-model-extend'
import ClassBasicModel from '../../models/technological'
import { LocaleProvider, Icon, Layout, Menu, } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import ImChat from './ImChat.js'
import SiderLeft from './Sider/SiderLeft'
import SiderRight from './Sider/SiderRight'
import GlobalSearch from './GlobalSearch'

const { Header, Sider, Content } = Layout;

const getEffectOrReducerByName = name => `technological/${name}`
@connect(mapStateToProps)
export default class Technological extends React.Component {

  // componentDidMount() {
  //   //console.log('sssss_22', window.location)
  //   const hash = window.location.hash
  //   let page_load_type = '0'
  //   if(hash.indexOf('/technological/simplemode') != -1) {
  //     page_load_type = '1'
  //   } else {
  //     page_load_type = '2'
  //   }
  //   this.setState({
  //     page_load_type
  //   })
  // }

  render() {

    const { dispatch, model } = this.props;
    const { datas = {} } = model;
    const { page_load_type = 0 } = datas;

    const app = dva();
    //导航栏props-------------
    const HeaderNavProps = {
      model,
      dispatch,
      getMenuList(data) {
        // console.log('this is parents')
        dispatch({
          type: getEffectOrReducerByName('getMenuList'),
          data
        })
      },
      logout() {
        dispatch({
          type: getEffectOrReducerByName('logout'),
        })
      },
      routingJump(path) {
        dispatch({
          type: getEffectOrReducerByName('routingJump'),
          payload: {
            route: path,
          },
        })
      },
      updateDatas(payload) {
        dispatch({
          type: getEffectOrReducerByName('updateDatas'),
          payload: payload
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
      }, {
        path: '/technological/teamShow',
        component: () => import('../TeamShow/index'),
      }, {
        path: '/technological/gantt',
        component: () => import('./components/Gantt/index'),
      }, {
        path: '/technological/xczNews',
        component: () => import('./components/XczNews')
      }, {
        path: '/technological/simplemode',
        component: () => import('../SimpleMode/index'),
      },
    ]

    const defaultLayout = (
      <Layout >
        <Sider collapsedWidth={64} theme={'light'} collapsed={true} />
        <SiderLeft {...HeaderNavProps} />
        <Layout style={{ backgroundColor: 'rgba(245,245,245,1)' }}>
          <Content style={{
            margin: '0 16px',
          }}
          >
            <div className={globalClassNmae.page_style_3} id={'technologicalOut'} >
              {
                routes.map(({ path, ...dynamics }, key) => {
                  return (
                    <Route key={key}
                      //exact
                      path={path}
                      component={dynamic({
                        app,
                        ...dynamics,
                      })}
                    />
                  )
                })
              }
            </div>
          </Content>
        </Layout>
        <SiderRight />
        <GlobalSearch />
      </Layout>

    )

    const simpleLayout = (
      <Layout >
        <Layout style={{ backgroundColor: 'rgba(245,245,245,1)' }}>
          <Content style={{ height: '100vh' }} >
            <div className={globalClassNmae.page_style_3} id={'technologicalOut'} >
              {
                routes.map(({ path, ...dynamics }, key) => {
                  return (
                    <Route key={key}
                    //exact
                    path={path}
                    component={dynamic({
                      app,
                      ...dynamics,
                    })}
                  />
                  )
                })
              }
            </div>
          </Content>
        </Layout>
      </Layout>

    )

    let layout = <div></div>
    switch (page_load_type) {
      case 0:       
        layout = '<div>page_load_type:0</div>'
        break;
      case 1:      
        layout = simpleLayout
        break;
      case 2:      
        layout = defaultLayout
        break;
      default:
        break;
    }
    
    return (
      <LocaleProvider locale={zh_CN}>
        {/*minWidth:1440, */}
        {layout}
      </LocaleProvider>
    );
  }

};

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ modal, technological, loading }) {
  return { modal, model: technological, loading }
}
// export default connect(mapStateToProps)(Technological)
