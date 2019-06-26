import { 
  getHotTabs, 
  getHotArticles, 
  getHighRiseArticles, 
  getAuthorityArticles, 
  getDataBase,
  getDataBaseDetail, 
  getAreas,
  getHeaderSearch,
  getCommonArticlesList,
} from '@/services/technological/xczNews'

import { getSelectState } from './select'
import { isApiResponseOk } from '@/utils/handleResponseData'
import { message } from 'antd';

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
    dataBaseDetail: [], // 资料库详情的数据
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
    page_size: 10, // 默认显示10条
    page_no: 1,  // 默认第一页
    defaultObj: {}, // 默认的空对象
    defaultArr: [], // 默认的空数组
    is_onscroll_do_paging: true, // 防抖 true可以滚动加载，false不能滚动加载
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        // message.destroy()
        path = location.pathname
        dispatch({
          type: 'updateDatas',
          payload: {
            page_no: 1,
            defaultArr: [],
            searchList: [],
          }
        })
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
            type: "getHotArticles",
            payload: {
              
            }
          }),
          dispatch({
            type: "updateDatas",
            payload: {
              articlesList: [],
              searchList: {},
              defaultArr: [],
              onSearchButton: false,  // 判断是否点击搜索
              hotFlag: true, // 热点的开关
              highRiseFlag: true,
              authorityFlag: true, // 权威的开关
              dataBaseFlag: true, // 资料库的开关
              page_no: 1
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
            type: "updateDatas",
            payload: {
              articlesList: [],
              searchList: [],
              defaultArr: [],
              onSearchButton: false,  // 判断是否点击搜索
              hotFlag: true, // 热点的开关
              highRiseFlag: true,
              authorityFlag: true, // 权威的开关
              dataBaseFlag: true, // 资料库的开关
              page_no: 1,
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
            type: "updateDatas",
            payload: {
              articlesList: [],
              searchList: [],
              defaultArr: [],
              onSearchButton: false,  // 判断是否点击搜索
              hotFlag: true, // 热点的开关
              highRiseFlag: true,
              authorityFlag: true, // 权威的开关
              dataBaseFlag: true, // 资料库的开关
              page_no: 1,
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
            type: "getDataBaseArticlesList",
            payload: {

            }
          }),
          dispatch({
            type: "getDataBaseDetail",
            payload: {

            }
          })
          dispatch({
            type: "updateDatas",
            payload: {
              articlesList: [],
              searchList: [],
              defaultArr: [],
              onSearchButton: false,  // 判断是否点击搜索
              hotFlag: true, // 热点的开关
              highRiseFlag: true,
              authorityFlag: true, // 权威的开关
              dataBaseFlag: true, // 资料库的开关
              page_no: 1,
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
      if(!isApiResponseOk(res)) {
        message.error(res.message)
        return
      }
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
      if(!isApiResponseOk(res)) {
        message.error(res.message)
        return
      }
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
      if(!isApiResponseOk(res)) {
        message.error(res.message)
        return
      }
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
      if(!isApiResponseOk(res)) {
        message.error(res.message)
        return
      }
      // console.log(res)
      yield put({
        type: 'updateDatas',
        payload: {
          dataBase: res.data
        }
      })
    },

    // 获取资料库详情的数据
    * getDataBaseDetail({ payload = {} }, { select, call, put }) {
      const searchList = yield select((state) => getSelectState(state, 'searchList'))
      const category_ids = yield select((state) => getSelectState(state, 'category_ids'))
      const page_size = yield select((state) => getSelectState(state, 'page_size'))
      const page_no = yield select((state) => getSelectState(state, 'page_no'))
      const params = {
        category_ids, page_size, page_no
      }
      if(searchList && searchList.length) return
      const res = yield call(getDataBaseDetail, {...params, ...payload});
      if(!isApiResponseOk(res)) {
        message.error(res.message)
        return
      }
      // console.log(res)
      yield put({
        type: 'updateDatas',
        payload: {
          dataBaseDetail: res.data
        }
      })
    },

    // 获取地区的城市列表
    * getAreas({ payload = {} }, { select, call, put }) {
      const res = yield call(getAreas, {...payload});
      if(!isApiResponseOk(res)) {
        message.error(res.message)
        return
      }
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
      const hotspot_id = yield select((state) => getSelectState(state, 'hotspot_id'))
      const keywords = yield select((state) => getSelectState(state, 'inputValue'))
      const page_size = yield select((state) => getSelectState(state, 'page_size'))
      const page_no = yield select((state) => getSelectState(state, 'page_no'))
      const defaultArr = yield select((state) => getSelectState(state, 'defaultArr'))
      
      const params = {
        category_ids,keywords, page_size, page_no
      }
      if(path.indexOf('/technological/xczNews/hot') != -1) {
        params.hotspot_id = hotspot_id
      }
      if(searchList && searchList.length) return
      const res = yield call(getHeaderSearch, {...params, ...payload})
      if(!isApiResponseOk(res)) {
        message.error(res.message)
        return
      }
      const aaa = [].concat(defaultArr, res.data.records)
      // console.log('sssss',aaa)
      // console.log(res.data.records.length)
      yield put({
        type: 'updateDatas',
        payload: {
          searchList: res.data,
          contentVal: keywords,
          defaultArr: aaa
          // is_onscroll_do_paging: res.data.records.length < page_size ? false: true
        }
      })

      const delay = (ms) => new Promise(resolve => {
        setTimeout(resolve, ms)
      })
      yield call(delay, 500)
      yield put({
        type: 'updateDatas',
        payload: {
          is_onscroll_do_paging: res.data.records.length < page_size ? false: true
        }
      })

    },

    // 获取所有的文章列表
    * getCommonArticlesList({ payload = {} }, { select, call, put }) {
      const searchList = yield select((state) => getSelectState(state, 'searchList'))
      if(searchList && searchList.length) return
      const res = yield call(getCommonArticlesList)
      if(!isApiResponseOk(res)) {
        message.error(res.message)
        return
      }
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
