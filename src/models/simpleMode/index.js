import { routerRedux } from 'dva/router'
import {
  getUserBoxs,
  getAllBoxs,
  boxSet,
  boxCancel,
  getWallpaperList,
  getGuideCategoryList,
  getGuideArticle,
  getBoardsTaskTodoList,
  getBoardsProcessTodoList,
  getMeetingTodoList
} from '@/services/technological/simplemode'
import { MESSAGE_DURATION_TIME } from '../../globalset/js/constant'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { getModelSelectState } from '@/models/utils'
import { message } from 'antd'
import {
  getUserAllOrgsBoardList,
  getFilterAllOrgsWhetherItIsFilesAppsBoardList
} from '@/services/technological/index'
import { ENV_ANDROID_APP } from '../../globalset/clientCustorm'
export default {
  namespace: 'simplemode',
  state: {
    initFlag: true,
    simpleHeaderVisiable: true, //显示隐藏用
    setWapperCenter: false, //显示隐藏用
    wallpaperSelectModalVisiable: false, //显示隐藏用
    leftMainNavIconVisible: true,
    chatImVisiable: false, //显示隐藏用
    guideModalVisiable: false, //显示隐藏用

    workbenchBoxContentWapperModalStyle: { width: '100%' },
    myWorkbenchBoxList: [], //我的盒子列表
    workbenchBoxList: [], //所有可以选择的盒子列表
    currentSelectedWorkbenchBox: {}, //当然选中的工作台盒子
    init: true,
    allOrgBoardTreeList: [],
    allWallpaperList: [], //可选的壁纸列表
    currentUserWallpaperContent: null,
    simplemodeCurrentProject: {},
    guideCategoryList: [], //协作引导类别
    guideArticleList: [], //协作引导文章
    guideCategorySelectedKeys: {}, //选中的协作引导类别

    board_card_todo_list: [], //用户地日程任务流程列表
    board_flow_todo_list: [] //流程代办列表
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        // if (location.pathname.indexOf('/technological/simplemode') !== -1) {
        //   const initData = () => {
        //     Promise.all([
        //       dispatch({
        //         type: 'initSimplemodeCommData',
        //         payload: {}
        //       })
        //     ])
        //   }
        //   initData()
        // }
      })
    }
  },
  effects: {
    *initSimplemodeCommData({ payload }, { call, put, select }) {
      const initFlag = yield select(
        getModelSelectState('simplemode', 'initFlag')
      ) || []

      if (initFlag) {
        yield put({
          type: 'getOrgBoardData'
        })
        // yield put({
        //     type: 'workbenchPublicDatas/getRelationsSelectionPre'
        // });
        yield put({
          type: 'getWallpaperList'
        })

        yield put({
          type: 'getGuideCategoryList'
        })
      }
    },
    *routingJump({ payload }, { call, put }) {
      const { route } = payload
      yield put(routerRedux.push(route))
    },
    *getMyBoxs({ payload }, { call, put, select }) {
      let res = yield call(getUserBoxs, {})
      const currentSelectedWorkbenchBox = yield select(
        getModelSelectState('simplemode', 'currentSelectedWorkbenchBox')
      ) || {}
      if (isApiResponseOk(res)) {
        let { data: myWorkbenchBoxList } = res
        yield put({
          type: 'updateDatas',
          payload: {
            myWorkbenchBoxList: myWorkbenchBoxList
          }
        })
        if (!currentSelectedWorkbenchBox.id) {
          //当workbench界面刷新的时候，设置默认
          //当前的box存储在会话中，如果有就取，没有取列表第一个
          const sessionStorage_item = window.sessionStorage.getItem(
            'session_currentSelectedWorkbenchBox'
          )
          const session_currentSelectedWorkbenchBox = JSON.parse(
            sessionStorage_item || '{}'
          )
          const is_has_this_box = !!myWorkbenchBoxList.findIndex(
            item => item.id == session_currentSelectedWorkbenchBox.id
          ) //存在该盒子
          const will_set_data =
            session_currentSelectedWorkbenchBox.id && is_has_this_box
              ? session_currentSelectedWorkbenchBox
              : myWorkbenchBoxList[0]
          yield put({
            type: 'updateDatas',
            payload: {
              currentSelectedWorkbenchBox: will_set_data
            }
          })
          window.sessionStorage.setItem(
            'session_currentSelectedWorkbenchBox',
            JSON.stringify(will_set_data)
          )
        }
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    *getAllBoxs({ payload }, { call, put }) {
      let res = yield call(getAllBoxs, {})
      if (isApiResponseOk(res)) {
        let { data: workbenchBoxList } = res
        yield put({
          type: 'updateDatas',
          payload: {
            workbenchBoxList: workbenchBoxList
          }
        })
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    *myboxSet({ payload }, { call, put, select }) {
      const { id } = payload
      let res = yield call(boxSet, payload)

      if (isApiResponseOk(res)) {
        //我的盒子列表
        let myWorkbenchBoxList = yield select(
          getModelSelectState('simplemode', 'myWorkbenchBoxList')
        ) || []
        //所有的盒子列表

        let workbenchBoxList = yield select(
          getModelSelectState('simplemode', 'workbenchBoxList')
        ) || []
        let newMyboxArray = workbenchBoxList.filter(item => item.id == id)
        if (newMyboxArray.length > 0) {
          myWorkbenchBoxList.push(newMyboxArray[0])
        } else {
          let newMybox = { id }
          myWorkbenchBoxList.push(newMybox)
        }

        yield put({
          type: 'updateDatas',
          payload: {
            myWorkbenchBoxList: [...myWorkbenchBoxList]
          }
        })
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    *myboxCancel({ payload }, { call, put, select }) {
      const { id } = payload
      let res = yield call(boxCancel, payload)

      if (isApiResponseOk(res)) {
        let myWorkbenchBoxList = yield select(
          getModelSelectState('simplemode', 'myWorkbenchBoxList')
        ) || []
        yield put({
          type: 'updateDatas',
          payload: {
            myWorkbenchBoxList: myWorkbenchBoxList.filter(
              item => item.id !== id
            )
          }
        })
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    *getOrgBoardData({ payload }, { call, put, select }) {
      let res = yield call(getUserAllOrgsBoardList, payload)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            allOrgBoardTreeList: res.data
          }
        })
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    *getFilterAllOrgsWhetherItIsFilesAppsBoardList(
      { payload },
      { call, put, select }
    ) {
      let res = yield call(
        getFilterAllOrgsWhetherItIsFilesAppsBoardList,
        payload
      )
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            allOrgBoardTreeList: res.data
          }
        })
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    *getWallpaperList({ payload }, { call, put, select }) {
      let res = yield call(getWallpaperList, payload)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            allWallpaperList: res.data,
            initFlag: false
          }
        })
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    *getGuideCategoryList({ payload }, { call, put, select }) {
      const app_name = ENV_ANDROID_APP ? 'huixiebao' : 'lingxi'
      let res = yield call(getGuideCategoryList, { app: app_name })
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            guideCategoryList: res.data,
            guideCategorySelectedKeys: res.data[0]
          }
        })
        yield put({
          type: 'getGuideArticle',
          payload: {
            id: res.data[0].id
          }
        })
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    *getGuideArticle({ payload }, { call, put, select }) {
      let res = yield call(getGuideArticle, payload)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            guideArticleList: res.data
          }
        })
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    *getBoardsTaskTodoList({ payload }, { call, put, select }) {
      let res = yield call(getBoardsTaskTodoList, payload)
      // debugger
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            board_card_todo_list: res.data
          }
        })
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    *getBoardsProcessTodoList({ payload }, { call, put, select }) {
      let res = yield call(getBoardsProcessTodoList, payload)
      // debugger
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            board_flow_todo_list: res.data
          }
        })
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    *getMeetingTodoList({ payload }, { call, put, select }) {
      let res = yield call(getMeetingTodoList, payload)
      // debugger
      if (isApiResponseOk(res)) {
        let data = res.data
        data = data.map(item => {
          let new_item = { ...item }
          new_item.rela_type = 'meeting'
          return new_item
        })
        yield put({
          type: 'updateDatas',
          payload: {
            board_meeting_todo_list: data
          }
        })
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    *updateCurrentBoard({ payload }, { put, select }) {
      const { data = {}, board_id } = payload
      const { projectList } = yield select(
        getModelSelectState('workbench', 'datas')
      ) || {}

      let { userInfo } = yield select(
        getModelSelectState('technological', 'datas')
      ) || {}
      if (projectList && projectList.length) {
        /** 当前最新的数据 */
        const current = projectList.find(item => item.board_id === board_id)
        if (current) {
          const project = {
            ...current,
            /** 需要更新的字段 */
            ...data
          }
          yield put({
            type: 'updateDatas',
            payload: {
              simplemodeCurrentProject: project
            }
          })
          /** 更新userinfo字段，因为里面有选中项目的数据 */
          userInfo.user_set = {
            ...userInfo.user_set,
            current_board_id: project.board_id,
            current_board_name: project.board_name
          }
          window.localStorage.setItem(
            'userInfo',
            JSON.stringify({ ...userInfo })
          )
          yield put({
            type: 'technological/updateDatas',
            payload: {
              userInfo: {
                ...userInfo
              }
            }
          })
        }
      }
    }
  },
  reducers: {
    updateDatas(state, action) {
      return {
        ...state,
        ...action.payload
      }
    }
  }
}
