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
import { getProjectGoupList, addTaskGroup, addCardNewComment, getCardCommentList, getTaskGroupList, addTask, updateTask, deleteTask, archivedTask, changeTaskType, addChirldTask, addTaskExecutor, completeTask, addTaskTag, removeTaskTag, removeProjectMenbers } from "../../services/technological/task";
import { selectAppsSelectKeyIsAreadyClickArray, selectAppsSelectKey, selectTaskGroupListIndex, selectTaskGroupList, selectTaskGroupListIndexIndex, selectDrawContent } from './select'
import Cookies from "js-cookie";
//状态说明：
//ProjectInfoDisplay ： 是否显示项目信息，第一次进来默认，以后点击显示隐藏

let board_id
// appsSelectKey 项目详情里面应用的app标志
export default {
  namespace: 'projectDetail',
  state: [{
  }],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        // message.destroy()
        board_id = Cookies.get('board_id')
        dispatch({
          type: 'updateDatas',
          payload:{
            //全局任务key
            appsSelectKey: undefined, //应用key
            appsSelectKeyIsAreadyClickArray: [], //点击过的appsSelectKey push进数组，用来记录无需重新查询数据
            //项目详情和任务
            projectInfoDisplay: false, //项目详情是否出现 projectInfoDisplay 和 isInitEntry 要同时为一个值
            isInitEntry: false, //是否初次进来项目详情
            drawContent: {}, //任务右方抽屉内容
            projectDetailInfoData: {}, //项目详情全部数据
            cardCommentList: [], //任务评论列表
            projectGoupList: [], //项目分组列表
            taskGroupList: [],  //任务列表
            // 文档
            fileList: [], //文档列表
            filedata_1: [], //文档列表--文件夹
            filedata_2: [], //文档列表--文件
            selectedRowKeys: [],//选择的列表项
            isInAddDirectory: false, //是否正在创建文件家判断标志
            moveToDirectoryVisiblie: false, // 是否显示移动到文件夹列表
          }
        })
        if (location.pathname === '/technological/projectDetail') {
          dispatch({
            type: 'initProjectDetail',
            payload:{
              id: board_id
            }
          })
        }else{

        }
      })
    },
  },
  effects: {
    //初始化进来 , 先根据项目详情获取默认 appsSelectKey，再根据这个appsSelectKey，查询操作相应的应用 ‘任务、流程、文档、招标、日历’等
    * initProjectDetail({ payload }, { select, call, put }) {
      const { id } = payload
      let res = yield call(projectDetailInfo, id)
      const appsSelectKey = yield select(selectAppsSelectKey)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload:{
            projectDetailInfoData: res.data,
            appsSelectKey: appsSelectKey || (res.data.app_data[0]? res.data.app_data[0].key : 1),//设置默认
            appsSelectKeyIsAreadyClickArray: [res.data.app_data[0]? res.data.app_data[0].key : 1] //设置默认
          }
        })
        if(res.data.app_data[0] ) {
          if( res.data.app_data[0].key === 3) { //任务
            yield put({
              type: 'getProjectGoupList'
            })
            yield put({
              type: 'getTaskGroupList',
              payload: {
                type: '2',
                board_id: board_id,
                arrange_type: '1'
              }
            })
          }else if(res.data.app_data[0].key === 2){ //文档
            const filedata_1 = [];
            const filedata_2 = [];
            for (let i = 0; i < 6; i++) {
              filedata_1.push({
                id: i+5,
                name: `${20 + parseFloat(10 * Math.random()).toFixed(2)}`,
                size:`${20+i}${i % 2 === 0 ? 'MB' : 'G' }` ,
                updateTime: '这是文件夹',
                founder: ` ${20 + parseFloat(10 * Math.random()).toFixed(2)}`,
                type: '1'
              });
              filedata_2.push({
                id: i+5,
                name: `${20 + parseFloat(10 * Math.random()).toFixed(2)}`,
                size:`${20+i}${i % 2 === 0 ? 'MB' : 'G' }` ,
                updateTime: '这是文件',
                founder: ` ${20 + parseFloat(10 * Math.random()).toFixed(2)}`,
                type: '0'
              })
            }
            yield put({
              type: 'updateDatas',
              payload: {
                filedata_1,
                filedata_2,
                fileList: [...filedata_1, ...filedata_2]
              }
            })
          }else {

          }
        }

      }else{
      }
    },
    //点击app选项，将点击过的key push进数组，根据已经点击过的数组判断不在重新拉取数据
    * appsSelect({ payload }, { select, call, put }) {
      const { appsSelectKey } = payload
      let appsSelectKeyIsAreadyClickArray = []
      appsSelectKeyIsAreadyClickArray = yield select(selectAppsSelectKeyIsAreadyClickArray)
      let flag = true
      for (let val of appsSelectKeyIsAreadyClickArray) {
        if(appsSelectKey === val) {
          flag = false
        }
      }
      appsSelectKeyIsAreadyClickArray.push(appsSelectKey)
      const newAppsSelectKeyIsAreadyClickArray = Array.from(new Set(appsSelectKeyIsAreadyClickArray))
      yield put({
        type: 'updateDatas',
        payload:{
          appsSelectKeyIsAreadyClickArray: newAppsSelectKeyIsAreadyClickArray
        }
      })
      if(!flag) {
        return false
      }

      if( appsSelectKey === 3) { //任务
        yield put({
          type: 'getProjectGoupList'
        })
        yield put({
          type: 'getTaskGroupList',
          payload: {
            type: '2',
            board_id: board_id,
            arrange_type: '1'
          }
        })
      }else if(appsSelectKey === 2){ //流程

      }



    },

    //项目增删改查--start
    * projectDetailInfo({ payload }, { select, call, put }) { //查看项目详情信息
      const { id } = payload
      let res = yield call(projectDetailInfo, id)
      const appsSelectKey = yield select(selectAppsSelectKey)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload:{
            projectDetailInfoData: res.data,
            appsSelectKey: appsSelectKey || (res.data.app_data[0]? res.data.app_data[0].key : 1)
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
            id: board_id
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
            id: board_id
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
            id: board_id
          }
        })
      }else{

      }
    },

    * deleteProject({ payload }, { select, call, put }) {
      const { id, isJump } = payload
      let res = yield call(deleteProject, id)
      if(isApiResponseOk(res)) {
        if(isJump) {
          yield put({
            type: 'routingJump',
            payload: {
              route: '/technological/project'
            }
          })
        }
      }else{

      }
    },
    //项目增删改查--end

    //任务---start

    * addTaskGroup({ payload }, { select, call, put }) { //
      let res = yield call(addTaskGroup, payload)
      const { length } = payload
      const taskGroupList = yield select(selectTaskGroupList)
      if(isApiResponseOk(res)) {
        taskGroupList[length].list_id = res.data.id
      }else{
      }
    },

    * getTaskGroupList({ payload }, { select, call, put }) { //
      let res = yield call(getTaskGroupList, payload)
      // message.destroy()
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
             board_id: board_id,
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
        const taskGroupList = yield select(selectTaskGroupList)
        const taskGroupListIndex = yield select(selectTaskGroupListIndex) //  获取到全局设置filter,分页设置
        const taskGroupListIndex_index = yield  select(selectTaskGroupListIndexIndex)
        taskGroupList[taskGroupListIndex]['card_data'].splice(taskGroupListIndex_index, 1)
        yield put({
          type: 'updateDatas',
          payload:{
            taskGroupList
          }
        })
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
      const { requestObj, indexObj } = payload
      const { board_id } = requestObj
      const { taskGroupListIndex, taskGroupListIndex_index } = indexObj
      let res = yield call(changeTaskType, requestObj)

      if(isApiResponseOk(res)) {
        Cookies.set('board_id', board_id,{expires: 30, path: ''})
        yield  put({
          type: 'projectDetailInfo',
          payload:{
            id: Cookies.get('board_id')
          }
        })
        yield  put({
          type: 'getProjectGoupList',
          payload:{
          }
        })
        yield  put({
          type: 'putTask',
          payload: indexObj
        })
      }else{
      }
    },

    * addChirldTask({ payload }, { select, call, put }) { //
      const { length } = payload
      const newPayload = {...payload}
      newPayload.executors ? delete newPayload.executors: ''
      let res = yield call(addChirldTask, newPayload)
      const drawContent = yield select(selectDrawContent) //  获取到全局设置filter,分页设置
      if(isApiResponseOk(res)) {
        drawContent.child_data[length -1] = res.data || payload
        yield put({
          type: 'updateDatas',
          payload:{
            drawContent,
          }
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
      const { length } = payload
      let res = yield call(addTaskTag, payload)
      const drawContent = yield select(selectDrawContent) //  获取到全局设置filter,分页设置
      if(isApiResponseOk(res)) {
        drawContent.label_data[length-1].label_id = res.data.label_id
        yield put({
          type: 'updateDatas',
          payload:{
            drawContent
          }
        })
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
      let res = yield call(getTaskGroupList,  {type: '2', board_id: Cookies.get('board_id'), arrange_type: '1'})
      const { taskGroupListIndex, taskGroupListIndex_index } = payload
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload:{
            taskGroupListIndex,
            taskGroupListIndex_index,
            taskGroupList: res.data,
            drawContent: res.data[taskGroupListIndex].card_data[taskGroupListIndex_index]
          }
        })
      }else{
      }
    },

    * removeProjectMenbers({ payload }, { select, call, put }) { //
      let res = yield call(removeProjectMenbers, payload)
      if(isApiResponseOk(res)) {

      }else{
      }
    },

    * getProjectGoupList({ payload }, { select, call, put }) { //
      let res = yield call(getProjectGoupList, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            projectGoupList: res.data
          }
        })
      } else {

      }
    },

    //任务---end

    //评论---start
    * getCardCommentList({ payload }, { select, call, put }) { //
      const { id } = payload
      yield put({
        type: 'updateDatas',
        payload:{
          cardCommentList: []
        }
      })
      let res = yield call(getCardCommentList, id)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload:{
            cardCommentList: res.data
          }
        })
      }else{
      }
    },

    * addCardNewComment({ payload }, { select, call, put }) { //
      let res = yield call(addCardNewComment, payload)
      if(isApiResponseOk(res)) {
        const { card_id } = payload
        let res = yield call(getCardCommentList, card_id)
        if(isApiResponseOk(res)) {
          yield put({
            type: 'updateDatas',
            payload:{
              cardCommentList: res.data
            }
          })
        }else{
        }
      }else{
      }
    },
    //评论--end

    //文档----------start

    //文档----------end
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
