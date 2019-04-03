import { getUSerInfo, logout, getGlobalSearchTypeList, getGlobalSearchResultList } from '../../../services/technological'
import { selectSearchTypeList, selectDefaultSearchType, selectAllTypeResultList, selectPageNumber, selectPageSize, selectSigleTypeResultList, selectSearchInputValue } from './select'
import { isApiResponseOk } from '../../../utils/handleResponseData'
import { message } from 'antd'
import {MEMBERS, MESSAGE_DURATION_TIME, ORGANIZATION} from "../../../globalset/js/constant";
import { selectProjectDetailBoardId } from '../select'
import { routerRedux } from "dva/router";

export default {
  namespace: 'globalSearch',
  state: {
    datas: {
      globalSearchModalVisible: false,
      searchTypeList: [], //查询类型列表
      defaultSearchType: '', //默认类型
      allTypeResultList: [], //全部类型列表
      sigleTypeResultList: [], //单个类型列表
      searchInputValue: '', //输入框的值
      page_number: 1,
      page_size: 10,
      scrollBlock: true, //滚动锁
      loadMoreDisplay: 'block',
      loadMoreTextType: '1', //加载的文案 1暂无更多数据 2加载中 3加载更多
      spinning: false,
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        function onkeyDown(event) {
          const e = event || window.event || arguments.callee.caller.arguments[0];
          const target = e.target
          let hash = window.location.hash
          if (hash.indexOf('?') !== -1) {
            hash = hash.split('?')[0]
          }
          const fiterTargetArray = ['input', 'textarea']
          if (e && e.keyCode == 83 && fiterTargetArray.indexOf(target.nodeName.toLowerCase()) == -1 && target.getAttribute('role') != 'textbox' && hash.indexOf('/technological') != -1) {
            dispatch({
              type: 'updateDatas',
              payload: {
                globalSearchModalVisible: true
              }
            })
          }
        }
        if (location.pathname.indexOf('/technological') !== -1) {
          window.addEventListener("keydown", onkeyDown, false);
        }else {

        }
      })
    },
  },
  effects: {

    * getGlobalSearchTypeList({ payload = {} }, { call, put, select }) {
      const res = yield call(getGlobalSearchTypeList, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            searchTypeList: res.data,
            defaultSearchType: res.data && typeof res.data[0] == 'object' ? res.data[0]['search_type']: ''
          }
        })
        // debugger
      } else {
        message.error(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * getGlobalSearchResultList({ payload }, { call, put, select }) {
      const defaultSearchType = yield select(selectDefaultSearchType) || 1
      const searchInputValue = yield select(selectSearchInputValue)
      const page_number = yield select(selectPageNumber)
      const page_size = yield select(selectPageSize)

      if(!!!searchInputValue) {
        return false
      }
      const obj = {
        search_term: searchInputValue,
        search_type: defaultSearchType,
        page_size: defaultSearchType == '1' ? 5 : page_size,
        page_number,
        ...payload,
      }
      yield put({
        type: 'updateDatas',
        payload: {
          loadMoreTextType: '2',
          spinning: true
        }
      })
      const res = yield call(getGlobalSearchResultList, obj)
      yield put({
        type: 'updateDatas',
        payload: {
          spinning: false
        }
      })
      if(isApiResponseOk(res)) {
        const data = res.data
        if(defaultSearchType == '1') {
          let arr = []
          for(let i in data) {
            const obj = {
              listType: i,
              lists: data[i],
            }
            arr.push(obj)
          }
          yield put({
            type: 'updateDatas',
            payload: {
              allTypeResultList: arr
            }
          })
        } else {
          const sigleTypeResultList = yield select(selectSigleTypeResultList)
          const page_number = yield select(selectPageNumber)
          let arr = []
          let list = []

          if(page_number == 1) {
            for(let i in data) {
              const obj = {
                listType: i,
                lists: data[i],
              }
              arr.push(obj)
              list = data[i]
            }
          } else {
            arr = [...sigleTypeResultList]
            for(let i in data) {
              const arr_list = [].concat(arr[0]['lists'], data[i])
              arr[0]['lists'] = arr_list
              list = data[i]
            }
          }

          yield put({
            type: 'updateDatas',
            payload: {
              sigleTypeResultList: arr,
              scrollBlock: !(list.length < page_size),
              loadMoreTextType: (list.length < page_size)?'1': '3',
            }
          })
        }
      } else {
        message.error(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * routingJump({ payload }, { call, put }) {
      const { route } = payload
      yield put(routerRedux.push(route));
    },

  },

  reducers: {
    updateDatas(state, action) {
      return {
        ...state,
        datas: { ...state.datas, ...action.payload },
      }
    }
  },
};
