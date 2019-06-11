import { getHeaderTabs } from '@/services/technological/xczNews'
import { isApiResponseOk } from '@/utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME } from "@/globalset/js/constant";

export default {
  namespace: 'xczNews',
  state: {
    topTabs: []
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        // message.destroy()
        console.log(location)
        if (location.pathname.indexOf('/technological/xczNews') != -1) {
          dispatch({
            type: 'getHeaderTabs',
            payload: {

            }
          })
        }
      })
    },
  },
  effects: {
    * getHeaderTabs({ payload = {} }, { select, call, put }) {
      console.log(111111111111)
      const res = yield call(getHeaderTabs, {})
      console.log('2222',res)
      yield put({
          type: 'updateDatas',
          payload: {
            topTabs: res.tabs
          }
      })
      // const { calback } = payload
      // if(calback && typeof calback === 'function') {
      //   calback()
      // }
      // if(isApiResponseOk(res)) {
      //   console.log(res)
      //   yield put({
      //     type: 'updateDatas',
      //     payload: {
      //       topTabs: res.data
      //     }
      //   })
      // }else{
      //   message.warn(res.message, MESSAGE_DURATION_TIME)
      // }
    },

  },

  reducers: {
    updateDatas(state, action) {
      console.log(state, action)
      return {
        ...state, ...action.payload
        // datas: { ...state.datas, ...action.payload },
      }
    }
  },
}
