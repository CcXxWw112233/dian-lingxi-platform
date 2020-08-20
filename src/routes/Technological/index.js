import React, { Suspense, lazy } from 'react';
import { connect, } from 'dva';
import QueueAnim from 'rc-queue-anim'
import globalClassNmae from '../../globalset/css/globalClassName.less'
import { Route, Router, Switch, Link } from 'dva/router'
import dynamic from "dva/dynamic";
import dva from "dva/index";
import { LocaleProvider, Icon, Layout, Menu, } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import SiderLeft from './Sider/SiderLeft'
import SiderRight from './Sider/SiderRight'
import GlobalSearch from './GlobalSearch'
import QueryString from 'querystring'
import { initWsFun } from '../../components/WsNewsDynamic'
import Cookies from 'js-cookie'
import { isPaymentOrgUser } from "@/utils/businessFunction"
import { routerRedux } from "dva/router";
import { CUSTOMIZATION_ORGNIZATIONS } from '../../globalset/js/constant';

// import UpdateLog from './components/Workbench/UpdateLog/index'
import SimpleMode from '../SimpleMode/index'
// import UploadNotification from '@/components/UploadNotification'

const UpdateLog = lazy(() => import('./components/Workbench/UpdateLog/index'));
// const SimpleMode = lazy(() => import('../SimpleMode/index'));
const UploadNotification = lazy(() => import('@/components/UploadNotification'));

const { Sider, Content } = Layout;
let net = null
@connect(mapStateToProps)
export default class Technological extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.historyListenSet()
    this.connectWsToModel()
  }
  componentWillUnmount() {
    // console.log('netnet-ummount', net)
    if (net && typeof net == 'object') {
      net.send('close')
      net = null
    }
    const { dispatch } = this.props
    dispatch({ //清除用户数据
      type: 'technological/updateDatas',
      payload: {
        userInfo: {}
      }
    })
  }

  // customOrgRouting = (nextProps) => {
  //   const { currentSelectOrganize: { id: last_id }, dispatch } = this.props
  //   const { currentSelectOrganize: { id: next_id } } = nextProps
  //   const { location = {} } = nextProps
  //   // console.log('sssssssssss', this.props)
  //   const { pathname } = location
  //   if (last_id != next_id) { //组织切换的时候
  //     if (!CUSTOMIZATION_ORGNIZATIONS.includes(next_id)) {
  //       if (pathname.indexOf('/technological/simplemode') == -1) {
  //         dispatch({
  //           type: 'technological/routingReplace',
  //           payload: {
  //             route: '/technological/simplemode/home'
  //           }
  //         })
  //       }
  //     }
  //   }

  //   if (pathname.indexOf('/technological/simplemode') == -1) { //在普通模式下，校验特定组织
  //     if (!CUSTOMIZATION_ORGNIZATIONS.includes(next_id)) {
  //       dispatch({
  //         type: 'technological/routingReplace',
  //         payload: {
  //           route: '/technological/simplemode/home'
  //         }
  //       })
  //     }
  //   }

  // }

  connectWsToModel = () => {
    const { dispatch } = this.props
    if (net && typeof net == 'object') {
      net.send('close')
      net = null
    }
    // console.log('netnet-create_before', net)
    setTimeout(function () {
      const calback = function (event) {
        dispatch({
          type: 'cooperationPush/connectWsToModel',
          payload: {
            event
          }
        })
      }
      net = initWsFun(calback)
      // console.log('netnet-create', net)
    }, 1000)
  }

  // componentWillReceiveProps(nextProps) {
  // const { currentUserOrganizes, dispatch } = nextProps;
  // const { page_load_type: old_page_load_type } = this.props;
  // if (old_page_load_type != nextProps.page_load_type) {

  // }
  // this.customOrgRouting(nextProps)

  // }
  // shouldComponentUpdate(newProps, newState) {
  //   const { currentUserOrganizes, dispatch } = newProps;
  //   const { page_load_type: old_page_load_type } = this.props;
  //   //只有page_load_type变化了才渲染
  //   if (old_page_load_type == newProps.page_load_type) {
  //     return false;
  //   } else {
  //     if (currentUserOrganizes && currentUserOrganizes.length > 0) {
  //       let isPayment = isPaymentOrgUser();
  //       if (!isPayment && newProps.page_load_type == 2) {

  //         dispatch({
  //           type: 'technological/setShowSimpleModel',
  //           payload: {
  //             is_simple_model: 1
  //           }
  //         })
  //         return false;
  //       }
  //     }
  //     return true;
  //   }
  // }

  getRouterParams = () => {
    // 解析参数
    const hash = window.location.hash
    let path_name_arr
    let path_name = '' //路由
    let params_str = ''
    let params = {} //路由携带的参数
    if (hash.indexOf('?') != -1) {
      path_name_arr = hash.match(/#([\S\/]*)\?/) //==>technological/projectDetail
      params_str = hash.replace(/^#\/[\w\/]+\?/, '')
      params = QueryString.parse(params_str) // 
    } else {
      path_name_arr = hash.match(/#([\S\/]*)/) //==>technological/projectDetail
    }
    path_name = path_name_arr[1]

    return {
      path_name,
      params
    }

  }

  // 获取technological层面的数据
  historyListenSet = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'technological/initGetTechnologicalDatas',
      payload: {}
    })
  }

  // renderRouters = () => {
  //   const { page_load_type } = this.props;
  //   const app = dva();
  //   const routes = [
  //     {
  //       path: '/technological/accoutSet',
  //       component: () => import('./components/AccountSet'),
  //     }, {
  //       path: '/technological/project',
  //       component: () => import('./components/Project'),
  //     }, {
  //       path: '/technological/projectDetail/:id?',
  //       component: () => import('./components/ProjectDetail'),
  //     }, {
  //       path: '/technological/newsDynamic',
  //       component: () => import('./components/NewsDynamic'),
  //     }, {
  //       path: '/technological/workbench',
  //       component: () => import('./components/Workbench'),
  //     }, {
  //       path: '/technological/organizationMember',
  //       component: () => import('./components/OrganizationMember'),
  //     }, {
  //       path: '/technological/teamShow',
  //       component: () => import('../TeamShow/index'),
  //     }, {
  //       path: '/technological/gantt',
  //       component: () => import('./components/Gantt/index'),
  //     }, {
  //       path: '/technological/xczNews',
  //       component: () => import('./components/XczNews')
  //     }, {
  //       path: '/technological/simplemode',
  //       component: () => import('../SimpleMode/index'),
  //     }, {
  //       path: '/technological/investmentMap',
  //       component: () => import('./components/InvestmentMap'),
  //     },
  //   ]

  //   const defaultLayout = (
  //     <Layout id='technologicalLayoutWrapper' >
  //       <Sider collapsedWidth={64} theme={'light'} collapsed={true} />
  //       <SiderLeft />
  //       <Layout style={{ backgroundColor: 'rgba(245,245,245,1)' }}>
  //         <Content style={{
  //           margin: '0 16px',
  //         }}
  //         >
  //           <div className={`${globalClassNmae.page_style_3} ${globalClassNmae.global_vertical_scrollbar}`} id={'technologicalOut'} >
  //             {
  //               routes.map(({ path, ...dynamics }, key) => {
  //                 return (
  //                   <Route key={key}
  //                     //exact
  //                     path={path}
  //                     component={dynamic({
  //                       app,
  //                       ...dynamics,
  //                     })}
  //                   />
  //                 )
  //               })
  //             }
  //           </div>
  //         </Content>
  //       </Layout>
  //       <SiderRight />
  //       <GlobalSearch />
  //     </Layout>
  //   )

  //   const simpleLayout = (
  //     <Layout id='technologicalLayoutWrapper' >
  //       <Layout style={{ backgroundColor: 'rgba(245,245,245,1)' }}>
  //         <Content style={{ height: '100vh' }} >
  //           <div className={`${globalClassNmae.page_style_3} ${globalClassNmae.global_vertical_scrollbar}`} id={'technologicalOut'} >
  //             {
  //               routes.map(({ path, ...dynamics }, key) => {
  //                 return (
  //                   <Route key={key}
  //                     //exact
  //                     path={path}
  //                     component={dynamic({
  //                       app,
  //                       ...dynamics,
  //                     })}
  //                   />
  //                 )
  //               })
  //             }
  //           </div>
  //         </Content>
  //       </Layout>
  //     </Layout>

  //   )

  //   let layout = <div></div>
  //   switch (page_load_type) {
  //     case 0:
  //       layout = '<div></div>'
  //       break;
  //     case 1:
  //       layout = simpleLayout
  //       break;
  //     case 2:
  //       layout = defaultLayout
  //       break;
  //     default:
  //       break;
  //   }
  //   return layout
  // }
  render() {
    return (
      <LocaleProvider locale={zh_CN}>
        {/*minWidth:1440, */}
        <>
          {/* {simpleLayout} */}
          <Layout id='technologicalLayoutWrapper' >
            <Layout style={{ backgroundColor: 'rgba(245,245,245,1)' }}>
              <Content style={{ height: '100vh' }} >
                <div className={`${globalClassNmae.page_style_3} ${globalClassNmae.global_vertical_scrollbar}`} id={'technologicalOut'} >
                  <Route path="/technological/simplemode" component={SimpleMode} />
                </div>
              </Content>
            </Layout>
          </Layout>
          <Suspense fallback={<div></div>}>
            <UpdateLog />
            <UploadNotification />
          </Suspense>
        </>
      </LocaleProvider>
    );
  }

};

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ technological: {
  datas: {
    // page_load_type,
    // currentSelectOrganize = {}
    // currentUserOrganizes = [],
  }
}
}) {
  return {
    // page_load_type,
    // currentSelectOrganize
    // currentUserOrganizes,

  }
}

