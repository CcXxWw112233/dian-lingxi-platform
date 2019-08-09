import React, { Component } from "react";
import { connect } from "dva/index"
import indexStyles from './index.less'
import SimpleHeader from '../SimpleHeader/index'
import MyWorkbenchBoxs from '../MyWorkbenchBoxs/index'
import WallpaperSelect from '../WallpaperSelect/index'
import WorkbenchBoxSelect from '../WorkbenchBoxSelect/index'


const getEffectOrReducerByName = name => `technological/${name}`

class Home extends Component {

  constructor(props) {
    super(props);
    console.log("home组件初始化");
    this.state = {
      simpleHeaderVisiable: true,
      myWorkbenchBoxsVisiable: true,
      wallpaperSelectVisiable: true,
      workbenchBoxSelectVisiable: false,
      createNewBoardVisiable: false,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'simplemode/getMyBoxs',
      payload: {}
    });
    dispatch({
      type: 'simplemode/getAllBoxs',
      payload: {}
    });
    dispatch({
      type: 'simplemode/updateDatas',
      payload: {
        chatImVisiable: false
      }
    });

  }

  setHomeVisible = (data) => {
    this.setState(data)
  }


  render() {

    const {
      myWorkbenchBoxsVisiable,
      wallpaperSelectVisiable,
      workbenchBoxSelectVisiable,
    } = this.state;

    return (
      <div>
        {myWorkbenchBoxsVisiable && <MyWorkbenchBoxs {...this.state} setHomeVisible={this.setHomeVisible} />}

        {wallpaperSelectVisiable && <WallpaperSelect {...this.state} setHomeVisible={this.setHomeVisible} />}

        {workbenchBoxSelectVisiable && <WorkbenchBoxSelect {...this.state} setHomeVisible={this.setHomeVisible} />}

      </div>
    )
  }
};

export default connect(({ }) => ({

}))(Home)