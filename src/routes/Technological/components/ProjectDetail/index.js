import React from 'react';
import { connect } from "dva/index";
import Header from './Header'
import CreateTask from './TaskItemComponent/CreateTask'
import FileModule from './FileModule'
import ProcessIndex from './Process'
import indexStyles from './index.less'
import { checkIsHasPermissionInBoard } from "../../../../utils/businessFunction";
import {
  PROJECT_FILES_FILE_INTERVIEW, PROJECT_FLOW_FLOW_ACCESS,
  PROJECT_TEAM_CARD_INTERVIEW
} from "../../../../globalset/js/constant";

// const getEffectOrReducerByName = name => `projectDetail/${name}`
// const getEffectOrReducerByNameTask = name => `projectDetailTask/${name}`
// const getEffectOrReducerByNameFile = name => `projectDetailFile/${name}`
// const getEffectOrReducerByNameProcess = name => `projectDetailProcess/${name}`
// const updateDatas = (payload) => {
//   dispatch({
//     type: getEffectOrReducerByName('updateDatas'),
//     payload: payload
//   })
// }
// const updateDatasTask = (payload) => {
//   dispatch({
//     type: getEffectOrReducerByNameTask('updateDatas'),
//     payload: payload
//   })
// }
// const updateDatasFile = (payload) => {
//   dispatch({
//     type: getEffectOrReducerByNameFile('updateDatas'),
//     payload: payload
//   })
// }
// const updateDatasProcess = (payload) => {
//   dispatch({
//     type: getEffectOrReducerByNameProcess('updateDatas'),
//     payload: payload
//   })
// }
// const getProjectDetailInfo = (payload) => {
//   dispatch({
//     type: 'workbenchTaskDetail/projectDetailInfo',
//     payload: payload
//   })
// }

const ProjectDetail = (props) => {
  const { appsSelectKey } = props
  const filterAppsModule = (appsSelectKey) => {
    let appFace = (<div></div>)
    switch (appsSelectKey) {
      case '2':
        appFace = checkIsHasPermissionInBoard(PROJECT_FLOW_FLOW_ACCESS) &&
          (<ProcessIndex />)
        break
      case '3':
        appFace = checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_INTERVIEW) &&
          (<CreateTask />)
        break
      case '4':
        appFace = checkIsHasPermissionInBoard(PROJECT_FILES_FILE_INTERVIEW) &&
          (<FileModule />)
        break
      default:
        break
    }
    return appFace
  }
  return (
    <div style={{ height: 'auto', position: 'relative', width: '100%', minHeight: '100vh', margin: '0 auto' }}>
      <div className={indexStyles.headerMaskDown}></div>
      <Header />
      <div style={{ padding: '0 20px' }}>
        {/* {filterAppsModule(appsSelectKey)} */}
      </div>
    </div>
  )
};

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ projectDetail: {
  datas: {
    appsSelectKey
  }
} }) {
  return { appsSelectKey }
}
export default connect(mapStateToProps)(ProjectDetail)


