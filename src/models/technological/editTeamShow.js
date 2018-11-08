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
  namespace: 'editTeamShow',
  state: [],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        message.destroy()
        if (location.pathname === '/technological/editTeamShow') {
          dispatch({
            type: 'updateDatas',
            payload:{
              //  团队展示发布
              teamShowCertainOneShow: true, //编辑的时候展示，提交时设为false
              editTeamShowPreview: false, //编辑预览状态
              editTeamShowSave: false,  //编辑保存状态
            }
          })
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
});
