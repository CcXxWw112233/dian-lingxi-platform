import { getAppsList, getProjectList, addNewProject, updateProject, deleteProject, archivedProject, cancelCollection, projectDetail, addMenbersInProject, quitProject, collectionProject} from '../../services/technological/project'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME } from "../../globalset/js/constant";
import { routerRedux } from "dva/router";

export default {
  namespace: 'project',
  state: [],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        // message.destroy()
        if (location.pathname === '/technological/project') {
          dispatch({
            type: 'updateDatas',
            payload: {
              collapseActiveKeyArray: ['1','2','3'], //折叠面板打开的key
            }
          })
          dispatch({
            type: 'getProjectList',
            payload: {
              type: '1'
            }
          })
          dispatch({
            type: 'getAppsList',
            payload: {
              type:'2'
            }
          })
        }else{
          // console.log(2)
        }
      })
    },
  },
  effects: {
    * getAppsList({ payload }, { select, call, put }) {
      let res = yield call(getAppsList, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            appsList: res.data
          }
        })
      }else{

      }
    },

    * getProjectList({ payload }, { select, call, put }) {
      const { type = '1', calback } = payload
      let res = yield call(getProjectList, {type})
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            projectList: res.data
          }
        })
        if(typeof calback === 'function') {
          calback()
        }
      }else{

      }
    },
    * addNewProject({ payload }, { select, call, put }) {
      let res = yield call(addNewProject, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getProjectList',
          payload: {
            type: '1',
            calback: function () {
              message.success('添加项目成功', MESSAGE_DURATION_TIME)
            },
          }
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * collectionProject({ payload }, { select, call, put }) {
      const { id } = payload
      let res = yield call(collectionProject, id)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getProjectList',
          payload: {
            calback: function () {
              message.success('收藏成功', MESSAGE_DURATION_TIME)
            },
            type: '1'
          }
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * cancelCollection({ payload }, { select, call, put }) {
      const { id } = payload
      let res = yield call(cancelCollection, id)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getProjectList',
          payload: {
            calback: function () {
              message.success('取消收藏成功', MESSAGE_DURATION_TIME)
            },
            type: '1'
          }
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * quitProject({ payload }, { select, call, put }) {
      let res = yield call(quitProject, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getProjectList',
          payload: {
            calback: function () {
              message.success('已退出项目', MESSAGE_DURATION_TIME)
            },
            type: '1'
          }
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * archivedProject({ payload }, { select, call, put }) {
      let res = yield call(archivedProject, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getProjectList',
          payload: {
            calback: function () {
              message.success('已归档项目', MESSAGE_DURATION_TIME)
            },
            type: '1'
          }
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * addMenbersInProject({ payload }, { select, call, put }) {
      let res = yield call(addMenbersInProject, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getProjectList',
          payload: {
            calback: function () {
              message.success('成功添加项目成员', MESSAGE_DURATION_TIME)
            },
            type: '1'
          }
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * deleteProject({ payload }, { select, call, put }) {
      const { id } = payload
      let res = yield call(deleteProject, id)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getProjectList',
          payload: {
            calback: function () {
              message.success('已删除项目', MESSAGE_DURATION_TIME)
            },
            type: '1'
          }
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
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
