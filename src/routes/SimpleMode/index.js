import React, { Component } from "react";
import dva, { connect } from "dva/index"
import indexStyles from './index.less'
import SimpleHeader from './Components/SimpleHeader/index'
import MyWorkbenchBoxs from './Components/MyWorkbenchBoxs/index'
import WallpaperSelect from './Components/WallpaperSelect/index'
import WorkbenchBoxSelect from './Components/WorkbenchBoxSelect/index'
import CreateNewBoard from './Components/CreateNewBoard/index'
import { Layout } from 'antd'
const { Header, Sider, Content } = Layout;

const getEffectOrReducerByName = name => `technological/${name}`

class SimpleMode extends Component {

  constructor(props){
    super(props);
  }
  
  render() {
    const { 
      model, dispatch ,
      simpleHeaderVisiable, 
      myWorkbenchBoxsVisiable, 
      wallpaperSelectVisiable, 
      workbenchBoxSelectVisiable, 
      createNewBoardVisiable, 
      setWapperCenter 
    } = this.props;
 
    return (
      <div className={`${indexStyles.wapper} ${setWapperCenter ? indexStyles.wapper_center : ''}`}>

        {simpleHeaderVisiable && <SimpleHeader />}

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
  wallpaperSelectModalVisiable
} }) => ({
  simpleHeaderVisiable,
  myWorkbenchBoxsVisiable,
  wallpaperSelectVisiable,
  workbenchBoxSelectVisiable,
  createNewBoardVisiable,
  setWapperCenter,
  wallpaperSelectModalVisiable,

}))(SimpleMode)