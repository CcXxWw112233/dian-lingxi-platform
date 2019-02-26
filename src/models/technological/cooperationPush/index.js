import { getUSerInfo, logout } from '../../../services/technological'
import { getOrganizationMemberPermissions, changeCurrentOrg, getSearchOrganizationList, createOrganization, updateOrganization, applyJoinOrganization, inviteJoinOrganization, getCurrentUserOrganizes } from '../../../services/technological/organizationMember'
import { selectCurrentUserOrganizes, selectCurrentSelectOrganize} from "./../select";
import { getCurrentNounPlan } from '../../../services/organization'
import { isApiResponseOk } from '../../../utils/handleResponseData'
import { message } from 'antd'
import {MEMBERS, MESSAGE_DURATION_TIME, ORGANIZATION} from "../../../globalset/js/constant";
import { routerRedux } from "dva/router";
import Cookies from "js-cookie";
import { initWs} from '../../../components/WsNewsDynamic'
import { selectNewMessageItem, selectImData } from './../select'
import QueryString from 'querystring'
import {currentNounPlanFilterName} from "../../../utils/businessFunction";
import {getUserImToken} from "../../../services/technological/workbench";

//定义model名称
const model_projectDetail = name => `projectDetail/${name}`
const model_projectDetailTask = name => `projectDetailTask/${name}`
const model_projectDetailFile = name => `projectDetailFile/${name}`
const model_projectDetailProcess = name => `projectDetailProcess/${name}`
const model_workbench = name => `workbench/${name}`
const model_technological = name => `technological/${name}`
const model_newsDynamic = name => `newsDynamic/${name}`
const model_workbenchTaskDetail = name => `workbenchTaskDetail/${name}`
const model_workbenchFileDetail = name => `workbenchFileDetail/${name}`
const model_workbenchPublicDatas = name => `workbenchPublicDatas/${name}`

//消息推送model
export default {
  namespace: 'cooperationPush',
  state: [],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        message.destroy()
        //头部table key
        if (location.pathname.indexOf('/technological') !== -1) {
          //websocket连接判定
          setTimeout(function () {
            console.log('1111', Cookies.get('wsLinking'))
            if(Cookies.get('wsLinking') === 'false' || !Cookies.get('wsLinking')){
              initWs()
            }
          }, 3000)
          //页面移出时对socket和socket缓存的内容清除
          window.onload = function () {
            Cookies.set('wsLinking', 'false', {expires: 30, path: ''})
            localStorage.removeItem(`newMessage`)
          }
        }

      })
    },
  },
  effects: {
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
