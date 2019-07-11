import React from "react";
import dva, { connect } from "dva/index"
import indexStyles from './index.less'
import SimpleHeader from './Components/SimpleHeader/index'
import MyWorkbenchBoxs from './Components/MyWorkbenchBoxs/index'
import WallpaperSelect from './Components/WallpaperSelect/index'
import WorkbenchBoxSelect from './Components/WorkbenchBoxSelect/index'
import CreateNewBoard from './Components/CreateNewBoard/index'
import SiderRight from '../../routes/Technological/Sider/SiderRight'
import SiderLeft from '@/routes/Technological/Sider/SiderLeft'
import { Layout } from 'antd'
const { Header, Sider, Content } = Layout;

const getEffectOrReducerByName = name => `technological/${name}`

const SimpleMode = (props) => {

  const { model, dispatch } = props
  //导航栏props-------------
  const HeaderNavProps = {
    model,
    dispatch,
    getMenuList(data) {
      // console.log('this is parents')
      dispatch({
        type: getEffectOrReducerByName('getMenuList'),
        data
      })
    },
    logout() {
      dispatch({
        type: getEffectOrReducerByName('logout'),
      })
    },
    routingJump(path) {
      dispatch({
        type: getEffectOrReducerByName('routingJump'),
        payload: {
          route: path,
        },
      })
    },
    updateDatas(payload) {
      dispatch({
        type: getEffectOrReducerByName('updateDatas'),
        payload: payload
      })
    },
    //组织
    getSearchOrganizationList(data) {
      dispatch({
        type: getEffectOrReducerByName('getSearchOrganizationList'),
        payload: data
      })
    },
    createOrganization(data) {
      dispatch({
        type: getEffectOrReducerByName('createOrganization'),
        payload: data
      })
    },
    updateOrganization(data) {
      dispatch({
        type: getEffectOrReducerByName('updateOrganization'),
      })
    },
    applyJoinOrganization(data) {
      dispatch({
        type: getEffectOrReducerByName('applyJoinOrganization'),
        payload: data
      })
    },
    inviteJoinOrganization(data) {
      dispatch({
        type: getEffectOrReducerByName('inviteJoinOrganization'),
        payload: data
      })
    },
    uploadOrganizationLogo(data) {
      dispatch({
        type: getEffectOrReducerByName('uploadOrganizationLogo'),
        payload: data
      })
    },
    changeCurrentOrg(data) {
      dispatch({
        type: getEffectOrReducerByName('changeCurrentOrg'),
        payload: data
      })
    }
  }
  console.log("YING", props);

  const { simpleHeaderVisiable, myWorkbenchBoxsVisiable, wallpaperSelectVisiable, workbenchBoxSelectVisiable, createNewBoardVisiable, setWapperCenter } = props;
  console.log("createNewBoardVisiable", createNewBoardVisiable);
  return (
    <div className={`${indexStyles.wapper} ${setWapperCenter ? indexStyles.wapper_center : ''}`}>

      {simpleHeaderVisiable && <SimpleHeader />}

      {myWorkbenchBoxsVisiable && <MyWorkbenchBoxs />}

      {wallpaperSelectVisiable && <WallpaperSelect />}

      {workbenchBoxSelectVisiable && <WorkbenchBoxSelect />}

      {createNewBoardVisiable && <CreateNewBoard />}

    </div>
  )

};

export default connect(({ simplemode: {
  simpleHeaderVisiable,
  myWorkbenchBoxsVisiable,
  wallpaperSelectVisiable,
  workbenchBoxSelectVisiable,
  createNewBoardVisiable,
  setWapperCenter,
  wallpaperSelectModalVisiable
}}) => ({
  simpleHeaderVisiable,
  myWorkbenchBoxsVisiable,
  wallpaperSelectVisiable,
  workbenchBoxSelectVisiable,
  createNewBoardVisiable,
  setWapperCenter,
  wallpaperSelectModalVisiable,

}))(SimpleMode)