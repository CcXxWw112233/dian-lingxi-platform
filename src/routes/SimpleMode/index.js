import React, { Component, Suspense, lazy, PureComponent } from 'react'
import { connect } from 'dva/index'
import { Route, Switch } from 'dva/router'
import indexStyles from './index.less'
import { isColor } from '@/utils/util'
// import defaultWallpaperSrc from '@/assets/simplemode/acd42051256454f9b070300b8121eae2.png'
import {
  setBoardIdStorage,
  currentNounPlanFilterName
} from '../../utils/businessFunction'
import {
  LocalStorageKeys,
  OrgUserType,
  PROJECTS
} from '../../globalset/js/constant'
import SimpleHeader from './Components/SimpleHeader/index'
import { ENV_BROWSER_APP } from '../../globalset/clientCustorm'
import { ceil_width_week } from '../Technological/components/Gantt/constants'
import ExpireVip from '../../components/ExpireVip'
import { ExpireModel } from '../../models/technological/expireRenew'
import { ExpireType } from '../../components/ExpireVip/constans'
import moment from 'moment'

const defaultWallpaperSrc = ''
// import WorkbenchPage from './Components/WorkbenchPage'
// import Home from './Components/Home'

// const SimpleHeader = lazy(() => import('./Components/SimpleHeader/index'))
const WorkbenchPage = lazy(() => import('./Components/WorkbenchPage'))
const Home = lazy(() => import('./Components/Home'))

const getEffectOrReducerByName = name => `technological/${name}`
// 待重构，将路由和其它分离出来
class SimpleMode extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      bgStyle: {}
    }
    /** 还有几天到期的时候可以弹出提示 */
    this.WillExpireDate = 3
    /** 距离上次关闭时间大于此时间可以显示弹窗 */
    this.closeBetweenHours = 24
  }

  // 用户信息请求完成后才显示
  setShowByUserInfo = props => {
    const {
      userInfo: { id, user_set = {} },
      currentSelectedProjectOrgIdByBoardId
    } = props
    const { dispatch } = this.props
    const {
      current_org,
      current_board_id,
      current_board_name,
      current_board_belong_org,
      gantt_group_view_type
    } = user_set
    if (id) {
      if (current_board_id && current_board_id != '0') {
        //选择了一个项目
        dispatch({
          type: 'simplemode/updateDatas',
          payload: {
            simplemodeCurrentProject: {
              board_id: current_board_id,
              board_name: current_board_name,
              org_id: current_board_belong_org
            }
          }
        })
        dispatch({
          type: 'gantt/updateDatas',
          payload: {
            gantt_board_id: current_board_id,
            group_view_type: gantt_group_view_type == 'group' ? '1' : '4'
          }
        })
        dispatch({
          type: 'projectDetail/projectDetailInfo',
          payload: {
            id: current_board_id
          }
        })
        //orgid优先取用户更新的
        setBoardIdStorage(
          current_board_id,
          currentSelectedProjectOrgIdByBoardId || current_board_belong_org
        )
        setTimeout(() => {
          this.setState({
            show: true
          })
        })
      } else {
        dispatch({
          type: 'simplemode/updateDatas',
          payload: {
            simplemodeCurrentProject: {
              board_id: '0',
              board_name: `我参与的${currentNounPlanFilterName(
                PROJECTS,
                this.props.currentNounPlan
              )}`,
              org_id: ''
            }
          }
        })
        dispatch({
          type: 'gantt/updateDatas',
          payload: {
            gantt_board_id: '0',
            group_view_type: '1',
            gantt_view_mode: 'week', //全项目默认进周视图
            ceilWidth: ceil_width_week
          }
        })
        this.setState({
          show: true
        })
      }
    }
  }

  // 初始化极简模式数据
  initGetSimpleModeData = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'simplemode/getMyBoxs',
      payload: {}
    })
    dispatch({
      type: 'simplemode/getAllBoxs',
      payload: {}
    })
    dispatch({
      type: 'simplemode/initSimplemodeCommData',
      payload: {}
    })
  }

  componentDidMount() {
    // console.log('componentDidMount', 'SimpleMode')
    this.initGetSimpleModeData()
    window.addEventListener('scroll', this.handleScroll, false) //监听滚动
    window.addEventListener('resize', this.handleResize, false) //监听窗口大小改变
    this.setShowByUserInfo(this.props)
    this.lazyLoadBgImg(this.props)
    this.checkOrgExpire()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.expireVisible !== nextProps.expireVisible) return
    this.setShowByUserInfo(nextProps)
    this.lazyLoadBgImg(nextProps)
  }

  componentWillUnmount() {
    //一定要最后移除监听器，以防多个组件之间导致this的指向紊乱
    window.removeEventListener('scroll', this.handleScroll, false)
    window.removeEventListener('resize', this.handleResize, false)
  }

  handleScroll = e => {
    // console.log(
    //   '浏览器滚动事件',
    //   e.srcElement.scrollingElement.scrollTop,
    //   e.srcElement.scrollingElement.scrollHeight
    // )
    //e.srcElement.scrollingElement.scrollTop为距离滚动条顶部高度
    // e.srcElement.scrollingElement.scrollHeight为整个文档高度
  }

  handleResize = e => {
    const { dispatch, chatImVisiable } = this.props
    // console.log('浏览器窗口大小改变事件', e.target.innerWidth);
    const width = document.body.scrollWidth
    let rightWidth = 0
    if (chatImVisiable) {
      rightWidth = 400
    }
    let workbenchBoxContentWapperModalStyle = {
      width: width - rightWidth + 'px'
    }
    dispatch({
      type: 'simplemode/updateDatas',
      payload: {
        workbenchBoxContentWapperModalStyle: workbenchBoxContentWapperModalStyle
      }
    })
  }

  handleHiddenNav = () => {
    // const { dispatch } = this.props
    // dispatch({
    //   type: 'simplemode/updateDatas',
    //   payload: {
    //     leftMainNavVisible: false
    //   }
    // })
  }

  renderRoutes = () => {
    return (
      <Suspense fallback={<div></div>}>
        <Switch>
          <Route path="/technological/simplemode/home" component={Home} />
          <Route
            path="/technological/simplemode/workbench"
            component={WorkbenchPage}
          />
        </Switch>
      </Suspense>
    )
  }
  lazyLoadBgImg = (nextProps = {}) => {
    if (!ENV_BROWSER_APP) {
      this.setState({
        bgStyle: {}
      })
      return
    }
    const { currentUserWallpaperContent, userInfo = {} } = nextProps
    if (
      currentUserWallpaperContent == this.props.currentUserWallpaperContent &&
      !!currentUserWallpaperContent
    )
      return
    const _self = this
    const { show } = this.state
    const wallpaper = userInfo.id
      ? userInfo.wallpaper || defaultWallpaperSrc
      : ''
    const wallpaperContent = currentUserWallpaperContent
      ? currentUserWallpaperContent
      : wallpaper
    let bgStyle = {}
    if (isColor(wallpaperContent)) {
      bgStyle = { backgroundColor: wallpaperContent }
      this.setState({ bgStyle })
    } else {
      const temp = new Image()
      temp.src = wallpaperContent
      function loaded(e) {
        // console.log('ssssssssss_', e)
        _self.setState({
          bgStyle: { backgroundImage: `url(${wallpaperContent})` }
        })
      }
      temp.onload = loaded()
    }
  }

  /** 检测所选组织是否到期 */
  checkOrgExpire = () => {
    const { dispatch } = this.props
    /** 当前选择的组织 */
    const org = this.props.userInfo?.current_org
    if (org) {
      const { identity_type, payment_end_date, payment_is_expired } = org
      /** 不是管理员，不用弹窗 */
      if (identity_type !== OrgUserType.manager) return
      /** 上次关闭的时间戳 */
      let prevCloseDate = window.localStorage.getItem(
        LocalStorageKeys.willExpireCloseTime
      )
      prevCloseDate = prevCloseDate ? JSON.parse(prevCloseDate)[org.id] : ''
      /** 上次是否已经关闭过 */
      let hasCloseYestoday = !prevCloseDate
      if (prevCloseDate) {
        /** 距离上次关闭，差多久时间 */
        const hours = moment(+prevCloseDate).diff(moment(), 'hours')
        if (hours >= this.closeBetweenHours) {
          hasCloseYestoday = true
        } else hasCloseYestoday = false
      }
      if (payment_is_expired === 'true') {
        if (hasCloseYestoday)
          dispatch({
            type: [
              ExpireModel.namespace,
              ExpireModel.reducers.updateDatas
            ].join('/'),
            payload: {
              expireVisible: true,
              expireType: ExpireType.Expired,
              expiredTime: moment(+(payment_end_date + '000')).format(
                'YYYY/MM/DD'
              )
            }
          })
      } else {
        /** 距离到期还有几天 */
        const timeStep = Math.ceil(
          Math.abs(
            moment().diff(moment(+(payment_end_date + '000')), 'days', true)
          )
        )

        if (timeStep <= this.WillExpireDate && hasCloseYestoday) {
          dispatch({
            type: [
              ExpireModel.namespace,
              ExpireModel.reducers.updateDatas
            ].join('/'),
            payload: {
              expireVisible: true,
              expireType: ExpireType.WillExpire,
              expiredTime: moment(+(payment_end_date + '000')).format(
                'YYYY/MM/DD'
              )
            }
          })
        }
      }
    }
  }
  render() {
    const { setWapperCenter, expireVisible } = this.props
    const { show } = this.state
    return (
      <div
        className={`${indexStyles.wapper} ${indexStyles.wapperBg} ${
          setWapperCenter ? indexStyles.wapper_center : ''
        } ${!ENV_BROWSER_APP && indexStyles.index_bg}`}
        onClick={this.handleHiddenNav}
        style={this.state.bgStyle}
      >
        {/* {simpleHeaderVisiable && <SimpleHeader />}
        {show && this.renderRoutes()} */}
        <SimpleHeader />
        {show && this.renderRoutes()}
        {expireVisible && (
          <ExpireVip
            releaShow={ExpireType.WillExpire === this.props.expireType}
          />
        )}
      </div>
    )
  }
}

export default connect(
  ({
    simplemode: {
      simpleHeaderVisiable,
      setWapperCenter,
      chatImVisiable,
      currentUserWallpaperContent
    },
    technological: {
      datas: { userInfo, currentSelectedProjectOrgIdByBoardId }
    },
    organizationManager: {
      datas: { currentNounPlan }
    },
    [ExpireModel.namespace]: { expireVisible, expireType }
  }) => ({
    simpleHeaderVisiable,
    setWapperCenter,
    chatImVisiable,
    currentUserWallpaperContent,
    userInfo,
    currentNounPlan,
    currentSelectedProjectOrgIdByBoardId,
    expireVisible,
    expireType
  })
)(SimpleMode)
