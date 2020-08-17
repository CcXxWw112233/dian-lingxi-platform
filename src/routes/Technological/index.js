import React from 'react';
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
import UploadNotification from '@/components/UploadNotification'
import { CUSTOMIZATION_ORGNIZATIONS } from '../../globalset/js/constant';
import UpdateLog from './components/Workbench/UpdateLog/index'
import logoImg from '../../assets/library/lingxi_logo.png'

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
    this.checkListeninger()
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

  customOrgRouting = (nextProps) => {
    const { currentSelectOrganize: { id: last_id }, dispatch } = this.props
    const { currentSelectOrganize: { id: next_id } } = nextProps
    const { location = {} } = nextProps
    // console.log('sssssssssss', this.props)
    const { pathname } = location
    if (last_id != next_id) { //组织切换的时候
      if (!CUSTOMIZATION_ORGNIZATIONS.includes(next_id)) {
        if (pathname.indexOf('/technological/simplemode') == -1) {
          dispatch({
            type: 'technological/routingReplace',
            payload: {
              route: '/technological/simplemode/home'
            }
          })
        }
      }
    }

    if (pathname.indexOf('/technological/simplemode') == -1) { //在普通模式下，校验特定组织
      if (!CUSTOMIZATION_ORGNIZATIONS.includes(next_id)) {
        dispatch({
          type: 'technological/routingReplace',
          payload: {
            route: '/technological/simplemode/home'
          }
        })
      }
    }

  }

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

  componentWillReceiveProps(nextProps) {
    const { currentUserOrganizes, dispatch } = nextProps;
    const { page_load_type: old_page_load_type } = this.props;
    if (old_page_load_type != nextProps.page_load_type) {

    }
    this.customOrgRouting(nextProps)

  }
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

  // 获取元素并取消提示内容
  handleCancelWarning = () => {
    let warningElement = document.getElementById('notYet_reminder_container')
    let pageElement = document.getElementById('technologicalOut')
    warningElement.style.display = 'none'
    pageElement.style.filter = 'none'
  }

  // 检测监听小屏访问提示
  checkListeninger = () => {
    let warining = localStorage.getItem('lingxi.skip_mobile_warning')
    if (warining) {
      this.handleCancelWarning()
    }
  }

  // 点击提示 表示是否继续操作
  handleContinueAnyway = (e) => {
    e && e.stopPropagation()
    localStorage.setItem('lingxi.skip_mobile_warning', '1')
    this.handleCancelWarning()
  }

  // 渲染暂未支持小屏设备
  renderNotYetSupportEquipment = () => {
    return (
      <div id={'notYet_reminder_container'} className={globalClassNmae.notYet_reminder_wrapper}>
        <div className={globalClassNmae.notYet_content}>
          <img style={{ width: '64px', height: '64px' }} src={logoImg} />
          <p style={{fontSize: '24px', color: 'rgba(0,0,0,.85)'}}>暂未支持小屏设备访问</p>
          <p>
            <span>
              我们正在努力带来更好的PC端使用体验，也准备了微信小程序以及APP，请使用电脑浏览器访问或关注我们的微信小程序（聆悉协作）获得更好的产品体验，谢谢。
            </span>
          </p>
          <p style={{color: '#2B8AEB'}}>
            lingxi.di-an.com<span onClick={this.handleContinueAnyway} style={{marginLeft: '12px', cursor: 'pointer'}}> 继续访问 &gt;</span>
          </p>
        </div>
      </div>
    )
  }

  render() {
    const { page_load_type } = this.props;
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
      }, {
        path: '/technological/simplemode',
        component: () => import('../SimpleMode/index'),
      }, {
        path: '/technological/investmentMap',
        component: () => import('./components/InvestmentMap'),
      },
    ]

    const defaultLayout = (
      <Layout id='technologicalLayoutWrapper' >
        <Sider collapsedWidth={64} theme={'light'} collapsed={true} />
        <SiderLeft />
        <Layout style={{ backgroundColor: 'rgba(245,245,245,1)' }}>
          <Content style={{
            margin: '0 16px',
          }}
          >
            <div className={`${globalClassNmae.page_style_3} ${globalClassNmae.global_vertical_scrollbar}`} id={'technologicalOut'} >
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
      <Layout id='technologicalLayoutWrapper' >
        <Layout style={{ backgroundColor: 'rgba(245,245,245,1)' }}>
          <Content style={{ height: '100vh' }} >
            <div className={`${globalClassNmae.page_style_3} ${globalClassNmae.global_vertical_scrollbar}`} id={'technologicalOut'} >
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
        layout = '<div></div>'
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
        <>
          {layout}
          <UpdateLog />
          <UploadNotification />
          {this.renderNotYetSupportEquipment()}
        </>
      </LocaleProvider>
    );
  }

};

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ technological: {
  datas: {
    page_load_type,
    currentSelectOrganize = {}
    // currentUserOrganizes = [],
  }
}
}) {
  return {
    page_load_type,
    currentSelectOrganize
    // currentUserOrganizes,

  }
}

