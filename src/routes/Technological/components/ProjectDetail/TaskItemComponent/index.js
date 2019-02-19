import React from 'react';
import {connect} from "dva/index";
import CreateTask from './CreateTask'
import { Route, Router, Switch, Link } from 'dva/router'
import { Drawer } from 'antd'

const getEffectOrReducerByName = name => `projectDetail/${name}`
const getEffectOrReducerByNameTask = name => `projectDetailTask/${name}`
const getEffectOrReducerByNameFile = name => `projectDetailFile/${name}`
const getEffectOrReducerByNameProcess = name => `projectDetailProcess/${name}`

const Task = (props) => {
  const { dispatch, model, modal } = props

  const CreateTaskProps = {
    modal,
    model,
    postCommentToDynamics(data) {
      dispatch({
        type: getEffectOrReducerByNameTask('postCommentToDynamics'),
        payload: data,
      })
    },
    deleteTaskFile(data) {
      dispatch({
        type: getEffectOrReducerByNameTask('deleteTaskFile'),
        payload: data,
      })
    },
    addTaskGroup(data) {
      dispatch({
        type: getEffectOrReducerByNameTask('addTaskGroup'),
        payload: data,
      })
    },
    deleteTaskGroup(data) {
      dispatch({
        type: getEffectOrReducerByNameTask('deleteTaskGroup'),
        payload: data,
      })
    },
    updateTaskGroup(data) {
      dispatch({
        type: getEffectOrReducerByNameTask('updateTaskGroup'),
        payload: data,
      })
    },
    getTaskGroupList(data){
      dispatch({
        type: getEffectOrReducerByNameTask('getTaskGroupList'),
        payload: data
      })
    },
    addTask(data){
      dispatch({
        type: getEffectOrReducerByNameTask('addTask'),
        payload: data
      })
    },
    updateTask(data){
      dispatch({
        type: getEffectOrReducerByNameTask('updateTask'),
        payload: data
      })
    },
    deleteTask(id){
      dispatch({
        type: getEffectOrReducerByNameTask('deleteTask'),
        payload: {
          id
        }
      })
    },
    updateChirldTask(data){
      dispatch({
        type: getEffectOrReducerByNameTask('updateChirldTask'),
        payload: data
      })
    },
    deleteChirldTask(data){
      dispatch({
        type: getEffectOrReducerByNameTask('deleteChirldTask'),
        payload: data
      })
    },
    archivedTask(data){
      dispatch({
        type: getEffectOrReducerByNameTask('archivedTask'),
        payload: data
      })
    },
    changeTaskType(data){
      dispatch({
        type: getEffectOrReducerByNameTask('changeTaskType'),
        payload: data
      })
    },
    addChirldTask(data){
      dispatch({
        type: getEffectOrReducerByNameTask('addChirldTask'),
        payload: data
      })
    },
    addTaskExecutor(data){
      dispatch({
        type: getEffectOrReducerByNameTask('addTaskExecutor'),
        payload: data
      })
    },
    removeTaskExecutor(data){
      dispatch({
        type: getEffectOrReducerByNameTask('removeTaskExecutor'),
        payload: data
      })
    },
    completeTask(data){
      dispatch({
        type: getEffectOrReducerByNameTask('completeTask'),
        payload: data
      })
    },
    addTaskTag(data){
      dispatch({
        type: getEffectOrReducerByNameTask('addTaskTag'),
        payload: data
      })
    },
    removeTaskTag(data){
      dispatch({
        type: getEffectOrReducerByNameTask('removeTaskTag'),
        payload: data
      })
    },
    removeProjectMenbers(data){
      dispatch({
        type: getEffectOrReducerByNameTask('removeProjectMenbers'),
        payload: data
      })
    },
    getCardCommentList(id) {
      dispatch({
        type: getEffectOrReducerByNameTask('getCardCommentList'),
        payload: {
          id
        }
      })
    },
    addCardNewComment(data) {
      dispatch({
        type: getEffectOrReducerByNameTask('addCardNewComment'),
        payload: data
      })
    },
    deleteCardNewComment(data) {
      dispatch({
        type: getEffectOrReducerByNameTask('deleteCardNewComment'),
        payload: data
      })
    },
    getBoardTagList(data) {
      dispatch({
        type: getEffectOrReducerByNameTask('getBoardTagList'),
        payload: data
      })
    },
    updateBoardTag(data) {
      dispatch({
        type: getEffectOrReducerByNameTask('updateBoardTag'),
        payload: data
      })
    },
    toTopBoardTag(data) {
      dispatch({
        type: getEffectOrReducerByNameTask('toTopBoardTag'),
        payload: data
      })
    },
    deleteBoardTag(data) {
      dispatch({
        type: getEffectOrReducerByNameTask('deleteBoardTag'),
        payload: data
      })
    }
  }
  const FileModuleProps = {
    modal,
    model,
    postCommentToDynamics(data) {
      dispatch({
        type: getEffectOrReducerByNameFile('postCommentToDynamics'),
        payload: data,
      })
    },
    getFileList(params){
      dispatch({
        type: getEffectOrReducerByNameFile('getFileList'),
        payload: params
      })
    },
    fileCopy(data){
      dispatch({
        type: getEffectOrReducerByNameFile('fileCopy'),
        payload: data
      })
    },
    fileDownload(params){
      dispatch({
        type: getEffectOrReducerByNameFile('fileDownload'),
        payload: params
      })
    },
    fileRemove(data){
      dispatch({
        type: getEffectOrReducerByNameFile('fileRemove'),
        payload: data
      })
    },
    fileMove(data){
      dispatch({
        type: getEffectOrReducerByNameFile('fileMove'),
        payload: data
      })
    },
    fileUpload(data){
      dispatch({
        type: getEffectOrReducerByNameFile('fileUpload'),
        payload: data
      })
    },
    fileVersionist(params){
      dispatch({
        type: getEffectOrReducerByNameFile('fileVersionist'),
        payload: params
      })
    },
    recycleBinList(params){
      dispatch({
        type: getEffectOrReducerByNameFile('recycleBinList'),
        payload: params
      })
    },
    deleteFile(data){
      dispatch({
        type: getEffectOrReducerByNameFile('deleteFile'),
        payload: data
      })
    },
    restoreFile(data){
      dispatch({
        type: getEffectOrReducerByNameFile('restoreFile'),
        payload: data
      })
    },
    getFolderList(params){
      dispatch({
        type: getEffectOrReducerByNameFile('getFolderList'),
        payload: params
      })
    },
    addNewFolder(data){
      dispatch({
        type: getEffectOrReducerByNameFile('addNewFolder'),
        payload: data
      })
    },
    updateFolder(data){
      dispatch({
        type: getEffectOrReducerByNameFile('updateFolder'),
        payload: data
      })
    },
    filePreview(params) {
      dispatch({
        type: getEffectOrReducerByNameFile('filePreview'),
        payload: params
      })
    },
    getPreviewFileCommits(params) {
      dispatch({
        type: getEffectOrReducerByNameFile('getPreviewFileCommits'),
        payload: params
      })
    },
    addFileCommit(params) {
      dispatch({
        type: getEffectOrReducerByNameFile('addFileCommit'),
        payload: params
      })
    },
    deleteCommit(params) {
      dispatch({
        type: getEffectOrReducerByNameFile('deleteCommit'),
        payload: params
      })
    },
  }

  const routingJump = (path) => {
    dispatch({
      type: getEffectOrReducerByName('routingJump'),
      payload: {
        route: path,
      },
    })
  }
  const updateDatas = (payload) => {
    dispatch({
      type: getEffectOrReducerByName('updateDatas'),
      payload: payload
    })
  }
  const updateDatasTask = (payload) => {
    dispatch({
      type: getEffectOrReducerByNameTask('updateDatas'),
      payload: payload
    })
  }
  const updateDatasFile = (payload) => {
    dispatch({
      type: getEffectOrReducerByNameFile('updateDatas'),
      payload: payload
    })
  }
  const updateDatasProcess = (payload) => {
    dispatch({
      type: getEffectOrReducerByNameProcess('updateDatas'),
      payload: payload
    })
  }
  return(
   <div>
     <CreateTask {...FileModuleProps} {...CreateTaskProps} updateDatas={updateDatas} updateDatasTask={updateDatasTask} updateDatasFile={updateDatasFile} />
   </div>
  )
};

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ modal, projectDetail, projectDetailTask, projectDetailFile, projectDetailProcess, loading }) {
  const modelObj = {
    datas: {...projectDetailTask['datas'], ...projectDetail['datas'], }
  }
  return { modal, model: modelObj, loading }
}
export default connect(mapStateToProps)(Task)


