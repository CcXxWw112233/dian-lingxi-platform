import React, { Component } from "react";
import { connect } from "dva/index"
import { Route, Switch,  } from 'dva/router'
import indexStyles from './index.less'
import SimpleHeader from './Components/SimpleHeader/index'
import WorkbenchPage from './Components/WorkbenchPage'
import Home from './Components/Home'

const getEffectOrReducerByName = name => `technological/${name}`

class SimpleMode extends Component {

  constructor(props) {
    super(props);
    this.state = {}
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

  handleHiddenNav = () => {
    const { dispatch, leftMainNavVisible } = this.props;
    dispatch({
      type: 'simplemode/updateDatas',
      payload: {
        leftMainNavVisible: false
      }
    });
  }

  setSSS = () => {
    const { SSS } = this.state
    this.setState({
      SSS: !SSS
    })
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
    } = this.props;

    return (
      <div className={`${indexStyles.wapper} ${setWapperCenter ? indexStyles.wapper_center : ''}`} onClick={this.handleHiddenNav}>
        {simpleHeaderVisiable && <SimpleHeader />}
        {this.renderRoutes()}
      </div>

    )
  }
};

export default connect(({ simplemode: {
  simpleHeaderVisiable,
  setWapperCenter,
  chatImVisiable,
  leftMainNavVisible
} }) => ({
  simpleHeaderVisiable,
  setWapperCenter,
  chatImVisiable,
  leftMainNavVisible
}))(SimpleMode)