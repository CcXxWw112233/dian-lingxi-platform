// 通知提醒的数据
import { getTriggerList } from '@/services/technological/informRemind'
import { isApiResponseOk } from '@/utils/handleResponseData'
import { message } from 'antd';
import { getInfoSelect } from './select'


export default {
    namespace: 'informRemind',
    state: {
      is_history: true,
      triggerList: [], // 每个对应的选项列表
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
  