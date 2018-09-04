import React from 'react';
import {connect} from "dva/index";
import Header from './Header'
import DetailInfo from './DetailInfo'
import CreateTask from  './CreateTask'
import DrawerContent from './TaskItemComponent/DrawerContent'


const getEffectOrReducerByName = name => `projectDetail/${name}`

const ProjectDetail = (props) => {
  const { dispatch, model, modal } = props
  const { datas:{ projectInfoDisplay, taskGroupList } } = model
  const HeaderListProps = {
    modal,
    model,
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
          id
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
    }
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
    }
  }
  const CreateTaskProps = {
    modal,
    model,
    addTaskGroup(data) {
      dispatch({
        type: getEffectOrReducerByName('addTaskGroup'),
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
    }
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

  return(
    <div style={{ height: '100%' ,position: 'relative',width: '100%', overflow: 'hidden'}}>
      <Header {...HeaderListProps} routingJump={routingJump} updateDatas={updateDatas} />
      <DetailInfo {...DetailInfoProps} routingJump={routingJump} updateDatas={updateDatas} projectInfoDisplay={projectInfoDisplay}/>
      <CreateTask  {...CreateTaskProps} updateDatas={updateDatas}/>
      {/*<DrawerContent />*/}
    </div>
  )
};

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ modal, projectDetail, loading }) {
  return { modal, model: projectDetail, loading }
}
export default connect(mapStateToProps)(ProjectDetail)


