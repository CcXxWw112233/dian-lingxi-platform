import React, { Component } from "react";
import { connect } from "dva/index"
import indexStyles from './index.less'
import SimpleHeader from '../SimpleHeader/index'
import MyWorkbenchBoxs from '../MyWorkbenchBoxs/index'
import WallpaperSelect from '../WallpaperSelect/index'
import WorkbenchBoxSelect from '../WorkbenchBoxSelect/index'
import CreateNewBoard from '../CreateNewBoard/index'


const getEffectOrReducerByName = name => `technological/${name}`

class Home extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount(){
    const {dispatch} = this.props;
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
  

    const {
      model, dispatch,
      simpleHeaderVisiable,
      myWorkbenchBoxsVisiable,
      wallpaperSelectVisiable,
      workbenchBoxSelectVisiable,
      createNewBoardVisiable,
      setWapperCenter,
      chatImVisiable
    } = this.props;

    return (
      <div>
        {myWorkbenchBoxsVisiable && <MyWorkbenchBoxs />}

        {wallpaperSelectVisiable && <WallpaperSelect />}

        {workbenchBoxSelectVisiable && <WorkbenchBoxSelect />}

        {createNewBoardVisiable && <CreateNewBoard />} 

      </div>
    )
  }
};

export default connect(({ simplemode: {
  simpleHeaderVisiable,
  myWorkbenchBoxsVisiable,
  wallpaperSelectVisiable,
  workbenchBoxSelectVisiable,
  createNewBoardVisiable,
  setWapperCenter,
  wallpaperSelectModalVisiable,
  workbenchBoxContentWapperModalStyle,
  chatImVisiable
} }) => ({
  simpleHeaderVisiable,
  myWorkbenchBoxsVisiable,
  wallpaperSelectVisiable,
  workbenchBoxSelectVisiable,
  createNewBoardVisiable,
  setWapperCenter,
  wallpaperSelectModalVisiable,
  workbenchBoxContentWapperModalStyle,
  chatImVisiable

}))(Home)