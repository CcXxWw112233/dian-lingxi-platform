import React from 'react';
import globalClassNmae from '../../globalset/css/globalClassName.less'
import { Route, } from 'dva/router'
import dynamic from "dva/dynamic";
import dva from "dva/index";
import { LocaleProvider, Layout, } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import ImChat from './ImChat.js'
import SiderLeft from './Sider/SiderLeft'
import SiderRight from './Sider/SiderRight'
import GlobalSearch from './GlobalSearch'

const { Sider, Content } = Layout;

export default class Technological extends React.Component{

  render() {

    const app = dva();
  
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
      },
    ]

    const newLayout = (
      <Layout >
        <Sider collapsedWidth={64} theme={'light'} collapsed={true} />
        <SiderLeft />
        <Layout style={{ backgroundColor: 'rgba(245,245,245,1)'}}>
          <Content style={{
            margin: '0 16px',
          }}
          >
            <div className={globalClassNmae.page_style_3} id={'technologicalOut'} >
              {
              routes.map(({ path, ...dynamics }, key) =>{
                return (<Route key={key}
                               //exact
                               path={path}
                               component={dynamic({
                                 app,
                                 ...dynamics,
                               })}
                  />
                )})
              }
             </div>
          </Content>
        </Layout>
        <SiderRight />
        <GlobalSearch />
      </Layout>
    )

    return (
      <LocaleProvider locale={zh_CN}>
        {/*minWidth:1440, */}
        {newLayout}
      </LocaleProvider>
    );
  }

};
