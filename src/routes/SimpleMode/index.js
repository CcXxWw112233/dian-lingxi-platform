import React, { Component } from "react";
import dva, { connect } from "dva/index"
import { Route, Router, Switch, Link } from 'dva/router'
import dynamic from "dva/dynamic";
import indexStyles from './index.less'
import SimpleHeader from './Components/SimpleHeader/index'
import MyWorkbenchBoxs from './Components/MyWorkbenchBoxs/index'
import WallpaperSelect from './Components/WallpaperSelect/index'
import WorkbenchBoxSelect from './Components/WorkbenchBoxSelect/index'
import CreateNewBoard from './Components/CreateNewBoard/index'
import WorkbenchBoxContentModal from './Components/WorkbenchBoxContentModal/index'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { LocaleProvider, Layout } from 'antd'
const { Header, Sider, Content } = Layout;

const getEffectOrReducerByName = name => `technological/${name}`

class SimpleMode extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll.bind(this)) //监听滚动
    window.addEventListener('resize', this.handleResize.bind(this)) //监听窗口大小改变
  }

  componentWillUnmount() { //一定要最后移除监听器，以防多个组件之间导致this的指向紊乱
    window.removeEventListener('scroll', this.handleScroll.bind(this))
    window.removeEventListener('resize', this.handleResize.bind(this))
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
    console.log('浏览器窗口大小改变事件', e.target.innerWidth);
    const width = document.body.scrollWidth;
    let rightWidth = 0;
    if (chatImVisiable) {
      rightWidth = 372;
    }
    let workbenchBoxContentWapperModalStyle = { width: (width - rightWidth) + 'px' }
    dispatch({
      type: 'simplemode/updateDatas',
      payload: {
        workbenchBoxContentWapperModalStyle: workbenchBoxContentWapperModalStyle
      }
    });
  }

  render() {
    const app = dva();

    const routes = [
      {
        path: '/technological/simplemode/home',
        component: () => import('./Components/Home'),
      }, {
        path: '/technological/simplemode/communication',
        component: () => import('./Components/WorkbenchPage'),
      },
    ]

    const {
      simpleHeaderVisiable,
      setWapperCenter,
    } = this.props;

    return (
      <div className={`${indexStyles.wapper} ${setWapperCenter ? indexStyles.wapper_center : ''}`}>
        {simpleHeaderVisiable && <SimpleHeader />}
        <LocaleProvider locale={zh_CN}>
          <div style={{width: '100%', height: '100%'}}>
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
        </LocaleProvider>
      </div>

    )
  }
};

export default connect(({ simplemode: {
  simpleHeaderVisiable,
  setWapperCenter
} }) => ({
  simpleHeaderVisiable,
  setWapperCenter
}))(SimpleMode)