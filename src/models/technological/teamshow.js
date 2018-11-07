import { getBackLogProcessList, getJoinedProcessList, getResponsibleTaskList, getUploadedFileList, completeTask } from '../../services/technological/workbench'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME } from "../../globalset/js/constant";
import { routerRedux } from "dva/router";
import Cookies from "js-cookie";
import {getAppsList} from "../../services/technological/project";
import modelExtend from 'dva-model-extend'
import technological from './index'

let naviHeadTabIndex //导航栏naviTab选项
export default modelExtend(technological, {
  namespace: 'teamshow',
  state: [],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        message.destroy()
        if (location.pathname === '/technological/teamshow') {
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
    * getUploadedFileList({ payload }, { select, call, put }) {
      let res = yield call(getUploadedFileList, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            uploadedFileList: res.data,
          }
        })
      }else{

      }
    },
    * getBackLogProcessList({ payload }, { select, call, put }) {
      let res = yield call(getBackLogProcessList, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            backLogProcessList: res.data
          }
        })
      }else{

      }
    },
    * getJoinedProcessList({ payload }, { select, call, put }) {
      let res = yield call(getJoinedProcessList, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            joinedProcessList: res.data,
          }
        })
      }else{

      }
    },
    * completeTask({ payload }, { select, call, put }) { //
      let res = yield call(completeTask, payload)
      // if(isApiResponseOk(res)) {
      //   yield put({
      //     type: 'getResponsibleTaskList',
      //     payload:{
      //     }
      //   })
      // }else{}
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
});
