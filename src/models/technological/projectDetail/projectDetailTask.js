import { message } from 'antd'
import { routerRedux } from "dva/router";
import Cookies from "js-cookie";
import modelExtend from 'dva-model-extend'
import projectDetail from './index'
import {
  addCardNewComment,
  addChirldTask, addTask, addTaskExecutor, addTaskGroup, addTaskTag,
  archivedTask, changeTaskType, completeTask,
  deleteBoardTag, deleteCardNewComment, deleteTask, deleteTaskFile, deleteTaskGroup, getBoardTagList,
  getCardCommentList,
  getProjectGoupList, getTaskGroupList,
  removeProjectMenbers, removeTaskExecutor,
  removeTaskTag, toTopBoardTag,
  updateBoardTag, updateTask,
  updateTaskGroup
} from "../../../services/technological/task";
import {
  selectDrawContent, selectDrawerVisible, selectGetTaskGroupListArrangeType, selectTaskGroupList,
  selectTaskGroupListIndex, selectTaskGroupListIndexIndex
} from "../select";
import {MEMBERS, MESSAGE_DURATION_TIME, PROJECTS, TASKS} from "../../../globalset/js/constant";
import {isApiResponseOk} from "../../../utils/handleResponseData";
import {currentNounPlanFilterName} from "../../../utils/businessFunction";
import QueryString from 'querystring'

let board_id
export default modelExtend(projectDetail, {
  namespace: 'projectDetailTask',
  state: [],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {

        const param = QueryString.parse(location.search.replace('?', ''))
        board_id = param.board_id

        if (location.pathname.indexOf('/technological/projectDetail') !== -1) {
          dispatch({
            type: 'updateDatas',
            payload: {
              drawContent: {}, //任务右方抽屉内容
              drawerVisible: false, //查看任务的抽屉是否可见
              cardCommentList: [], //任务评论列表
              projectGoupList: [], //项目分组列表
              taskGroupList: [], //任务列表
              boardTagList: [], //项目标签列表
              getTaskGroupListArrangeType: '1', //1按分组 2按执行人 3按标签
            }
          })

          dispatch({
            type: 'getProjectGoupList',
            payload: {
            }
          })

          dispatch({
            type: 'getTaskGroupList',
            payload: {
              type: '2',
              board_id: board_id,
              arrange_type: '1'
            }
          })

          dispatch({
            type: 'getBoardTagList',
            payload: {
              board_id
            }
          })

        }
      })
    },
  },
  effects: {
    //任务---start
    * addTaskGroup({ payload }, { select, call, put }) { //
      let res = yield call(addTaskGroup, payload)
      const { length } = payload
      const taskGroupList = yield select(selectTaskGroupList)
      if(isApiResponseOk(res)) {
        taskGroupList[length].list_id = res.data.id
        yield put({
          type: 'updateDatas',
          payload: {
            taskGroupList
          }
        })
        message.success(`添加${currentNounPlanFilterName(TASKS)}分组成功`, MESSAGE_DURATION_TIME)
        const delay = (ms) => new Promise(resolve => {
          setTimeout(resolve, ms)
        })
        yield call(delay, MESSAGE_DURATION_TIME*1000)
        yield put({
          type: 'getProjectGoupList',
          payload: {}
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * deleteTaskGroup({ payload }, { select, call, put }) { //
      let res = yield call(deleteTaskGroup, payload)
      const { itemKey = 0 } = payload
      const taskGroupList = yield select(selectTaskGroupList)
      if(isApiResponseOk(res)) {
        taskGroupList.splice(itemKey, 1)
        yield put({
          type: 'updateDatas',
          payload: {
            taskGroupList
          }
        })
        message.success(`删除${currentNounPlanFilterName(TASKS)}分组成功`, MESSAGE_DURATION_TIME)
        const delay = (ms) => new Promise(resolve => {
          setTimeout(resolve, ms)
        })
        yield call(delay, MESSAGE_DURATION_TIME*1000)
        yield put({
          type: 'getProjectGoupList',
          payload: {}
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * updateTaskGroup({ payload }, { select, call, put }) { //
      let res = yield call(updateTaskGroup, payload)
      const { itemKey = 0, name } = payload
      const taskGroupList = yield select(selectTaskGroupList)
      if(isApiResponseOk(res)) {
        taskGroupList[itemKey]['list_name'] = name
        yield put({
          type: 'updateDatas',
          payload: {
            taskGroupList
          }
        })
        message.success(`更新${currentNounPlanFilterName(TASKS)}分组成功`, MESSAGE_DURATION_TIME)
        const delay = (ms) => new Promise(resolve => {
          setTimeout(resolve, ms)
        })
        yield call(delay, MESSAGE_DURATION_TIME*1000)
        yield put({
          type: 'getProjectGoupList',
          payload: {}
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * getTaskGroupList({ payload }, { select, call, put }) { //
      const { type, board_id, arrange_type, calback, operateType } = payload
      let res = yield call(getTaskGroupList, {type, arrange_type, board_id})
      if (typeof calback === 'function') {
        calback()
      }
      if(operateType === '1') { //代表分类查询选择
        yield put({
          type: 'updateDatas',
          payload: {
            taskGroupList: []
          }
        })
      }
      // message.destroy()
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            taskGroupList: res.data
          }
        })
      }else{
      }
    },

    * addTask({ payload }, { select, call, put }) { //
      let res = yield call(addTask, payload)
      let getTaskGroupListArrangeType = yield select(selectGetTaskGroupListArrangeType)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getTaskGroupList',
          payload: {
            type: '2',
            board_id: board_id,
            arrange_type: getTaskGroupListArrangeType,
            calback: function () {
              message.success('添加成功', MESSAGE_DURATION_TIME)
            }
          }
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * updateTask({ payload }, { select, call, put }) { //
      const { updateObj } = payload
      const taskGroupListIndex = yield select(selectTaskGroupListIndex) //
      const taskGroupListIndex_index = yield select(selectTaskGroupListIndexIndex)
      const taskGroupList = yield select(selectTaskGroupList) //
      const drawContent = yield select(selectDrawContent)
      const { description } = updateObj
      let res = yield call(updateTask, updateObj)
      if(isApiResponseOk(res)) {
        if(description) {
          drawContent['description'] = description
          taskGroupList[taskGroupListIndex]['card_data'][taskGroupListIndex_index]['description'] = description
        }
        yield put({
          type: 'updateDatas',
          payload: {
            drawContent,
            taskGroupList
          }
        })
        message.success('更新成功', MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * deleteTask({ payload }, { select, call, put }) { //
      const { id } = payload
      let res = yield call(deleteTask, id)
      if(isApiResponseOk(res)) {
        const taskGroupList = yield select(selectTaskGroupList)
        const taskGroupListIndex = yield select(selectTaskGroupListIndex) //  获取到全局设置filter,分页设置
        const taskGroupListIndex_index = yield select(selectTaskGroupListIndexIndex)
        taskGroupList[taskGroupListIndex]['card_data'].splice(taskGroupListIndex_index, 1)
        yield put({
          type: 'updateDatas',
          payload: {
            taskGroupList
          }
        })
        message.success('删除成功', MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * updateChirldTask({ payload }, { select, call, put }) { //
      const { updateObj } = payload
      const taskGroupListIndex = yield select(selectTaskGroupListIndex) //
      const taskGroupListIndex_index = yield select(selectTaskGroupListIndexIndex)
      const taskGroupList = yield select(selectTaskGroupList) //
      const drawContent = yield select(selectDrawContent)
      const { description } = updateObj
      let res = yield call(updateTask, updateObj)
      if(isApiResponseOk(res)) {
        if(description) {
          drawContent['description'] = description
          taskGroupList[taskGroupListIndex]['card_data'][taskGroupListIndex_index]['description'] = description
        }
        yield put({
          type: 'updateDatas',
          payload: {
            drawContent,
            taskGroupList
          }
        })
        message.success('更新成功', MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * deleteChirldTask({ payload }, { select, call, put }) { //
      const {card_id, chirldDataIndex} = payload
      let res = yield call(deleteTask, card_id)
      if(isApiResponseOk(res)) {
        const taskGroupList = yield select(selectTaskGroupList)
        const taskGroupListIndex = yield select(selectTaskGroupListIndex) //  获取到全局设置filter,分页设置
        const taskGroupListIndex_index = yield select(selectTaskGroupListIndexIndex)
        taskGroupList[taskGroupListIndex]['card_data'][taskGroupListIndex_index]['child_data'].splice(chirldDataIndex, 1)
        yield put({
          type: 'updateDatas',
          payload: {
            taskGroupList
          }
        })
        message.success('删除成功', MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * archivedTask({ payload }, { select, call, put }) { //
      let res = yield call(archivedTask, payload)
      if(isApiResponseOk(res)) {
        message.success(`已归档`, MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * changeTaskType({ payload }, { select, call, put }) { // 此方法注释掉的地方是先前做了任务跳转sss
      const { requestObj, indexObj } = payload
      // const { board_id } = requestObj
      // const { taskGroupListIndex, taskGroupListIndex_index } = indexObj
      let res = yield call(changeTaskType, requestObj)
      const getTaskGroupListArrangeType = yield select(selectGetTaskGroupListArrangeType)

      if(isApiResponseOk(res)) {
        //跳转操作
        // Cookies.set('board_id', board_id,{expires: 30, path: ''})
        // yield  put({
        //   type: 'projectDetailInfo',
        //   payload:{
        //     id: Cookies.get('board_id')
        //   }
        // })
        // yield  put({
        //   type: 'getProjectGoupList',
        //   payload:{
        //   }
        // })
        // yield  put({
        //   type: 'putTask',
        //   payload: indexObj
        // })
        yield put({
          type: 'getTaskGroupList',
          payload: {
            type: '2',
            board_id: board_id,
            arrange_type: getTaskGroupListArrangeType,
            calback: function () {
              message.success('移动成功', MESSAGE_DURATION_TIME)
            }
          }
        })
        yield put({
          type: 'updateDatas',
          payload: {
            drawerVisible: false
          }
        })

      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * addChirldTask({ payload }, { select, call, put }) { //
      const { length } = payload
      const newPayload = {...payload}
      newPayload.executors ? delete newPayload.executors: '' //去掉不需要的数据
      let res = yield call(addChirldTask, newPayload)
      const drawContent = yield select(selectDrawContent) //  获取到全局设置filter,分页设置
      if(isApiResponseOk(res)) {
        drawContent.child_data[0] = payload
        drawContent.child_data[0]['card_id'] = res.data.id
        // yield put({
        //   type: 'updateDatas',
        //   payload:{
        //     drawContent,
        //   }
        // })
        message.success(`添加成功`, MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * addTaskExecutor({ payload }, { select, call, put }) { //
      let res = yield call(addTaskExecutor, payload)
      if(isApiResponseOk(res)) {
        message.success(`已成功设置执行人`, MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * removeTaskExecutor({ payload }, { select, call, put }) { //
      let res = yield call(removeTaskExecutor, payload)
      if(isApiResponseOk(res)) {
        message.success(`已成功删除执行人`, MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * completeTask({ payload }, { select, call, put }) { //
      const { is_realize } = payload
      let res = yield call(completeTask, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'projectDetailInfo',
          payload: {
            id: board_id,
            calback: function () {
              message.success(is_realize === '1'? `已完成该${currentNounPlanFilterName(TASKS)}`: `已将该${currentNounPlanFilterName(TASKS)}设置未完成`, MESSAGE_DURATION_TIME)
            }
          }
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * removeTaskTag({ payload }, { select, call, put }) { //
      let res = yield call(removeTaskTag, payload)
      if(isApiResponseOk(res)) {
        message.success('已删除标签', MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * putTask({ payload }, { select, call, put }) {
      let res = yield call(getTaskGroupList, {type: '2', board_id: board_id, arrange_type: '1'})
      const { taskGroupListIndex, taskGroupListIndex_index } = payload
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
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
        message.success(`已从${currentNounPlanFilterName(PROJECTS)}移出该${currentNounPlanFilterName(MEMBERS)}`, MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
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

    * deleteTaskFile({ payload }, { select, call, put }) { //
      let res = yield call(deleteTaskFile, payload)
      if(isApiResponseOk(res)) {

      }else {

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
          payload: {
            drawContent
          }
        })
        yield put({
          type: 'getBoardTagList',
          payload: {
            board_id,
            calback: function () {
              message.success('添加任务标签成功', MESSAGE_DURATION_TIME)
            }
          }
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * getBoardTagList({ payload }, { select, call, put }) { //
      const { board_id, calback } = payload
      let res = yield call(getBoardTagList, {board_id})
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            boardTagList: res.data
          }
        })
        if(calback && typeof calback === 'function') {
          calback()
        }
      }else {

      }
    },

    * updateBoardTag({ payload }, { select, call, put }) { //
      let res = yield call(updateBoardTag, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getBoardTagList',
          payload: {
            board_id,
            calback: function () {
              message.success('更新标签成功', MESSAGE_DURATION_TIME)
            }
          }
        })
      }else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * toTopBoardTag({ payload }, { select, call, put }) { //
      let res = yield call(toTopBoardTag, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getBoardTagList',
          payload: {
            board_id,
            calback: function () {
              message.success('已成功置顶该项目标签', MESSAGE_DURATION_TIME)
            }
          }
        })
      }else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * deleteBoardTag({ payload }, { select, call, put }) { //
      let res = yield call(deleteBoardTag, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getBoardTagList',
          payload: {
            board_id,
            calback: function () {
              message.success('已成功删除该项目标签', MESSAGE_DURATION_TIME)
            }
          }
        })
      }else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    //任务---end

    //评论---start
    * getCardCommentList({ payload }, { select, call, put }) { //
      const { id } = payload
      yield put({
        type: 'updateDatas',
        payload: {
          cardCommentList: []
        }
      })
      let res = yield call(getCardCommentList, id)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
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
            payload: {
              cardCommentList: res.data
            }
          })
        }else{
        }
      }else{
      }
    },

    * deleteCardNewComment({ payload }, { select, call, put }) { //
      const res = yield call(deleteCardNewComment, payload)
      if(isApiResponseOk(res)) {
        const { card_id } = payload
        const res = yield call(getCardCommentList, card_id)
        if(isApiResponseOk(res)) {
          yield put({
            type: 'updateDatas',
            payload: {
              cardCommentList: res.data
            }
          })
        }else{
        }
      }else{
        message.warn(res.message)
      }
    },

    * listenWsCardNewComment({ payload }, { select, call, put }) { //
      const { newsData } = payload
      const id = newsData.activityTypeId
      const newsUserId = newsData.userId
      const currentUserId = JSON.parse(Cookies.get('userInfo')).id
      const drawContent = yield select(selectDrawContent)
      const drawerVisible = yield select(selectDrawerVisible)
      const { card_id } = drawContent
      // 当且仅当发送消息的用户不是当前用户， 当前查看的任务id和推送的任务id一样,抽屉可见
      if(id === card_id && newsUserId !== currentUserId && drawerVisible) {
        let res = yield call(getCardCommentList, id)
        if(isApiResponseOk(res)) {
          yield put({
            type: 'updateDatas',
            payload: {
              cardCommentList: res.data
            }
          })
        }else{
        }
      }
    },

    //评论--end

  },

  reducers: {
    updateDatas(state, action) {
      console.log('sss',1111)
      return {
        ...state,
        datas: { ...state.datas, ...action.payload },
      }
    }
  },
});
