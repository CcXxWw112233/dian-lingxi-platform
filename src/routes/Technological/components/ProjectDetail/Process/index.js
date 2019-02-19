import React from 'react';
import {connect} from "dva/index";
import Process from './Process'
import { Route, Router, Switch, Link } from 'dva/router'
import { Drawer } from 'antd'

const getEffectOrReducerByName = name => `projectDetail/${name}`
const getEffectOrReducerByNameTask = name => `projectDetailTask/${name}`
const getEffectOrReducerByNameFile = name => `projectDetailFile/${name}`
const getEffectOrReducerByNameProcess = name => `projectDetailProcess/${name}`

const ProcessIndex = (props) => {
  const { dispatch, model, modal } = props

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
  const ProcessProps = {
    modal,
    model,
    postCommentToDynamics(data) {
      dispatch({
        type: getEffectOrReducerByNameProcess('postCommentToDynamics'),
        payload: data,
      })
    },
    getProcessTemplateList(data){
      dispatch({
        type: getEffectOrReducerByNameProcess('saveProcessTemplate'),
        payload: data
      })
    },
    saveProcessTemplate(data){
      dispatch({
        type: getEffectOrReducerByNameProcess('saveProcessTemplate'),
        payload: data
      })
    },
    getTemplateInfo(id) {
      dispatch({
        type: getEffectOrReducerByNameProcess('getTemplateInfo'),
        payload: id
      })
    },
    directStartSaveTemplate(id) {
      dispatch({
        type: getEffectOrReducerByNameProcess('directStartSaveTemplate'),
        payload: id
      })
    },
    getProcessList(data){
      dispatch({
        type: getEffectOrReducerByNameProcess('getProcessList'),
        payload: data
      })
    },
    createProcess(data){
      dispatch({
        type: getEffectOrReducerByNameProcess('createProcess'),
        payload: data
      })
    },
    completeProcessTask(data){
      dispatch({
        type: getEffectOrReducerByNameProcess('completeProcessTask'),
        payload: data
      })
    },
    fillFormComplete(data) {
      dispatch({
        type: getEffectOrReducerByNameProcess('fillFormComplete'),
        payload: data
      })
    },
    rebackProcessTask(data){
      dispatch({
        type: getEffectOrReducerByNameProcess('rebackProcessTask'),
        payload: data
      })
    },
    rejectProcessTask(data) {
      dispatch({
        type: getEffectOrReducerByNameProcess('rejectProcessTask'),
        payload: data
      })
    },
    resetAsignees(data) {
      dispatch({
        type: getEffectOrReducerByNameProcess('resetAsignees'),
        payload: data
      })
    },
    getProcessInfo(data){
      dispatch({
        type: getEffectOrReducerByNameProcess('getProcessInfo'),
        payload: data
      })
    },
    getProessDynamics(params) {
      dispatch({
        type: getEffectOrReducerByNameProcess('getProessDynamics'),
        payload: params
      })
    }
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
     <Process {...FileModuleProps} {...ProcessProps} updateDatas={updateDatas} updateDatasFile={updateDatasFile} updateDatasProcess={updateDatasProcess} />
   </div>
  )
};

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ modal, projectDetail, projectDetailTask, projectDetailFile, projectDetailProcess, loading }) {
  const modelObj = {
    datas: { ...projectDetailProcess['datas'], ...projectDetail['datas'], }
  }
  return { modal, model: modelObj, loading }
}
export default connect(mapStateToProps)(ProcessIndex)


