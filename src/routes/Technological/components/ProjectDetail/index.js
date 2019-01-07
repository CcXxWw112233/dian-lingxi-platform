import React from 'react';
import {connect} from "dva/index";
import Header from './Header'
import DetailInfo from './DetailInfo/DetailInfo'
import CreateTask from './TaskItemComponent/CreateTask'
import FileModule  from './FileModule'
import ProcessIndex from './Process'
import indexStyles from './index.less'

import { Drawer } from 'antd'
import DrawDetailInfo from './DetailInfo/DrawDetailInfo'

const getEffectOrReducerByName = name => `projectDetail/${name}`

const ProjectDetail = (props) => {
  const { dispatch, model, modal } = props
  const { datas:{ projectInfoDisplay, taskGroupList, appsSelectKey } } = model
  const HeaderListProps = {
    modal,
    model,
    getTaskGroupList(data){
      dispatch({
        type: getEffectOrReducerByName('getTaskGroupList'),
        payload: data
      })
    },
    collectionProject(id) {
      dispatch({
        type: getEffectOrReducerByName('collectionProject'),
        payload: {
          id
        }
      })
    },
    cancelCollection(id) {
      dispatch({
        type: getEffectOrReducerByName('cancelCollection'),
        payload: {
          id
        }
      })
    },
    quitProject(data){
      dispatch({
        type: getEffectOrReducerByName('quitProject'),
        payload: data
      })
    },
    deleteProject(id) {
      dispatch({
        type: getEffectOrReducerByName('deleteProject'),
        payload: {
          id,
          isJump: true
        }
      })
    },
    archivedProject(data) {
      dispatch({
        type: getEffectOrReducerByName('archivedProject'),
        payload: data
      })
    },
    addMenbersInProject(data) {
      dispatch({
        type: getEffectOrReducerByName('addMenbersInProject'),
        payload: data
      })
    },
    appsSelect(data) {
      dispatch({
        type: getEffectOrReducerByName('appsSelect'),
        payload: data
      })
    },
    getProcessInfo(data){
      dispatch({
        type: getEffectOrReducerByName('getProcessInfo'),
        payload: data
      })
    },
    setMemberRoleInProject(data){
      dispatch({
        type: getEffectOrReducerByName('setMemberRoleInProject'),
        payload: data
      })
    },
    getProjectRoles(data){
      dispatch({
        type: getEffectOrReducerByName('getProjectRoles'),
        payload: data
      })
    },
    updateProject(data) {
      dispatch({
        type: getEffectOrReducerByName('updateProject'),
        payload: data
      })
    },
  }
  const DetailInfoProps = {
    modal,
    model,
    showModal() {
      dispatch({ type: 'modal/showModal' })
    },
    hideModal() {
      dispatch({ type: 'modal/hideModal' })
    },
    removeMenbers(data) {
      dispatch({
        type: getEffectOrReducerByName('removeMenbers'),
        payload: data
      })
    },
    updateProject(data) {
      dispatch({
        type: getEffectOrReducerByName('updateProject'),
        payload: data
      })
    },
    addMenbersInProject(data) {
      dispatch({
        type: getEffectOrReducerByName('addMenbersInProject'),
        payload: data
      })
      this.hideModal()
    },
    setMemberRoleInProject(data){
      dispatch({
        type: getEffectOrReducerByName('setMemberRoleInProject'),
        payload: data
      })
    },
    getProjectRoles(data){
      dispatch({
        type: getEffectOrReducerByName('getProjectRoles'),
        payload: data
      })
    }
  }
  const CreateTaskProps = {
    modal,
    model,
    deleteTaskFile(data) {
      dispatch({
        type: getEffectOrReducerByName('deleteTaskFile'),
        payload: data,
      })
    },
    addTaskGroup(data) {
      dispatch({
        type: getEffectOrReducerByName('addTaskGroup'),
        payload: data,
      })
    },
    deleteTaskGroup(data) {
      dispatch({
        type: getEffectOrReducerByName('deleteTaskGroup'),
        payload: data,
      })
    },
    updateTaskGroup(data) {
      dispatch({
        type: getEffectOrReducerByName('updateTaskGroup'),
        payload: data,
      })
    },
    getTaskGroupList(data){
      dispatch({
        type: getEffectOrReducerByName('getTaskGroupList'),
        payload: data
      })
    },
    addTask(data){
      dispatch({
        type: getEffectOrReducerByName('addTask'),
        payload: data
      })
    },
    updateTask(data){
      dispatch({
        type: getEffectOrReducerByName('updateTask'),
        payload: data
      })
    },
    deleteTask(id){
      dispatch({
        type: getEffectOrReducerByName('deleteTask'),
        payload: {
          id
        }
      })
    },
    updateChirldTask(data){
      dispatch({
        type: getEffectOrReducerByName('updateChirldTask'),
        payload: data
      })
    },
    deleteChirldTask(data){
      dispatch({
        type: getEffectOrReducerByName('deleteChirldTask'),
        payload: data
      })
    },

    archivedTask(data){
      dispatch({
        type: getEffectOrReducerByName('archivedTask'),
        payload: data
      })
    },
    changeTaskType(data){
      dispatch({
        type: getEffectOrReducerByName('changeTaskType'),
        payload: data
      })
    },
    addChirldTask(data){
      dispatch({
        type: getEffectOrReducerByName('addChirldTask'),
        payload: data
      })
    },
    addTaskExecutor(data){
      dispatch({
        type: getEffectOrReducerByName('addTaskExecutor'),
        payload: data
      })
    },
    removeTaskExecutor(data){
      dispatch({
        type: getEffectOrReducerByName('removeTaskExecutor'),
        payload: data
      })
    },
    completeTask(data){
      dispatch({
        type: getEffectOrReducerByName('completeTask'),
        payload: data
      })
    },
    addTaskTag(data){
      dispatch({
        type: getEffectOrReducerByName('addTaskTag'),
        payload: data
      })
    },
    removeTaskTag(data){
      dispatch({
        type: getEffectOrReducerByName('removeTaskTag'),
        payload: data
      })
    },
    removeProjectMenbers(data){
      dispatch({
        type: getEffectOrReducerByName('removeProjectMenbers'),
        payload: data
      })
    },
    getCardCommentList(id) {
      dispatch({
        type: getEffectOrReducerByName('getCardCommentList'),
        payload: {
          id
        }
      })
    },
    addCardNewComment(data) {
      dispatch({
        type: getEffectOrReducerByName('addCardNewComment'),
        payload: data
      })
    },
    deleteCardNewComment(data) {
      dispatch({
        type: getEffectOrReducerByName('deleteCardNewComment'),
        payload: data
      })
    },
    getBoardTagList(data) {
      dispatch({
        type: getEffectOrReducerByName('getBoardTagList'),
        payload: data
      })
    },
    updateBoardTag(data) {
      dispatch({
        type: getEffectOrReducerByName('updateBoardTag'),
        payload: data
      })
    },
    toTopBoardTag(data) {
      dispatch({
        type: getEffectOrReducerByName('toTopBoardTag'),
        payload: data
      })
    },
    deleteBoardTag(data) {
      dispatch({
        type: getEffectOrReducerByName('deleteBoardTag'),
        payload: data
      })
    }
  }
  const FileModuleProps = {
    modal,
    model,
    getFileList(params){
      dispatch({
        type: getEffectOrReducerByName('getFileList'),
        payload: params
      })
    },
    fileCopy(data){
      dispatch({
        type: getEffectOrReducerByName('fileCopy'),
        payload: data
      })
    },
    fileDownload(params){
      dispatch({
        type: getEffectOrReducerByName('fileDownload'),
        payload: params
      })
    },
    fileRemove(data){
      dispatch({
        type: getEffectOrReducerByName('fileRemove'),
        payload: data
      })
    },
    fileMove(data){
      dispatch({
        type: getEffectOrReducerByName('fileMove'),
        payload: data
      })
    },
    fileUpload(data){
      dispatch({
        type: getEffectOrReducerByName('fileUpload'),
        payload: data
      })
    },
    fileVersionist(params){
      dispatch({
        type: getEffectOrReducerByName('fileVersionist'),
        payload: params
      })
    },
    recycleBinList(params){
      dispatch({
        type: getEffectOrReducerByName('recycleBinList'),
        payload: params
      })
    },
    deleteFile(data){
      dispatch({
        type: getEffectOrReducerByName('deleteFile'),
        payload: data
      })
    },
    restoreFile(data){
      dispatch({
        type: getEffectOrReducerByName('restoreFile'),
        payload: data
      })
    },
    getFolderList(params){
      dispatch({
        type: getEffectOrReducerByName('getFolderList'),
        payload: params
      })
    },
    addNewFolder(data){
      dispatch({
        type: getEffectOrReducerByName('addNewFolder'),
        payload: data
      })
    },
    updateFolder(data){
      dispatch({
        type: getEffectOrReducerByName('updateFolder'),
        payload: data
      })
    },
    filePreview(params) {
      dispatch({
        type: getEffectOrReducerByName('filePreview'),
        payload: params
      })
    }
  }
  const ProcessProps = {
    modal,
    model,
    getProcessTemplateList(data){
      dispatch({
        type: getEffectOrReducerByName('saveProcessTemplate'),
        payload: data
      })
    },
    saveProcessTemplate(data){
      dispatch({
        type: getEffectOrReducerByName('saveProcessTemplate'),
        payload: data
      })
    },
    getTemplateInfo(id) {
      dispatch({
        type: getEffectOrReducerByName('getTemplateInfo'),
        payload: id
      })
    },
    directStartSaveTemplate(id) {
      dispatch({
        type: getEffectOrReducerByName('directStartSaveTemplate'),
        payload: id
      })
    },
    getProcessList(data){
      dispatch({
        type: getEffectOrReducerByName('getProcessList'),
        payload: data
      })
    },
    createProcess(data){
      dispatch({
        type: getEffectOrReducerByName('createProcess'),
        payload: data
      })
    },
    completeProcessTask(data){
      dispatch({
        type: getEffectOrReducerByName('completeProcessTask'),
        payload: data
      })
    },
    fillFormComplete(data) {
      dispatch({
        type: getEffectOrReducerByName('fillFormComplete'),
        payload: data
      })
    },
    rebackProcessTask(data){
      dispatch({
        type: getEffectOrReducerByName('rebackProcessTask'),
        payload: data
      })
    },
    rejectProcessTask(data) {
      dispatch({
        type: getEffectOrReducerByName('rejectProcessTask'),
        payload: data
      })
    },
    resetAsignees(data) {
      dispatch({
        type: getEffectOrReducerByName('resetAsignees'),
        payload: data
      })
    },
    getProcessInfo(data){
      dispatch({
        type: getEffectOrReducerByName('getProcessInfo'),
        payload: data
      })
    },
    getProessDynamics(params) {
      dispatch({
        type: getEffectOrReducerByName('getProessDynamics'),
        payload: params
      })
    }
  }
  const EditTeamShowProps = {
    modal,
    model,
  }

  const routingJump = (path) => {
    dispatch({
      type: getEffectOrReducerByName('routingJump'),
      payload: {
        route:path,
      },
    })
  }
  const updateDatas = (payload) => {
    dispatch({
      type: getEffectOrReducerByName('updateDatas') ,
      payload:payload
    })
  }

  const filterAppsModule = (appsSelectKey) => {
    let appFace = (<div></div>)
    switch (appsSelectKey) {
      case '2':
        appFace = (<ProcessIndex {...FileModuleProps} {...ProcessProps} updateDatas={updateDatas} />)
        break
      case '3':
        appFace = (<CreateTask  {...CreateTaskProps} updateDatas={updateDatas}/>)
        break
      case '4':
        appFace = (<FileModule {...FileModuleProps} updateDatas={updateDatas} />)
        break
      default:
        // appFace = (<EditTeamShow {...EditTeamShowProps} updateDatas={updateDatas}/>)
        break
    }
    return appFace
  }
  return(
    // minHeight: '100%',
    <div style={{ height: 'auto' , position: 'relative',width: '100%', overflow: 'hidden'}}>
      <div className={indexStyles.headerMaskDown}></div>
      <Header {...HeaderListProps} {...FileModuleProps} routingJump={routingJump} updateDatas={updateDatas} />
      {/*<DetailInfo {...DetailInfoProps} routingJump={routingJump} updateDatas={updateDatas} projectInfoDisplay={projectInfoDisplay}/>*/}
      {/*左边抽屉*/}
      <Drawer
        placement="left"
        closable={false}
        visible={projectInfoDisplay}
        width={376}
        top={172}
        zIndex={0}
        maskStyle={{top: 0, }}
      >
        <DrawDetailInfo {...DetailInfoProps} routingJump={routingJump} updateDatas={updateDatas} projectInfoDisplay={projectInfoDisplay}/>
      </Drawer>
      {/*应用界面*/}
      {filterAppsModule(appsSelectKey)}
    </div>
  )
};

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ modal, projectDetail, loading }) {
  return { modal, model: projectDetail, loading }
}
export default connect(mapStateToProps)(ProjectDetail)


