import { getUSerInfo, logout, getGlobalSearchTypeList, getGlobalSearchResultList } from '../../../services/technological'
import { selectSearchTypeList, selectDefaultSearchType, selectAllTypeResultList, selectSigleTypeResultList, selectSearchInputValue } from './select'
import { isApiResponseOk } from '../../../utils/handleResponseData'
import { message } from 'antd'
import {MEMBERS, MESSAGE_DURATION_TIME, ORGANIZATION} from "../../../globalset/js/constant";
import { routerRedux } from "dva/router";

export default {
  namespace: 'globalSearch',
  state: {
    datas: {
      searchTypeList: [], //查询类型列表
      defaultSearchType: '', //默认类型
      allTypeResultList: [], //全部类型列表
      sigleTypeResultList: [], //单个类型列表
      searchInputValue: '', //输入框的值
      page_number: 1,
      page_size: 10,
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname.indexOf('/technological') !== -1) {}
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
      if(!!!searchInputValue) {
        return false
      }
      const obj = {
        ...payload,
        search_term: searchInputValue,
        search_type: defaultSearchType,
      }
      const res = yield call(getGlobalSearchResultList, obj)
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
          // const arr = [].concat(sigleTypeResultList, res.data)
          // debugger
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
              sigleTypeResultList: arr
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
