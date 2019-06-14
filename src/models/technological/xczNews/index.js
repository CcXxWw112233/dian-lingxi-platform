import { getHeaderTabs, getHotTabs, getHotArticles, getHighRiseArticles, getAuthorityArticles, getDataBase } from '@/services/technological/xczNews'

export default {
  namespace: 'xczNews',
  state: {
    topTabs: [], // 顶部的导航
    hotArticlesList: [], // 获取热点文章列表信息
    hotTabs: [], // 热点的tabs列表,
    highRiseArticlesList: [], // 高层的文章列表信息
    authorityArticlesList: [], // 权威的文章列表信息
    dataBase: [], // 资料库的数据
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        // message.destroy()
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
          }),
          dispatch({
            type: "getHotArticles",
            payload: {
             
            }
          })
        }
        if (location.pathname.indexOf('/technological/xczNews/highRise') != -1) {
          dispatch({
            type: "getHighRiseArticles",
            payload: {
              
            }
          })
        }
        if (location.pathname.indexOf('/technological/xczNews/authority') != -1) {
          dispatch({
            type: "getAuthorityArticles",
            payload: {
              
            }
          })
        }
        if (location.pathname.indexOf('/technological/xczNews/dataBase') != -1) {
          dispatch({
            type: "getDataBase",
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
      // console.log(payload, 'payload.....')
      // console.log(2222222)
      const res = yield call(getHotTabs, {...payload})
      // console.log(res, 'res-----')
      yield put({
        type: 'updateDatas',
        payload: {
          hotTabs: res.data
        }
      })
    },

    // 获取热点文章
    * getHotArticles({ payload = {} }, { select, call, put }) {
      const res = yield call(getHotArticles, {...payload});
      // console.log(res,'======')
      yield put({
        type: 'updateDatas',
        payload: {
          hotArticlesList: res.data
        }
      })
    },

    // 获取高层的文章
    * getHighRiseArticles({ payload = {} }, { select, call, put }) {
      const res = yield call(getHighRiseArticles, {...payload});
      // console.log(res)
      yield put({
        type: 'updateDatas',
        payload: {
          highRiseArticlesList: res.data
        }
      })
    },

    // 获取权威的文章
    * getAuthorityArticles({ payload = {} }, { select, call, put }) {
      const res = yield call(getAuthorityArticles, {...payload});
      // console.log(res)
      yield put({
        type: 'updateDatas',
        payload: {
          authorityArticlesList: res.data
        }
      })
    },

    // 获取资料库的数据
    * getDataBase({ payload = {} }, { select, call, put }) {
      const res = yield call(getDataBase, {...payload});
      console.log(res)
      yield put({
        type: 'updateDatas',
        payload: {
          dataBase: res.data
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
