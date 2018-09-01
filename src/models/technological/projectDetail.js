import { projectDetailInfo, updateProject, removeMenbers } from '../../services/technological/prjectDetail'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME } from "../../globalset/js/constant";
import { routerRedux } from "dva/router";
import { getUrlQueryString } from '../../utils/util'
import {
  addMenbersInProject, archivedProject, cancelCollection, deleteProject,collectionProject,
  quitProject
} from "../../services/technological/project";
import { getTaskGroupList, addTask, updateTask, deleteTask, archivedTask, changeTaskType, addChirldTask, addTaskExecutor, completeTask, addTaskTag, removeTaskTag } from "../../services/technological/task";

//状态说明：
//ProjectInfoDisplay ： 是否显示项目信息，第一次进来默认，以后点击显示隐藏

let search = null
export default {
  namespace: 'projectDetail',
  state: [],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        // message.destroy()
        search = location.search
        if (location.pathname === '/technological/projectDetail') {
          dispatch({
            type: 'updateDatas',
            payload:{
              projectInfoDisplay: false, //项目详情是否出现 projectInfoDisplay 和 isInitEntry 要同时为一个值
              isInitEntry: false, //是否初次进来
              drawContent: {}, //右方抽屉内容
            }
          })
          dispatch({
            type: 'projectDetailInfo',
            payload:{
              id: getUrlQueryString(location.search, 'board_id')
            }
          })
          dispatch({
            type: 'getTaskGroupList',
            payload: {
              type: '2',
              board_id: getUrlQueryString(location.search, 'board_id'),
              arrange_type: '1'
            }
          })
        }else{
        }
      })
    },
  },
  effects: {
    //项目增删改查--start
    * projectDetailInfo({ payload }, { select, call, put }) { //查看项目详情信息
      const { id } = payload
      let res = yield call(projectDetailInfo, id)
      message.destroy()
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload:{
            projectDetailInfoData: res.data
          }
        })
      }else{
      }
    },

    * removeMenbers({ payload }, { select, call, put }) { //
      let res = yield call(removeMenbers, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'projectDetailInfo',
          payload:{
            id: getUrlQueryString(search, 'board_id')
          }
        })
      }else{
      }
    },

    * updateProject({ payload }, { select, call, put }) { //
      let res = yield call(updateProject, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'projectDetailInfo',
          payload:{
            id: getUrlQueryString(search, 'board_id')
          }
        })
      }else{
      }
    },

    * collectionProject({ payload }, { select, call, put }) {
      const { id } = payload
      let res = yield call(collectionProject, id)
      if(isApiResponseOk(res)) {

      }else{

      }
    },

    * cancelCollection({ payload }, { select, call, put }) {
      const { id } = payload
      let res = yield call(cancelCollection, id)
      if(isApiResponseOk(res)) {

      }else{

      }
    },

    * quitProject({ payload }, { select, call, put }) {
      let res = yield call(quitProject, payload)
      if(isApiResponseOk(res)) {

      }else{

      }
    },

    * archivedProject({ payload }, { select, call, put }) {
      let res = yield call(archivedProject, payload)
      if(isApiResponseOk(res)) {

      }else{

      }
    },

    * addMenbersInProject({ payload }, { select, call, put }) {
      let res = yield call(addMenbersInProject, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'projectDetailInfo',
          payload:{
            id: getUrlQueryString(search, 'board_id')
          }
        })
      }else{

      }
    },

    * deleteProject({ payload }, { select, call, put }) {
      const { id } = payload
      let res = yield call(deleteProject, id)
      if(isApiResponseOk(res)) {

      }else{

      }
    },
    //项目增删改查--end

    //任务---start
    * getTaskGroupList({ payload }, { select, call, put }) { //
      let res = yield call(getTaskGroupList, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload:{
            taskGroupList: res.data
          }
        })
      }else{
      }
    },

    * addTask({ payload }, { select, call, put }) { //
      let res = yield call(addTask, payload)
      if(isApiResponseOk(res)) {
         yield put({
           type: 'getTaskGroupList',
           payload: {
             type: '2',
             board_id: getUrlQueryString(search, 'board_id'),
             arrange_type: '1'
           }
         })
      }else{
      }
    },

    * updateTask({ payload }, { select, call, put }) { //
      const { updateObj } = payload
      let res = yield call(updateTask, updateObj)
      if(isApiResponseOk(res)) {
        // yield put({
        //   type: 'updateDatas',
        //   payload: {
        //     drawContent
        //   }
        // })
      }else{
      }
    },

    * deleteTask({ payload }, { select, call, put }) { //
      const { id } = payload
      let res = yield call(deleteTask, id)
      if(isApiResponseOk(res)) {

      }else{
      }
    },

    * archivedTask({ payload }, { select, call, put }) { //
      let res = yield call(archivedTask, payload)
      if(isApiResponseOk(res)) {

      }else{
      }
    },

    * changeTaskType({ payload }, { select, call, put }) { //
      let res = yield call(changeTaskType, payload)
      if(isApiResponseOk(res)) {

      }else{
      }
    },

    * addChirldTask({ payload }, { select, call, put }) { //
      let res = yield call(addChirldTask, payload)
      if(isApiResponseOk(res)) {
       yield put({
         type: 'putTask',
         payload
       })
      }else{
      }
    },

    * addTaskExecutor({ payload }, { select, call, put }) { //
      let res = yield call(addTaskExecutor, payload)
      if(isApiResponseOk(res)) {

      }else{
      }
    },

    * completeTask({ payload }, { select, call, put }) { //
      let res = yield call(completeTask, payload)
      if(isApiResponseOk(res)) {

      }else{
      }
    },

    * addTaskTag({ payload }, { select, call, put }) { //
      let res = yield call(addTaskTag, payload)
      if(isApiResponseOk(res)) {

      }else{
      }
    },

    * removeTaskTag({ payload }, { select, call, put }) { //
      let res = yield call(removeTaskTag, payload)
      if(isApiResponseOk(res)) {

      }else{
      }
    },

    * putTask({ payload }, { select, call, put }) {
      let res = yield call(getTaskGroupList,  {type: '2', board_id: getUrlQueryString(search, 'board_id'), arrange_type: '1'})
      const { taskGroupListIndex, taskGroupListIndex_index } = payload
      console.log(res.data[taskGroupListIndex].card_data[taskGroupListIndex_index])
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload:{
            taskGroupList: res.data,
            drawContent: res.data[taskGroupListIndex].card_data[taskGroupListIndex_index]
          }
        })
      }else{
      }
    },

    //任务---end

    * routingJump({ payload }, { call, put }) {
      const { route } = payload
      yield put(routerRedux.push(route));
    },
  },

  reducers: {
    updateDatas(state, action) {
      return {
        ...state,
        datas: { ...state.datas, ...action.payload },
      }
    }
  },
};
