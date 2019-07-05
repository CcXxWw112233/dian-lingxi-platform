// 通知提醒的数据
import { getTriggerList, getTriggerHistory, setRemindInformation } from '@/services/technological/informRemind'
import { isApiResponseOk } from '@/utils/handleResponseData'
import { message } from 'antd';
import { getModelSelectState } from '@/models/utils'


export default {
    namespace: 'informRemind',
    state: {
      diff_remind_time: [
        { remind_time_value: 1 },
        { remind_time_value: 2 },
        { remind_time_value: 3 },
        { remind_time_value: 4 },
        { remind_time_value: 5 },
        { remind_time_value: 6 },
        { remind_time_value: 7 },
        { remind_time_value: 8 },
        { remind_time_value: 9 },
        { remind_time_value: 10 },
      ], // 1-60不同的时间段
      diff_text_term: [
        { remind_time_type: 'm', txtVal: '分钟' },
        { remind_time_type: 'h', txtVal: '小时' },
        { remind_time_type: 'd', txtVal: '天数' },
      ], // 匹配不同的字段类型
      defaultTriggerVal: '', // 默认任务事件的选择框value
      defaultRemindTimeVal: '1', // 默认选择时间的value
      defaultTextTermVal: 'm', // 默认选择不同字段的value
      is_history: false, // 是否存在历史记录的列表 默认为 false 不存在
      historyList: [], // 保存设置的历史记录提醒
      triggerList: [], // 每个对应的选项的类型列表
      currentId: '', // 当前列表的id,
      is_edit_status: 0, // 是否是在编辑状态 默认为 0 不可编辑 , 1 为可以编辑
      is_add_remind: false, // 是否进行点击操作 默认为 false 没有点击
      is_overdue_time: false, // 是否是过期时间 默认为 false 没有过期以及是正常事件
      is_notified_time: false, // 是否已经通知过了 默认为 false 没有通知
      is_icon_status: '', // 事件显示小图标的状态
      rela_id: '', // 事件类型的ID
      rela_type: '', // 事件的类型
      remind_time_type: '', // 提醒的时间类型 m,h,d,datetime
      remind_time_value: '', // 提醒的时间值
      remind_trigger: '', // 提醒的触发器类型
      users: ["1146245951040655360"], // 用户信息
    },

    subscriptions: {
      setup({ dispatch, history }) {
        history.listen((location) => {
         dispatch({
           type: 'updateDatas', 
           payload: {
            triggerList: [],
           }
         })
        })
    
      }
    },

    effects: {

      // 获取事件类型列表的方法
      * getTriggerList({ payload = {} }, { select, call, put }) {
        const { rela_type } = payload
        const res = yield call(getTriggerList, rela_type)
        if(!isApiResponseOk(res)) {
          message.error(res.message)
          return
        }
        yield put({
          type: 'updateDatas',
          payload: {
            triggerList: res.data,
          }
        })
      },

      // 获取是否存在历史记录的方法
      * getTriggerHistory({ payload = {} }, { select, call, put }) {
        const { rela_id } = payload
        const res = yield call(getTriggerHistory, rela_id)
        if(!isApiResponseOk(res)) {
          message.error(res.message)
          return
        }
        yield put({
          type: 'updateDatas',
          payload: {
            historyList: res.data, // 将结果赋值给一个列表
            is_history: res.data && res.data.length ? true : false,
          }
        })
      },


    },
    
    reducers: {
      updateDatas(state, action) {
      // console.log(state, action)
        return {
          ...state, ...action.payload
          // datas: { ...state.datas, ...action.payload },
        }
      }
    },
  }
  