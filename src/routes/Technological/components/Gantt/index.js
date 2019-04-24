import React, { Component } from 'react';
import {connect} from "dva/index";
import GanttFace from './GanttFace'
import TaskDetailModal from '../Workbench/CardContent/Modal/TaskDetailModal';
import FileDetailModal from '../Workbench/CardContent/Modal/FileDetailModal';

const getEffectOrReducerByName = name => `workbench/${name}`
const getEffectOrReducerByName_4 = name => `workbenchTaskDetail/${name}`
const getEffectOrReducerByName_5 = name => `workbenchFileDetail/${name}`

class Gantt extends Component{
  state = {
    TaskDetailModalVisibile: false,
    previewFileModalVisibile: false,
  }
  setPreviewFileModalVisibile() {
    this.setState({
      previewFileModalVisibile: !this.state.previewFileModalVisibile
    });
  }
  setTaskDetailModalVisibile() {
    this.setState({
      TaskDetailModalVisibile: !this.state.TaskDetailModalVisibile
    });
  }
  render() {
    const { dispatch, model, modal } = this.props
    const { previewFileModalVisibile, TaskDetailModalVisibile } = this.state
    const CreateTaskProps = {
      modal,
      model,
      getBoardMembers(payload) {
        dispatch({
          type: getEffectOrReducerByName_4('getBoardMembers'),
          payload: payload
        })
      },
      getCardDetail(payload){
        dispatch({
          type: getEffectOrReducerByName_4('getCardDetail'),
          payload: payload
        })
      },
      updateTaskDatas(payload) {
        dispatch({
          type: getEffectOrReducerByName_4('updateDatas'),
          payload: payload
        })
      },
      deleteTaskFile(data) {
        dispatch({
          type: getEffectOrReducerByName_4('deleteTaskFile'),
          payload: data,
        })
      },
      addTaskGroup(data) {
        dispatch({
          type: getEffectOrReducerByName_4('addTaskGroup'),
          payload: data,
        })
      },
      deleteTaskGroup(data) {
        dispatch({
          type: getEffectOrReducerByName_4('deleteTaskGroup'),
          payload: data,
        })
      },
      updateTaskGroup(data) {
        dispatch({
          type: getEffectOrReducerByName_4('updateTaskGroup'),
          payload: data,
        })
      },
      getTaskGroupList(data){
        dispatch({
          type: getEffectOrReducerByName_4('getTaskGroupList'),
          payload: data
        })
      },
      addTask(data){
        dispatch({
          type: getEffectOrReducerByName_4('addTask'),
          payload: data
        })
      },
      updateTask(data){
        dispatch({
          type: getEffectOrReducerByName_4('updateTask'),
          payload: data
        })
      },
      deleteTask(id){
        dispatch({
          type: getEffectOrReducerByName_4('deleteTask'),
          payload: {
            id
          }
        })
      },
      updateChirldTask(data){
        dispatch({
          type: getEffectOrReducerByName_4('updateChirldTask'),
          payload: data
        })
      },
      deleteChirldTask(data){
        dispatch({
          type: getEffectOrReducerByName_4('deleteChirldTask'),
          payload: data
        })
      },

      archivedTask(data){
        dispatch({
          type: getEffectOrReducerByName_4('archivedTask'),
          payload: data
        })
      },
      changeTaskType(data){
        dispatch({
          type: getEffectOrReducerByName_4('changeTaskType'),
          payload: data
        })
      },
      addChirldTask(data){
        dispatch({
          type: getEffectOrReducerByName_4('addChirldTask'),
          payload: data
        })
      },
      addTaskExecutor(data){
        dispatch({
          type: getEffectOrReducerByName_4('addTaskExecutor'),
          payload: data
        })
      },
      removeTaskExecutor(data){
        dispatch({
          type: getEffectOrReducerByName_4('removeTaskExecutor'),
          payload: data
        })
      },
      completeTask(data){
        dispatch({
          type: getEffectOrReducerByName_4('completeTask'),
          payload: data
        })
      },
      addTaskTag(data){
        dispatch({
          type: getEffectOrReducerByName_4('addTaskTag'),
          payload: data
        })
      },
      removeTaskTag(data){
        dispatch({
          type: getEffectOrReducerByName_4('removeTaskTag'),
          payload: data
        })
      },
      removeProjectMenbers(data){
        dispatch({
          type: getEffectOrReducerByName_4('removeProjectMenbers'),
          payload: data
        })
      },
      getCardCommentList(id) {
        dispatch({
          type: getEffectOrReducerByName_4('getCardCommentList'),
          payload: {
            id
          }
        })
      },
      addCardNewComment(data) {
        dispatch({
          type: getEffectOrReducerByName_4('addCardNewComment'),
          payload: data
        })
      },
      deleteCardNewComment(data) {
        dispatch({
          type: getEffectOrReducerByName_4('deleteCardNewComment'),
          payload: data
        })
      },
      getBoardTagList(data) {
        dispatch({
          type: getEffectOrReducerByName_4('getBoardTagList'),
          payload: data
        })
      },
      updateBoardTag(data) {
        dispatch({
          type: getEffectOrReducerByName_4('updateBoardTag'),
          payload: data
        })
      },
      toTopBoardTag(data) {
        dispatch({
          type: getEffectOrReducerByName_4('toTopBoardTag'),
          payload: data
        })
      },
      deleteBoardTag(data) {
        dispatch({
          type: getEffectOrReducerByName_4('deleteBoardTag'),
          payload: data
        })
      }
    }
    const FileModuleProps = {
      modal,
      model,
      updateFileDatas(payload) {
        dispatch({
          type: getEffectOrReducerByName_5('updateDatas'),
          payload: payload
        })
      },
      getFileList(params){
        dispatch({
          type: getEffectOrReducerByName('getFileList'),
          payload: params
        })
      },
      fileCopy(data){
        dispatch({
          type: getEffectOrReducerByName_5('fileCopy'),
          payload: data
        })
      },
      fileDownload(params){
        dispatch({
          type: getEffectOrReducerByName_5('fileDownload'),
          payload: params
        })
      },
      fileRemove(data){
        dispatch({
          type: getEffectOrReducerByName_5('fileRemove'),
          payload: data
        })
      },
      fileMove(data){
        dispatch({
          type: getEffectOrReducerByName_5('fileMove'),
          payload: data
        })
      },
      fileUpload(data){
        dispatch({
          type: getEffectOrReducerByName_5('fileUpload'),
          payload: data
        })
      },
      fileVersionist(params){
        dispatch({
          type: getEffectOrReducerByName_5('fileVersionist'),
          payload: params
        })
      },
      recycleBinList(params){
        dispatch({
          type: getEffectOrReducerByName_5('recycleBinList'),
          payload: params
        })
      },
      deleteFile(data){
        dispatch({
          type: getEffectOrReducerByName_5('deleteFile'),
          payload: data
        })
      },
      restoreFile(data){
        dispatch({
          type: getEffectOrReducerByName_5('restoreFile'),
          payload: data
        })
      },
      getFolderList(params){
        dispatch({
          type: getEffectOrReducerByName_5('getFolderList'),
          payload: params
        })
      },
      addNewFolder(data){
        dispatch({
          type: getEffectOrReducerByName_5('addNewFolder'),
          payload: data
        })
      },
      updateFolder(data){
        dispatch({
          type: getEffectOrReducerByName_5('updateFolder'),
          payload: data
        })
      },
      filePreview(params) {
        dispatch({
          type: getEffectOrReducerByName_5('filePreview'),
          payload: params
        })
      },
      getPreviewFileCommits(params) {
        dispatch({
          type: getEffectOrReducerByName_5('getPreviewFileCommits'),
          payload: params
        })
      },
      addFileCommit(params) {
        dispatch({
          type: getEffectOrReducerByName_5('addFileCommit'),
          payload: params
        })
      },
      deleteCommit(params) {
        dispatch({
          type: getEffectOrReducerByName_5('deleteCommit'),
          payload: params
        })
      },
    }
    const updateDatasTask = (payload) => {
      dispatch({
        type: getEffectOrReducerByName_4('updateDatas'),
        payload: payload
      })
    }
    const updateDatasFile = (payload) => {
      dispatch({
        type: getEffectOrReducerByName_5('updateDatas'),
        payload: payload
      })
    }

    return (
      <div>
        <GanttFace
          setTaskDetailModalVisibile={this.setTaskDetailModalVisibile.bind(this)}
        />
        <FileDetailModal
          {...this.props}
          {...CreateTaskProps}
          setTaskDetailModalVisibile={this.setTaskDetailModalVisibile.bind(this)}
          modalVisible={previewFileModalVisibile}
          setPreviewFileModalVisibile={this.setPreviewFileModalVisibile.bind(this)}
          updateDatasTask={updateDatasTask}
          updateDatasFile={updateDatasFile}
        />

        <TaskDetailModal
          {...this.props}
          {...CreateTaskProps}
          {...FileModuleProps}
          modalVisible={TaskDetailModalVisibile}
          setTaskDetailModalVisibile={this.setTaskDetailModalVisibile.bind(this)}
          setPreviewFileModalVisibile={this.setPreviewFileModalVisibile.bind(this)}
          updateDatasTask={updateDatasTask}
          updateDatasFile={updateDatasFile}
        />
      </div>
    )
  }

}

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ gantt, workbench, workbenchTaskDetail, workbenchFileDetail, workbenchDetailProcess, workbenchPublicDatas }) {
  const modelObj = {
    datas: { ...workbench['datas'], ...workbenchTaskDetail['datas'], ...workbenchFileDetail['datas'], ...workbenchDetailProcess['datas'], ...workbenchPublicDatas['datas'], ...gantt['datas']}
  }
  return { model: gantt }
}
export default connect(mapStateToProps)(Gantt)

