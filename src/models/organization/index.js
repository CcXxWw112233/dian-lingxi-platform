import { getBackLogProcessList, getJoinedProcessList, getResponsibleTaskList, getUploadedFileList, completeTask } from '../../services/technological/workbench'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME } from "../../globalset/js/constant";
import { routerRedux } from "dva/router";
import Cookies from "js-cookie";
import {getAppsList} from "../../services/technological/project";
import modelExtend from 'dva-model-extend'
import technological from './index'

export default  {
  namespace: 'organization',
  state: [],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        message.destroy()
        if (location.pathname === '/technological/organization') {
          console.log('yes')
        } else {
          console.log('no')
        }
      })
    },
  },
  effects: {
    * getResponsibleTaskList({ payload }, { select, call, put }) {
      let res = yield call(getResponsibleTaskList, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            responsibleTaskList: res.data
          }
        })
      }else{

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
