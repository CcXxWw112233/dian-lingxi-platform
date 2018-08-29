import { formSubmit, requestVerifyCode } from '../../services/login'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME } from "../../globalset/js/constant";
import { routerRedux } from "dva/router";

//状态说明：
//ProjectInfoDisplay ： 是否显示项目信息，第一次进来默认，以后点击显示隐藏

export default {
  namespace: 'projectDetail',
  state: [],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        // message.destroy()
        if (location.pathname === '/technological/projectDetail') {
          dispatch({
            type: 'updateDatas',
            payload:{
              projectInfoDisplay: false, //项目详情是否出现
              isInitEntry: false, //是否初次进来
              taskItemList: [{ishas: true},{ishas: true}], //任务列表
            }
          })
        }else{
        }
      })
    },
  },
  effects: {
    * formSubmit({ payload }, { select, call, put }) { //提交表单
      let res = yield call(formSubmit, payload)
      if(isApiResponseOk(res)) {
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
