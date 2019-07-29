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


  render() {
  
    const {
      myWorkbenchBoxsVisiable,
      wallpaperSelectVisiable,
      workbenchBoxSelectVisiable,
      createNewBoardVisiable,
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