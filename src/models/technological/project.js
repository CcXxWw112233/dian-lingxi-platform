import { getProjectList, addNewProject, updateProject, deleteProject, archivedProject, cancelCollection, projectDetail, addMenbersInProject, quitProject, collectionProject} from '../../services/technological/project'
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
        message.destroy()
        if (location.pathname === '/technological/project') {
          dispatch({
            type: 'getProjectList',
            payload: {
              type: '1'
            }
          })
        }else{
          // console.log(2)
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
    * addNewProject({ payload }, { select, call, put }) {
      let res = yield call(addNewProject, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getProjectList',
          payload: {
            type: '1'
          }
        })
      }else{

      }
    },
    * collectionProject({ payload }, { select, call, put }) {
      const { id } = payload
      let res = yield call(collectionProject, id)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getProjectList',
          payload: {
            type: '1'
          }
        })
      }else{

      }
    },
    * cancelCollection({ payload }, { select, call, put }) {
      const { id } = payload
      let res = yield call(cancelCollection, id)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getProjectList',
          payload: {
            type: '1'
          }
        })
      }else{

      }
    },

    * quitProject({ payload }, { select, call, put }) {
      let res = yield call(quitProject, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getProjectList',
          payload: {
            type: '1'
          }
        })
      }else{

      }
    },

    * archivedProject({ payload }, { select, call, put }) {
      let res = yield call(archivedProject, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getProjectList',
          payload: {
            type: '1'
          }
        })
      }else{

      }
    },

    * addMenbersInProject({ payload }, { select, call, put }) {
      let res = yield call(addMenbersInProject, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getProjectList',
          payload: {
            type: '1'
          }
        })
      }else{

      }
    },

    * deleteProject({ payload }, { select, call, put }) {
      const { id } = payload
      let res = yield call(deleteProject, id)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getProjectList',
          payload: {
            type: '1'
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
