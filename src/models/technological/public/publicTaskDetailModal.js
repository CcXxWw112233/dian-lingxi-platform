import { getCardDetail, completeTask, updateTask, addTaskExecutor, removeTaskExecutor } from '../../../services/technological/task'
import { isApiResponseOk } from '../../../utils/handleResponseData'
import { message } from 'antd'
import { currentNounPlanFilterName } from "../../../utils/businessFunction";
import { MEMBERS, MESSAGE_DURATION_TIME, PROJECTS, TASKS } from "../../../globalset/js/constant";
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
      })
    },
  },
  effects: {
    /**
     * 获取任务详情: 需要参数当前任务id
     * @param {String} id 当前任务的id 
     */
    * getCardDetail({ payload }, { call, put }) {
      const { id } = payload
      let res = yield call(getCardDetail,{ id })
      if (isApiResponseOk(res)) {
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
      const { card_id, user_id } = payload
      let res = yield call(removeTaskExecutor, { card_id, user_id })
      if (isApiResponseOk(res)) {
        message.success(`已成功删除执行人`, MESSAGE_DURATION_TIME)
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