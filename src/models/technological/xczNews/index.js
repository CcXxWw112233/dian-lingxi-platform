import { getHeaderTabs, getHotTabs } from '@/services/technological/xczNews'

export default {
  namespace: 'xczNews',
  state: {
    topTabs: [], // 顶部的导航
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
        if (location.pathname.indexOf('/technological/xczNews/hot') != -1) {
          dispatch({
            type: "getHotTabs",
            payload: {
              
            }
          })
        }
      })
    },
  },
  effects: {
    // 获取顶部信息
    * getHeaderTabs({ payload = {} }, { select, call, put }) {
      // console.log(111111111111)
      const res = yield call(getHeaderTabs, {})
      // console.log('2222',res)
      yield put({
          type: 'updateDatas',
          payload: {
            topTabs: res.tabs
          }
      })
    },
    // 获取热点tabs
    * getHotTabs({ payload = {} }, { select, call, put }) {
      console.log(payload)
      console.log(2222222)
      const res = yield call(getHotTabs, {})
      console.log(res)
      yield put({
        type: 'updateDatas',
        payload: {
          hotTabs: res.data
        }
      })
    }
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
