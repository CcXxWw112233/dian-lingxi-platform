import { getCardDetail, completeTask, updateTask, addTaskExecutor, removeTaskExecutor, deleteTask, addChirldTask, deleteChirldTask, boardAppRelaMiletones, 
  boardAppCancelRelaMiletones, getBoardTagList, addTaskTag, removeTaskTag } from '../../../services/technological/task'
import { isApiResponseOk } from '../../../utils/handleResponseData'
import { message } from 'antd'
import { currentNounPlanFilterName } from "../../../utils/businessFunction";
import { MESSAGE_DURATION_TIME, TASKS } from "../../../globalset/js/constant";
import QueryString from 'querystring'

let board_id = null
let appsSelectKey = null
let card_id = null
export default {
  namespace: 'publicTaskDetailModal',
  state: {
    is_edit_title: false, // 是否编辑标题 默认为 false 不显示
    is_show_principal: false, // 是否显示负责人 默认为 false 不显示
    is_selected_all: false, // 是否全选 需要后台支持
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname.indexOf('/technological/projectDetail') !== -1) {
          const param = QueryString.parse(location.search.replace('?', ''))
          board_id = param.board_id
          appsSelectKey = param.appsSelectKey
          card_id = param.card_id
          if (appsSelectKey == '3') {
            dispatch({
              type: 'updateDatas',
              payload: {
                card_id
              }
            })
            // 调用分组列表
            dispatch({
              type: 'projectDetailTask/getProjectGoupList',
              payload: {
              }
            })
            if (card_id) {
              dispatch({
                type: 'projectDetailTask/getTaskGroupListByUrl', //'getTaskGroupList',
                payload: {
                  type: '2',
                  board_id: board_id,
                  arrange_type: '1'
                }
              })
              dispatch({
                type: 'updateDatas',
                payload: {
                  drawerVisible: true
                }
              })
            } else {
              dispatch({
                type: 'projectDetailTask/getTaskGroupList',
                payload: {
                  type: '2',
                  board_id: board_id,
                  arrange_type: '1'
                }
              })
            }
          }
        }
      })
    },
  },
  effects: {
    /**
     * 获取任务详情: 需要参数当前任务id
     * @param {String} id 当前任务的id 
     */
    * getCardDetail({ payload }, { call, put }) {
      const { id, calback } = payload
      let res = yield call(getCardDetail, { id })
      if (isApiResponseOk(res)) {
        calback && typeof calback == 'function' ? calback() : ''
        yield put({
          type: 'updateDatas',
          payload: {
            // drawerVisible: true,
            drawContent: res.data,
          }
        })
        // 成功后调用 projectDetailInfo, 将项目成员关联进来
        yield put({
          type: 'projectDetail/projectDetailInfo',
          payload: {
            id: res.data.board_id
          }
        })
        // 调用查询标签列表
        // yield put({
        //   type: 'getBoardTagList',
        //   payload: {
        //     board_id: res.data.board_id
        //   }
        // })
      }
    },
    // 获取项目标签
    * getBoardTagList({ payload }, { call, put }) {
      const { board_id } = payload
      let res = yield call(getBoardTagList, { board_id })
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            boardTagList: res.data
          }
        })
      } else {
        message.warn(res.message)
      }
    },


    /**
     * 设置完成任务: 需要参数 is_realize
     * @param {String} is_realize 是否完成 0 未完成 1 已完成
     */
    * completeTask({ payload }, { call, put }) { //
      const { is_realize, card_id, board_id } = payload
      let res = yield call(completeTask, { is_realize, card_id })
      if (isApiResponseOk(res)) {
        yield put({
          type: 'projectDetail/projectDetailInfo',
          payload: {
            id: board_id,
            calback: function () {
              // const remind_message_str = res.data && res.data.remind_code !=  '0'? `${res.data.error_msg}`: ''
              if (res.data && res.data.remind_code != '0') { //通知提醒专用
                const remind_message_str = `，${res.data.error_msg}`
                message.warn(is_realize === '1' ? `已完成该${currentNounPlanFilterName(TASKS)}${remind_message_str}` :
                  `已将该${currentNounPlanFilterName(TASKS)}设置未完成${remind_message_str}`, MESSAGE_DURATION_TIME)
              } else {
                message.success(is_realize === '1' ? `已完成该${currentNounPlanFilterName(TASKS)}` :
                  `已将该${currentNounPlanFilterName(TASKS)}设置未完成`, MESSAGE_DURATION_TIME)
              }
            }
          }
        })

      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
      return res || {}
    },
    /**
     * 更新任务:
     * @param {String} card_id* 当前修改那一条的卡片id
     * 修改卡片名称: @param {String} name 修改的卡片名称
     * 编辑描述: @param {String} description 描述内容
     * 设置开始时间: @param {String} start_time 时间戳
     * 设置结束时间: @param {String} due_time 时间戳
     */
    * updateTask({ payload }, { call }) {
      const { updateObj } = payload
      let res = yield call(updateTask, updateObj)
      if (isApiResponseOk(res)) {
        if (res.data && res.data.remind_code != '0') { //通知提醒专用
          message.warn(`更新成功，${res.data.error_msg}`, MESSAGE_DURATION_TIME)
        } else {
          message.success('更新成功', MESSAGE_DURATION_TIME)
        }
      } else {
        message.error(res.message, MESSAGE_DURATION_TIME)
      }
      return res || {}
    },
    // 添加任务执行人
    * addTaskExecutor({ payload }, { call, put }) {
      let res = yield call(addTaskExecutor, payload)
      if (isApiResponseOk(res)) {
        message.success(`已成功设置执行人`, MESSAGE_DURATION_TIME)
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    // 移除任务执行人
    * removeTaskExecutor({ payload }, { select, call, put }) { //
      const { card_id, executor } = payload
      let res = yield call(removeTaskExecutor, { card_id, executor })
      if (isApiResponseOk(res)) {
        message.success(`已成功删除执行人`, MESSAGE_DURATION_TIME)
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    // 删除卡片
    * deleteTask({ payload }, { select, call, put }) { //
      const { id, calback } = payload
      let res = yield call(deleteTask, id)
      if (isApiResponseOk(res)) {
        calback && typeof calback == 'function' ? calback() : ''
        message.success('删除成功', MESSAGE_DURATION_TIME)
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    // 添加子任务
    * addChirldTask({ payload }, { select, call, put }) { //
      let newPayload = { ...payload }
      newPayload.executors ? delete newPayload.executors : '' //去掉不需要的数据
      let res = yield call(addChirldTask, newPayload)
      if (isApiResponseOk(res)) {
        message.success(`添加成功`, MESSAGE_DURATION_TIME)
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
      return res || {}
    },
    // 删除子任务
    * deleteChirldTask({ payload }, { select, call, put }) { //
      const { card_id } = payload
      let res = yield call(deleteTask, card_id)
      if (isApiResponseOk(res)) {
        message.success('删除成功', MESSAGE_DURATION_TIME)
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
      return res || {}
    },
    // 加入里程碑
    * joinMilestone({ payload }, { select, call, put }) {
      let res = yield call(boardAppRelaMiletones, payload)
      if (isApiResponseOk(res)) {
        message.success(`更新成功`, MESSAGE_DURATION_TIME)
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    //移除里程碑
    * shiftOutMilestone({ payload }, { select, call, put }) {
      let res = yield call(boardAppCancelRelaMiletones, payload)
      if (isApiResponseOk(res)) {
        message.success(`更新成功`, MESSAGE_DURATION_TIME)
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    //更新里程本
    * updateMilestone({ payload }, { select, call, put }) {
      const {removeParams, addParams} = payload;
      let res = yield call(boardAppCancelRelaMiletones, removeParams)
      if (isApiResponseOk(res)) {
        let res2 = yield call(boardAppRelaMiletones, addParams)
        if (isApiResponseOk(res2)) {
          message.success(`更新成功`, MESSAGE_DURATION_TIME)
        } else {
          message.warn(res2.message, MESSAGE_DURATION_TIME)
        }
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
  },
  reducers: {
    updateDatas(state, action) {
      return {
        ...state, ...action.payload
      }
    }
  }
}