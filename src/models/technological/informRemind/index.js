// 通知提醒的数据
import { getTriggerList, getTriggerHistory, setRemindInformation } from '@/services/technological/informRemind'
import { isApiResponseOk } from '@/utils/handleResponseData'
import { message } from 'antd';
import { getModelSelectState } from '@/models/utils'


export default {
    namespace: 'informRemind',
    state: {
      defaultTriggerVal: '', // 默认任务事件的选择框value
      defaultRemindTimeVal: '1', // 默认选择时间的value
      defaultTextTermVal: 'm', // 默认选择不同字段的value
      is_history: false, // 是否存在历史记录的列表 默认为 false 不存在
      historyList: [], // 保存设置的历史记录提醒
      triggerList: [], // 每个对应的选项的类型列表
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
            remind_trigger: '',
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
            defaultTriggerVal: res.data && res.data[0].type_code,
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
            // is_history: true,
            is_icon_status: res.data && res.data.length && res.data[0].status, // 将获取的列表状态赋值给对应的内容
            historyList: res.data,
            defaultTriggerVal: res.data[0].remind_trigger,
            defaultRemindTimeVal: res.data[0].remind_time_value,
            defaultTextTermVal: res.data[0].remind_time_type,
          }
        })
      },

      // 设置通知提醒的事件
      * setRemindInformation({ payload = {} }, { select, call, put }) {
        console.log(11111)
        const rela_id = yield select(getModelSelectState('informRemind', 'rela_id'))
        const rela_type = yield select(getModelSelectState('informRemind', 'rela_type'))
        const remind_time_type = yield select(getModelSelectState('informRemind', 'remind_time_type'))
        const remind_time_value = yield select(getModelSelectState('informRemind', 'remind_time_value'))
        const remind_trigger = yield select(getModelSelectState('informRemind', 'remind_trigger'))
        const users = yield select(getModelSelectState('informRemind', 'users'))
        const remindParam = {
          rela_id,
          rela_type,
          remind_time_type,
          remind_time_value,
          remind_trigger,
          users
        }
        console.log(remindParam, 'lll')
        const res = yield call(setRemindInformation, {...remindParam})
        if(!isApiResponseOk(res)) {
          message.error(res.message)
          return
        }
        console.log(res)
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
  