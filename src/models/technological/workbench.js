import {getProjectList,getMeetingList,getBoxList, getItemBoxFilter,getArticleList, getArticleDetail, updateViewCounter, getBackLogProcessList, getJoinedProcessList, getResponsibleTaskList, getUploadedFileList, completeTask } from '../../services/technological/workbench'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME, WE_APP_TYPE_KNOW_CITY, WE_APP_TYPE_KNOW_POLICY, PAGINATION_PAGE_SIZE } from "../../globalset/js/constant";
import { routerRedux } from "dva/router";
import Cookies from "js-cookie";
import {getAppsList} from "../../services/technological/project";
import modelExtend from 'dva-model-extend'
import technological from './index'
import {selectKnowPolicyArticles, selectKnowCityArticles, selectBoxList} from "./select";

let naviHeadTabIndex //导航栏naviTab选项
export default modelExtend(technological, {
  namespace: 'workbench',
  state: [],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        message.destroy()
        if (location.pathname === '/technological/workbench') {
          dispatch({
            type:'updateDatas',
            payload: {
              knowCityArticles: [], //优秀案例文章列表
              knowPolicyArticles: [], //政策法规文章列表
              previewAticle: {}, //预览的文章
              spinning: false, //文章加载中状态
              boxList: [], //工作台盒子列表
              projectList: [], //项目列表
            }
          })

          dispatch({
            type: 'getBoxList',
            payload: {}
          })
          dispatch({
            type: 'getProjectList',
            payload: {}
          })

        }
      })
    },
  },
  effects: {


    * getProjectList({ payload }, { select, call, put }) {
      let res = yield call(getProjectList, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            projectList: res.data
          }
        })
      }else{

      }
    },

    * getBoxList({ payload }, { select, call, put }) {
      let res = yield call(getBoxList, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            boxList: res.data
          }
        })
      }else{

      }
    },
    * getItemBoxFilter({ payload }, { select, call, put }) {
      const { board_ids, id, itemKey }= payload
      const res = yield call(getItemBoxFilter, {board_ids, id})
      const boxList = yield select(selectBoxList)
      const code = boxList[itemKey]['code']
      if(isApiResponseOk(res)) {
        let eventName = ''
        switch (code) {
          case 'RESPONSIBLE_TASK':
            eventName= 'getResponsibleTaskList'
            break
          case 'EXAMINE_PROGRESS': //待处理的流程
            eventName= 'getBackLogProcessList'
            break
          case 'MY_DOCUMENT':
            eventName= 'getUploadedFileList'
            break
          case 'MEETIMG_ARRANGEMENT':
            eventName= 'getMeetingList'
            break
          default:
            eventName= 'MLGB'
            break
        }
        yield put({
          type: eventName,
          payload: {
            id
          }
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    * getMeetingList({ payload }, { select, call, put }) {
      let res = yield call(getMeetingList, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            meetingLsit: res.data
          }
        })
      }else{

      }
    },
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

    * getArticleList({ payload }, { select, call, put }) { //
      const { appType, page_no } = payload
      const res = yield call(getArticleList, payload)
      const knowCityArticles = yield select(selectKnowCityArticles)
      const knowPolicyArticles = yield select(selectKnowPolicyArticles)
      const updateListName = appType === WE_APP_TYPE_KNOW_CITY ? `knowCityArticles` : `knowPolicyArticles`
      const odlist = appType === WE_APP_TYPE_KNOW_CITY? [...knowCityArticles] : [...knowPolicyArticles]
      if(isApiResponseOk(res)) {
        const newlist = Number(page_no) === 1? res.data:odlist.concat([...res.data])
        yield put({
          type: 'updateDatas',
          payload:{
            [updateListName]: newlist
          }
        })
      }else{}
    },
    * getArticleDetail({ payload }, { select, call, put }) { //
      yield put({
        type: 'updateDatas',
        payload:{
          spinning: true
        }
      })
      const res = yield call(getArticleDetail, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload:{
            previewAticle: res.data,
            spinning: false
          }
        })
        yield put({
          type: 'updateViewCounter',
          payload
        })
      }else{
        message.warn(res.message || '系统繁忙，请稍后重试')
      }
    },
    * updateViewCounter({ payload }, { select, call, put }) { //
      const article_id = payload['id']
      const res = yield call(updateViewCounter, {...payload, article_id})
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
});
