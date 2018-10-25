import { updateOrganization, uploadOrganizationLogo} from '../../services/organization'
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
        if (location.pathname === '/organization') {
          const currentSelectOrganize = JSON.parse(Cookies.get('currentSelectOrganize'))
          console.log(currentSelectOrganize)
          const {name, member_join_model, member_join_content, logo, logo_id, id} = currentSelectOrganize
          dispatch({
            type: 'updateDatas',
            payload:{
              currentOrganizationInfo: {
                name,
                member_join_model,
                member_join_content,
                logo,
                logo_id,
                id
              }
            }
          })
        } else {
        }
      })
    },
  },
  effects: {
    * updateOrganization({ payload }, { select, call, put }) {
      let res = yield call(updateOrganization, payload)
      if(isApiResponseOk(res)) {
         message.success('更新组织信息成功',MESSAGE_DURATION_TIME)
      }else{
        message.success(res.message,MESSAGE_DURATION_TIME)
      }
    },
    * uploadOrganizationLogo({ payload }, { select, call, put }) {
      let res = yield call(uploadOrganizationLogo, payload)
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
