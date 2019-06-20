import { 
  getHeaderTabs, 
  getHotTabs, 
  getHotArticles, 
  getHighRiseArticles, 
  getAuthorityArticles, 
  getDataBase, 
  getAreas,
  getHeaderSearch,
  getCommonArticlesList,
} from '@/services/technological/xczNews'

import { getSelectState } from './select'

let path = '/technological/xczNews'

export default {
  namespace: 'xczNews',
  state: {
    // topTabs: [], // 顶部的导航
    articlesList: [], // 所有的公用文章列表
    // hotArticlesList: [], // 获取热点文章列表信息
    hotTabs: [], // 热点的tabs列表,
    category_ids: '', // 当前点击热点的title的id 政策...
    hotspot_id: '', // 当前热点点击的id 城市设计...
    // highRiseArticlesList: [], // 高层的文章列表信息
    // authorityArticlesList: [], // 权威的文章列表信息
    dataBase: [], // 资料库的数据
    dataBaseArticlesList: [], //资料库的文章列表
    cityList: [], // 地区的城市列表
    searchList: {}, // 全局搜索的列表
    inputValue: '', // 搜索框的内容
    contentVal: '', // 文本的value值,
    onSearchButton: false,  // 判断是否点击搜索
    moreFlag: true, // 更多的开关
    hotFlag: true, // 热点的开关
    highRiseFlag: true, // 高层的开关
    authorityFlag: true, // 权威的开关
    dataBaseFlag: true, // 资料库的开关
    total: 10, // 默认文章的总数
    page_size: 10,
    page_no: 1,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        // message.destroy()
        path = location.pathname
        if (location.pathname.indexOf('/technological/xczNews') != -1) {
          dispatch({
            type: "updateDatas",
            payload: {
              articlesList: [],
              searchList: {}
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
            type: "getHeaderSearch",
            payload: {
              flag: 1,
            }
          }),
          dispatch({
            type: "getHotArticles",
            payload: {
              
            }
          }),
          dispatch({
            type: "updateDatas",
            payload: {
              articlesList: [],
              onSearchButton: false,  // 判断是否点击搜索
              hotFlag: true, // 热点的开关
              highRiseFlag: true,
              authorityFlag: true, // 权威的开关
              dataBaseFlag: true, // 资料库的开关
            }
          })
        }
        if (location.pathname.indexOf('/technological/xczNews/highRise') != -1) {
          dispatch({
            type: "getHighRiseArticles",
            payload: {
              
            }
          }),
          dispatch({
            type: "getHeaderSearch",
            payload: {
              flag: 2,
            }
          }),
          dispatch({
            type: "updateDatas",
            payload: {
              articlesList: [],
              onSearchButton: false,  // 判断是否点击搜索
              hotFlag: true, // 热点的开关
              highRiseFlag: true,
              authorityFlag: true, // 权威的开关
              dataBaseFlag: true, // 资料库的开关
            }
          })
        }
        if (location.pathname.indexOf('/technological/xczNews/authority') != -1) {
          dispatch({
            type: "getAuthorityArticles",
            payload: {
              
            }
          }),
          dispatch({
            type: "getHeaderSearch",
            payload: {
              flag: 3,
            }
          }),
          dispatch({
            type: "updateDatas",
            payload: {
              articlesList: [],
              onSearchButton: false,  // 判断是否点击搜索
              hotFlag: true, // 热点的开关
              highRiseFlag: true,
              authorityFlag: true, // 权威的开关
              dataBaseFlag: true, // 资料库的开关
            }
          })
        }
        if (location.pathname.indexOf('/technological/xczNews/dataBase') != -1) {
          dispatch({
            type: "getDataBase",
            payload: {
              
            }
          }),
          dispatch({
            type: "getHeaderSearch",
            payload: {
              flag: 5,
            }
          }),
          dispatch({
            type: "getDataBaseArticlesList",
            payload: {

            }
          })
          dispatch({
            type: "updateDatas",
            payload: {
              articlesList: [],
              onSearchButton: false,  // 判断是否点击搜索
              hotFlag: true, // 热点的开关
              highRiseFlag: true,
              authorityFlag: true, // 权威的开关
              dataBaseFlag: true, // 资料库的开关
            }
          })
        }
        if (location.pathname.indexOf('/technological/xczNews/area') != -1) {
          dispatch({
            type: "getAreas",
            payload: {

            }
          }),
          dispatch({
            type: "updateDatas",
            payload: {
              articlesList: []
            }
          })
        }
      })
    },
  },
  effects: { 
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
          articlesList: res.data
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
          articlesList: res.data
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
          articlesList: res.data
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

    // 获取地区的城市列表
    * getAreas({ payload = {} }, { select, call, put }) {
      const res = yield call(getAreas, {...payload});
      // console.log(res)
      yield put({
        type: 'updateDatas',
        payload: {
          cityList: res.data
        }
      })
    },

    // 顶部的全局搜索
    * getHeaderSearch({ payload = {} }, { select, call, put }) {
      const searchList = yield select((state) => getSelectState(state, 'searchList'))
      const category_ids = yield select((state) => getSelectState(state, 'category_ids'))
      const keywords = yield select((state) => getSelectState(state, 'inputValue'))
      const page_size = yield select((state) => getSelectState(state, 'page_size'))
      const page_no = yield select((state) => getSelectState(state, 'page_no'))
      const params = {
        category_ids,keywords, page_size, page_no
      }
      if(searchList && searchList.length) return
      const res = yield call(getHeaderSearch, {...params, ...payload})
      console.log(payload)
      yield put({
        type: 'updateDatas',
        payload: {
          searchList: res.data,
          contentVal: keywords,
        }
      })
    },

    // 获取所有的文章列表
    * getCommonArticlesList({ payload = {} }, { select, call, put }) {
      const searchList = yield select((state) => getSelectState(state, 'searchList'))
      const page_size = yield select((state) => getSelectState(state, 'page_size'))
      const page_no = yield select((state) => getSelectState(state, 'page_no'))
      const params = {
        page_size, page_no
      }
      if(searchList && searchList.length) return
      const res = yield call(getCommonArticlesList, {...params, ...payload})
      // console.log(res)
      yield put({
        type: 'updateDatas',
        payload: {
          searchList: res.data
        },
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
