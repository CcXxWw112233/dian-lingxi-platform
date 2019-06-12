import { getHeaderTabs } from '@/services/technological/xczNews'

export default {
  namespace: 'xczNews',
  state: {
    topTabs: [], // 顶部的导航，用来做实验的
    commonList: [], // 获取列表信息
    hotTabs: [], // 热点的tabs列表
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        // message.destroy()
        // console.log(location)
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
    // 用来测试的：获取顶部信息
    * getHeaderTabs({ payload = {} }, { select, call, put }) {
      console.log(111111111111)
      const res = yield call(getHeaderTabs, {})
      // console.log('2222',res)
      yield put({
          type: 'updateDatas',
          payload: {
            topTabs: res.tabs
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
