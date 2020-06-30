import React, { Component } from "react";
import { connect } from "dva/index"
import { Route, Switch, } from 'dva/router'
import indexStyles from './index.less'
import SimpleHeader from './Components/SimpleHeader/index'
import WorkbenchPage from './Components/WorkbenchPage'
import Home from './Components/Home'
import { isColor } from '@/utils/util'
import defaultWallpaperSrc from '@/assets/simplemode/acd42051256454f9b070300b8121eae2.png'
import { setBoardIdStorage } from "../../utils/businessFunction";

const getEffectOrReducerByName = name => `technological/${name}`
// 待重构，将路由和其它分离出来
class SimpleMode extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false
    }
  }

  // 用户信息请求完成后才显示
  setShowByUserInfo = (props) => {
    const { userInfo: { id, user_set = {} } } = props
    const { dispatch } = this.props
    const { current_org, current_board_id, current_board_name, current_board_belong_org } = user_set
    if (id) {
      if (current_board_id && current_board_id != '0') { //选择了一个项目
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
            // group_view_type: '4'
          }
        })
        dispatch({
          type: 'projectDetail/projectDetailInfo',
          payload: {
            id: current_board_id
          }
        })
        setBoardIdStorage(current_board_id, current_board_belong_org)
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
              board_name: '我参与的项目',
              org_id: ''
            }
          }
        })
        dispatch({
          type: 'gantt/updateDatas',
          payload: {
            gantt_board_id: '0',
            group_view_type: '1'
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
    });
    dispatch({
      type: 'simplemode/getAllBoxs',
      payload: {}
    });
  }

  componentDidMount() {
    this.initGetSimpleModeData()
    window.addEventListener('scroll', this.handleScroll, false) //监听滚动
    window.addEventListener('resize', this.handleResize, false) //监听窗口大小改变
    this.setShowByUserInfo(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setShowByUserInfo(nextProps)
  }

  componentWillUnmount() { //一定要最后移除监听器，以防多个组件之间导致this的指向紊乱
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
    const { dispatch, chatImVisiable } = this.props;
    // console.log('浏览器窗口大小改变事件', e.target.innerWidth);
    const width = document.body.scrollWidth;
    let rightWidth = 0;
    if (chatImVisiable) {
      rightWidth = 400;
    }
    let workbenchBoxContentWapperModalStyle = { width: (width - rightWidth) + 'px' }
    dispatch({
      type: 'simplemode/updateDatas',
      payload: {
        workbenchBoxContentWapperModalStyle: workbenchBoxContentWapperModalStyle
      }
    });
  }

  handleHiddenNav = () => {
    const { dispatch, leftMainNavVisible } = this.props;
    dispatch({
      type: 'simplemode/updateDatas',
      payload: {
        leftMainNavVisible: false
      }
    });
  }

  renderRoutes = () => {
    return (
      <Switch>
        <Route path="/technological/simplemode/home" component={Home} />
        <Route path="/technological/simplemode/workbench" component={WorkbenchPage} />
      </Switch>
    )
  }
  render() {
    const {
      simpleHeaderVisiable,
      setWapperCenter,
      currentUserWallpaperContent,
      userInfo = {},
    } = this.props;
    const { show } = this.state
    const { wallpaper = defaultWallpaperSrc } = userInfo;
    const wallpaperContent = currentUserWallpaperContent ? currentUserWallpaperContent : wallpaper;
    let bgStyle = {}
    if (isColor(wallpaperContent)) {
      bgStyle = { backgroundColor: wallpaperContent };
    } else {
      bgStyle = { backgroundImage: `url(${wallpaperContent})` };
    }
    return (
      <div className={`${indexStyles.wapper} ${indexStyles.wapperBg} ${setWapperCenter ? indexStyles.wapper_center : ''}`} onClick={this.handleHiddenNav} style={bgStyle}>
        {simpleHeaderVisiable && <SimpleHeader />}
        {show && this.renderRoutes()}
      </div>

    )
  }
};

export default connect(({ simplemode: {
  simpleHeaderVisiable,
  setWapperCenter,
  chatImVisiable,
  leftMainNavVisible,
  currentUserWallpaperContent,
}, technological: {
  datas: { userInfo }
} }) => ({
  simpleHeaderVisiable,
  setWapperCenter,
  chatImVisiable,
  leftMainNavVisible,
  currentUserWallpaperContent,
  userInfo
}))(SimpleMode)
