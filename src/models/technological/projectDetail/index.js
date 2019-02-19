import { getProjectRoles, setMemberRoleInProject, projectDetailInfo, updateProject, removeMenbers } from '../../../services/technological/prjectDetail'
import { isApiResponseOk } from '../../../utils/handleResponseData'
import { message } from 'antd'
import {MESSAGE_DURATION_TIME, TASKS, PROJECTS, MEMBERS} from "../../../globalset/js/constant";
import { routerRedux } from "dva/router";
import { getUrlQueryString } from '../../../utils/util'
import {
  addMenbersInProject, archivedProject, cancelCollection, deleteProject, collectionProject,
  quitProject, getAppsList, addProjectApp
} from "../../../services/technological/project";
import {getFileCommitPoints, getPreviewFileCommits, addFileCommit, deleteCommit, getFileList, filePreview, fileCopy, fileDownload, fileRemove, fileMove, fileUpload, fileVersionist, recycleBinList, deleteFile, restoreFile, getFolderList, addNewFolder, updateFolder, } from '../../../services/technological/file'
import { removeTaskExecutor, deleteTaskFile, deleteTaskGroup, updateTaskGroup, getProjectGoupList, addTaskGroup, addCardNewComment, getCardCommentList, getTaskGroupList, addTask, updateTask, deleteTask, archivedTask, changeTaskType, addChirldTask, addTaskExecutor, completeTask, addTaskTag, removeTaskTag, removeProjectMenbers, getBoardTagList, updateBoardTag, toTopBoardTag, deleteBoardTag, deleteCardNewComment } from "../../../services/technological/task";
import { selectFilePreviewCommitPointNumber, selectProjectDetailInfoData, selectGetTaskGroupListArrangeType, selectCurrentProcessInstanceId, selectDrawerVisible, selectBreadcrumbList, selectCurrentParrentDirectoryId, selectAppsSelectKeyIsAreadyClickArray, selectAppsSelectKey, selectTaskGroupListIndex, selectTaskGroupList, selectTaskGroupListIndexIndex, selectDrawContent } from '../select'
import Cookies from "js-cookie";
import { fillFormComplete, getProessDynamics, getProcessTemplateList, saveProcessTemplate, getTemplateInfo, getProcessList, createProcess, completeProcessTask, getProcessInfo, rebackProcessTask, resetAsignees, rejectProcessTask } from '../../../services/technological/process'
import { processEditDatasConstant, processEditDatasRecordsConstant } from '../../../routes/Technological/components/ProjectDetail/Process/constant'
import {currentNounPlanFilterName} from "../../../utils/businessFunction";
import {postCommentToDynamics} from "../../../services/technological/library";
import QueryString from 'querystring'

//状态说明：
//ProjectInfoDisplay ： 是否显示项目信息，第一次进来默认，以后点击显示隐藏

let board_id
// appsSelectKey 项目详情里面应用的app标志
export default {
  namespace: 'projectDetail',
  state: [{
  }],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        // message.destroy()
        //监听新消息setMessageItemEvent 公用函数
        const evenListentNewMessage = (e) => {
          if(!Cookies.get('updateNewMessageItem_2') || Cookies.get('updateNewMessageItem_2') === 'false' ) {
            const newValue = JSON.parse(JSON.parse(e.newValue))
            const { type } = newValue
            if(Number(type) === 3) { //监听评论
              dispatch({
                type: 'listenWsCardNewComment',
                payload: {
                  newsData: JSON.parse(JSON.parse(e.newValue)),
                },
              })
            }else if(Number(type) === 4) { // 监听流程
              dispatch({
                type: 'listenWsProcessDynamics',
                payload: {
                  newsData: JSON.parse(JSON.parse(e.newValue)),
                },
              })
            }
            Cookies.set('updateNewMessageItem_2', true, {expires: 30, path: ''})
          }
        }
        const param = QueryString.parse(location.search.replace('?', ''))
        board_id = param.board_id

        const initialData = () => {
          dispatch({
            type: 'updateDatas',
            payload: {
              projectRoles: [], //项目角色
              //全局任务key
              appsSelectKey: undefined, //应用key
              appsSelectKeyIsAreadyClickArray: [], //点击过的appsSelectKey push进数组，用来记录无需重新查询数据
              appsList: [], //全部app列表
              //项目详情和任务
              projectInfoDisplay: false, //项目详情是否出现 projectInfoDisplay 和 isInitEntry 要同时为一个值
              isInitEntry: false, //是否初次进来项目详情
            }
          })
        }
        initialData()

        if (location.pathname.indexOf('/technological/projectDetail') !== -1) {
          dispatch({ //查询项目角色列表
            type: 'getProjectRoles',
            payload: {
              type: '2',
            }
          })
          dispatch({
            type: 'initProjectDetail',
            payload: {
              id: board_id
            }
          })
          dispatch({
            type: 'getAppsList',
            payload: {
              type: '2'
            }
          })

          //监听消息存储在localstorage变化
          window.addEventListener('setMessageItemEvent_2', evenListentNewMessage, false);
        }else{
          window.removeEventListener('setMessageItemEvent_2', evenListentNewMessage, false);
        }
      })
    },
  },
  effects: {
    //初始化进来 , 先根据项目详情获取默认 appsSelectKey，再根据这个appsSelectKey，查询操作相应的应用 ‘任务、流程、文档、招标、日历’等
    * initProjectDetail({ payload }, { select, call, put }) {
      const { id } = payload
      let result = yield call(projectDetailInfo, id)
      const appsSelectKey = yield select(selectAppsSelectKey)
      if(isApiResponseOk(result)) {
        yield put({
          type: 'updateDatas',
          payload: {
            projectDetailInfoData: result.data,
            appsSelectKey: appsSelectKey || (result.data.app_data[0]? result.data.app_data[0].key : 1), //设置默认
            appsSelectKeyIsAreadyClickArray: [result.data.app_data[0]? result.data.app_data[0].key : 1], //设置默认
            //文档需要数据初始化
            breadcrumbList: [{file_name: result.data.folder_name, file_id: result.data.folder_id, type: '1'}],
            currentParrentDirectoryId: result.data.folder_id,
          }
        })
        //缓存下来当前项目的权限
        localStorage.setItem('currentBoardPermission', JSON.stringify(result.data.permissions || []))
        if(result.data.app_data[0] ) {
          if( result.data.app_data[0].key === '3') { //任务
            yield put({
              type: 'getProjectGoupList'
            })
            yield put({
              type: 'getTaskGroupList',
              payload: {
                type: '2',
                board_id: board_id,
                arrange_type: '1'
              }
            })
            yield put({
              type: 'getBoardTagList',
              payload: {
                board_id
              }
            })
          }else if(result.data.app_data[0].key === '4'){ //文档
            yield put({
              type: 'getFileList',
              payload: {
                folder_id: result.data.folder_id
              }
            })
            yield put({
              type: 'getFolderList',
              payload: {
                board_id: board_id
              }
            })
          }else if(result.data.app_data[0].key === '2') {
            yield put({
              type: 'getProcessTemplateList',
              payload: {
                board_id: board_id
              }
            })
            yield put({
              type: 'getProcessList',
              payload: {
                board_id: board_id,
                type: '1'
              }
            })
          }
        }

      }else{
        //权限缓存空数组
        localStorage.setItem('currentBoardPermission', JSON.stringify([]))
      }
    },
    //点击app选项，将点击过的key push进数组，根据已经点击过的数组判断不在重新拉取数据
    * appsSelect({ payload }, { select, call, put }) {
      const { appsSelectKey } = payload
      let appsSelectKeyIsAreadyClickArray = []
      appsSelectKeyIsAreadyClickArray = yield select(selectAppsSelectKeyIsAreadyClickArray)
      let flag = true
      for (let val of appsSelectKeyIsAreadyClickArray) {
        if(appsSelectKey === val) {
          flag = false
        }
      }
      appsSelectKeyIsAreadyClickArray.push(appsSelectKey)
      const newAppsSelectKeyIsAreadyClickArray = Array.from(new Set(appsSelectKeyIsAreadyClickArray))
      yield put({
        type: 'updateDatas',
        payload: {
          appsSelectKeyIsAreadyClickArray: newAppsSelectKeyIsAreadyClickArray
        }
      })
      if(!flag) {
        return false
      }

      if( appsSelectKey === '3') { //任务
        yield put({
          type: 'getProjectGoupList'
        })
        yield put({
          type: 'getTaskGroupList',
          payload: {
            type: '2',
            board_id: board_id,
            arrange_type: '1'
          }
        })
        yield put({
          type: 'getBoardTagList',
          payload: {
            board_id
          }
        })

      }else if(appsSelectKey === '2'){ //流程
        yield put({
          type: 'getProcessTemplateList',
          payload: {
            board_id: board_id
          }
        })
        yield put({
          type: 'getProcessList',
          payload: {
            board_id: board_id,
            type: '1'
          }
        })
      }else if(appsSelectKey === '4') { //文档
        const currentParrentDirectoryId = yield select(selectCurrentParrentDirectoryId)
        yield put({
          type: 'getFileList',
          payload: {
            folder_id: currentParrentDirectoryId
          }
        })
        yield put({
          type: 'getFolderList',
          payload: {
            board_id: board_id
          }
        })
      }



    },

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

    //项目增删改查--start
    * projectDetailInfo({ payload }, { select, call, put }) { //查看项目详情信息
      const { id, calback } = payload
      let res = yield call(projectDetailInfo, id)
      const appsSelectKey = yield select(selectAppsSelectKey)
      if(typeof calback === 'function') {
        calback()
      }
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            projectDetailInfoData: res.data,
            appsSelectKey: appsSelectKey || (res.data.app_data[0]? res.data.app_data[0].key : 1)
          }
        })
      }else{
      }
    },

    * getProjectRoles({ payload }, { select, call, put }) {
      const res = yield call(getProjectRoles, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            projectRoles: res.data
          }
        })
      }else{

      }
    },
    * setMemberRoleInProject({ payload }, { select, call, put }) {
      const res = yield call(setMemberRoleInProject, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'projectDetailInfo',
          payload: {
            id: board_id,
            calback: function () {
              message.success('设置角色成功', MESSAGE_DURATION_TIME)
            }
          }
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * removeMenbers({ payload }, { select, call, put }) { //
      let res = yield call(removeMenbers, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'projectDetailInfo',
          payload: {
            id: board_id,
            calback: function () {
              message.success(`已从${currentNounPlanFilterName(PROJECTS)}移除该${currentNounPlanFilterName(MEMBERS)}`, MESSAGE_DURATION_TIME)
            }
          }
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * updateProject({ payload }, { select, call, put }) { //
      let res = yield call(updateProject, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'projectDetailInfo',
          payload: {
            id: board_id,
            calback: function () {
              message.success('更新成功', MESSAGE_DURATION_TIME)
            }
          }
        })
      }else{
        //失败之后重新拉回原来数据
        const projectDetailInfoData = yield select(selectProjectDetailInfoData)
        yield put({
          type: 'updateDatas',
          payload: {
            projectDetailInfoData
          }
        })
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * collectionProject({ payload }, { select, call, put }) {
      const { id } = payload
      let res = yield call(collectionProject, id)
      if(isApiResponseOk(res)) {
        message.success('收藏成功', MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * cancelCollection({ payload }, { select, call, put }) {
      const { id } = payload
      let res = yield call(cancelCollection, id)
      if(isApiResponseOk(res)) {
        message.success('已取消收藏', MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * quitProject({ payload }, { select, call, put }) {
      let res = yield call(quitProject, payload)
      if(isApiResponseOk(res)) {
        message.success(`已退出${currentNounPlanFilterName(PROJECTS)}`, MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * archivedProject({ payload }, { select, call, put }) {
      let res = yield call(archivedProject, payload)
      if(isApiResponseOk(res)) {
        message.success(`已归档${currentNounPlanFilterName(PROJECTS)}`, MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * addMenbersInProject({ payload }, { select, call, put }) {
      let res = yield call(addMenbersInProject, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'projectDetailInfo',
          payload: {
            id: board_id,
            calback: function () {
              message.success(`${currentNounPlanFilterName(PROJECTS)}添加${currentNounPlanFilterName(MEMBERS)}成功`, MESSAGE_DURATION_TIME)
            }
          }
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * deleteProject({ payload }, { select, call, put }) {
      const { id, isJump } = payload
      let res = yield call(deleteProject, id)
      if(isApiResponseOk(res)) {
        if(isJump) {
          yield put({
            type: 'routingJump',
            payload: {
              route: '/technological/project'
            }
          })
        }
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * addProjectApp({ payload }, { select, call, put }) {
      let res = yield call(addProjectApp, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'initProjectDetail',
          payload: {
            id: board_id
          }
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    //项目增删改查--end



    * routingJump({ payload }, { call, put }) {
      const { route } = payload
      yield put(routerRedux.push(route));
    },

    //评论 @用户 触发动态
    * postCommentToDynamics({ payload }, { select, call, put }) { //
      const res = yield call(postCommentToDynamics, payload)
      if(isApiResponseOk(res)) {
      }else{
      }
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
