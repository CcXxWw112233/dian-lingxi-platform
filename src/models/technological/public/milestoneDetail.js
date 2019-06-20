import { getMilestoneDetail } from '../../../services/technological/task'
import { isApiResponseOk } from '../../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME } from "../../../globalset/js/constant";
import { routerRedux } from "dva/router";
import queryString from 'query-string';
import modelExtend from 'dva-model-extend'
import technological from '../index'

export default modelExtend(technological, {
  namespace: 'milestoneDetail',
  state: {
    milestone_detail: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
      })
    },
  },
  effects: {
    * getMilestoneDetail({ payload = {} }, { select, call, put }) {
      let res = yield call(getMilestoneDetail, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            milestone_detail: res.data
          }
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
  },

  reducers: {
    updateDatas(state, action) {
      return {
        ...state, ...action.payload
      }
    }
  },
})
