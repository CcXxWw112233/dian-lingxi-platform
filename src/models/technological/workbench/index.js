import { getImRelaId, getUserImToken, getProjectStarList, getTodoList, getOrgMembers, getProjectUserList, updateBox, addBox, deleteBox, getBoxUsableList, getProjectList, getMeetingList, getBoxList, getItemBoxFilter, getArticleList, getArticleDetail, updateViewCounter, getBackLogProcessList, getJoinedProcessList, getResponsibleTaskList, getUploadedFileList, completeTask, getCurrentOrgFileUploads, getCurrentSelectedProjectMembersList, getCurrentResponsibleTask, setCurrentProjectIdToServer, getCurrentBackLogProcessList, getCurrentMeetingList, getcurrentOrgFileUploads, getProgressTemplateList, getCurrentOrgAllMembers } from '../../../services/technological/workbench'
import {addTask} from '../../../services/technological/task'
import {getFolderList} from './../../../services/technological/file'
import { isApiResponseOk, } from '../../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME, WE_APP_TYPE_KNOW_CITY, WE_APP_TYPE_KNOW_POLICY, PAGINATION_PAGE_SIZE } from "../../../globalset/js/constant";
import { routerRedux } from "dva/router";
import Cookies from "js-cookie";
import {getAppsList} from "../../../services/technological/project";
import modelExtend from 'dva-model-extend'
import technological from '../index'
import {workbench_selectKnowPolicyArticles, workbench_selectKnowCityArticles, workbench_selectBoxList, workbench_selectBoxUsableList} from "./selects";
import {filePreview, fileDownload} from "../../../services/technological/file";
import { postCommentToDynamics } from "../../../services/technological/library";

let naviHeadTabIndex //导航栏naviTab选项
export default modelExtend(technological, {
  namespace: 'workbench',
  state: {
      datas: {
        projectList: [],
        boxList: [],
      }
    },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        message.destroy()
        if (location.pathname === '/technological/workbench') {
          const initData = async () => {
            await Promise.all([dispatch({
                type: 'updateDatas',
                payload: {
                  cardGroupKey: 0,
                  knowCityArticles: [], //优秀案例文章列表
                  knowPolicyArticles: [], //政策法规文章列表
                  previewAticle: {}, //预览的文章
                  spinning: false, //文章加载中状态
                  // boxList: [], //工作台盒子列表
                  projectList: [], //项目列表
                  projectStarList: [],
                  projectUserList: [], //项目列表（只返回用户信息）
                  orgMembers: [], //组织用户列表
                  boxUsableList: [], //用户当前可用盒子列表
                  boxCheckDisabled: false,
                  imData: {}, //用户信息
                  filePreviewIsUsable: true, //文档是否可见
                  filePreviewUrl: '', //预览文档src
                  current_file_resource_id: '', //当前操作文档id
                  processInfo: {}, //所选中的流程的信息
                  currentOrgFileUploads: [], //当前组织下我上传的文档列表
                  currentSelectedProjectMembersList: [],
                  currentSelectedProjectFileFolderList: [], //当前选择的项目文件夹目录成绩
                  projectTabCurrentSelectedProject: '0', //当前选择的项目tabs - board_id || '0' - 所有项目
                  currentOrgAllMembers: [], //用户的当前组织所有成员（未分类)，
                  responsibleTaskList: [],
                  uploadedFileList: [],
                  backLogProcessList: [],
                  meetingLsit: [],
                  uploadedFileNotificationIdList: [] //工作台新上传的文档的id的通知提醒
                }
              }),
              dispatch({
                type: 'getCurrentOrgFileUploads',
                payload: {

                }
              }),
              // dispatch({
              //   type: 'getUserImToken',
              //   payload: {
              //
              //   }
              // })
              dispatch({
                type: 'getBoxList',
                payload: {}
              }),
              dispatch({
                type: 'getProjectList',
                payload: {}
              }),
              dispatch({
                type: 'getBoxUsableList',
                payload: {}
              })
            ])
            await dispatch({
              type: 'handleCurrentSelectedProjectChange',
              payload: {
                board_id: '0'
              }
            })
        }
        initData()
      }
      })
    },
  },
  effects: {
    * fetchCurrentOrgAllMembers(_, {call, put}) {
        let res = yield call(getCurrentOrgAllMembers)
        if(isApiResponseOk(res)) {
          yield put({
            type: 'updateDatas',
            payload: {
              currentOrgAllMembers: res.data.users
            }
          })
        }
    },
    * fetchCurrentSelectedProjectTemplateList({payload}, {call, put}) {
      const {board_id} = payload
      let res = yield call(getProgressTemplateList, {board_id})
      // console.log(res, 'template template.')
    },
    * fetchCurrentSelectedProjectFileFolderList({payload}, {call, put}) {
      const {board_id} = payload
      let res = yield call(getFolderList, {board_id})
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            currentSelectedProjectFileFolderList: res.data
          }
        })
      } else {
        message.error('获取当前项目文件夹失败，请稍后再试。')
      }
    },
    * addTask({payload}, {call, put}) {
      const {data} = payload
      const res = yield call(addTask, data)
      if(!isApiResponseOk(res)) {
        message.error('创建任务失败')
        // console.log('create task failed :' + res)
        return
      } else {
        //创建任务成功的任务 id
        return res.data
      }
      // console.log(res, 'add task')
    },
    * handleCurrentSelectedProjectChange({payload}, {select, put, call}) {
      const {board_id, shouldResortPosition} = payload
      yield put({type: 'setProjectTabCurrentSelectedProject', payload: {
        projectId: board_id
      }})
      yield put({
        type: 'workbenchPublicDatas/updateDatas',
        payload: {
          board_id: board_id
        }
      })
      //除了'所有参与的项目', 使选中的项目排在第一个
      if(board_id !== '0' && shouldResortPosition) {
        yield put({type: 'reSortProjectList', payload: {board_id}})
      }
      //设置项目 id
      const setProjectIdRes = yield call(setCurrentProjectIdToServer, {payload: {id: board_id}})
      if(isApiResponseOk(setProjectIdRes)){
      const [responsibleTaskListRes, backLogProcessListRes, meetingListRes, orgFileUploadsRes] = yield [
        call(getCurrentResponsibleTask),
        call(getCurrentBackLogProcessList),
        call(getCurrentMeetingList),
        call(getcurrentOrgFileUploads)
      ]
      const isAllResOk = () => isApiResponseOk(responsibleTaskListRes) && isApiResponseOk(backLogProcessListRes) && isApiResponseOk(meetingListRes) && isApiResponseOk(orgFileUploadsRes)
      if(isAllResOk()) {
        yield [
           put({
            type: 'updateDatas',
            payload: {
              responsibleTaskList: responsibleTaskListRes.data
            }
          }),
          put({
            type: 'updateDatas',
            payload: {
              backLogProcessList: backLogProcessListRes.data
            }
          }),
          put({
            type: 'updateDatas',
            payload: {
              meetingLsit: meetingListRes.data
            }
          }),
          put({
            type: 'updateDatas',
            payload: {
              uploadedFileList: orgFileUploadsRes.data,
            }
          })
        ]
      } else {
        message.warn('获取当前项目数据失败， 请稍后再试')
      }
      } else {
         message.warn('切换项目失败，请稍后再试')
      }
    },
    * fetchCurrentSelectedProjectMembersList({payload: {projectId}}, {call, put}) {
      let res = yield call(getCurrentSelectedProjectMembersList, {projectId})
      if(isApiResponseOk(res)){
        yield put({
          type: 'updateDatas',
          payload: {
            currentSelectedProjectMembersList: res.data
          }
        })
      }
    },
    * getUserImToken({ payload }, { select, call, put }) {
      let res = yield call(getUserImToken, payload)
      if(isApiResponseOk(res)) {
       yield put({
         type: 'updateDatas',
         payload: {
           imData: res.data
         }
       })
      }else{

      }
    },
    * getImRelaId({ payload }, { select, call, put }) {
      const { relaId } = payload
      let res = yield call(getImRelaId, { relaId })
      if(isApiResponseOk(res)) {
        const { calback } = payload
        if(calback && typeof calback ==='function'){
          calback(res.data)
        }
      }else{
        message.warn(res.message)
      }
    },

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
    * getProjectStarList({ payload }, { select, call, put }) {
      let res = yield call(getProjectStarList, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            projectStarList: res.data
          }
        })
      }else{

      }
    },
    * getProjectUserList({ payload }, { select, call, put }) {
      let res = yield call(getProjectUserList, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            projectUserList: res.data
          }
        })
      }else{

      }
    },
    * getOrgMembers({ payload }, { select, call, put }) {
      let res = yield call(getOrgMembers, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            orgMembers: res.data.data
          }
        })
      }else{

      }
    },

    * getBoxList({ payload }, { select, call, put }) {
      const calback = payload && payload.calback
      let res = yield call(getBoxList, {})
      if(calback && typeof calback ==='function') {
        calback()
      }
      if(isApiResponseOk(res)) {
        const {box_data, current_selected_board_id: projectId} = res.data
        const orgBoxList = [...box_data]
        const shouldSortedOrder = ['RESPONSIBLE_TASK', 'EXAMINE_PROGRESS', 'MEETIMG_ARRANGEMENT', 'MY_DOCUMENT']
        const boxListAfterSortedOrder = shouldSortedOrder.reduce((acc, curr) => {
          const box = orgBoxList.find(item => item.code === curr)
          if(box) {
            return [...acc, box]
          } else {
            return acc
          }
        }, [])
        yield put({
          type: 'updateDatas',
          payload: {
            boxList: boxListAfterSortedOrder
          }
        })
        yield put({
          type: 'setProjectTabCurrentSelectedProject',
          payload: {
            projectId: projectId
          }
        })
        yield put({
          type: 'workbenchPublicDatas/updateDatas',
          payload: {
            board_id: projectId
          }
        })
      }else{
        message.warn('获取工作台看板数据失败， 请稍后再试')
      }
    },
    * getItemBoxFilter({ payload }, { select, call, put }) {
      const { board_ids, id, itemKey }= payload
      const res = yield call(getItemBoxFilter, {board_ids, id})
      const boxList = yield select(workbench_selectBoxList)
      let code = ''
      for(let i =0; i <boxList.length; i++) {
        if(id === boxList[i]['id']) {
          code = boxList[i]['code']
          break
        }
      }
      // const code = boxList[itemKey]['code']
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
          //教师
          case 'MY_SCHEDULING': //我的排课 --会议
            eventName= 'getSchedulingList'
            break
          case 'JOURNEY': //行程安排 --会议
            eventName= 'getJourneyList'
            break
          case 'TO_DO': //代办事项 --任务
            eventName= 'getTodoList'
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
      // let res = yield call(getMeetingList, payload)
      let res = yield call(getCurrentMeetingList)
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
    * getResponsibleTaskList(_, { select, call, put }) {
      let res = yield call(getCurrentResponsibleTask)
      // let res = yield call(getResponsibleTaskList, payload)
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
      // let res = yield call(getUploadedFileList, payload)
      let res = yield call(getcurrentOrgFileUploads)
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
      let res = yield call(getCurrentBackLogProcessList)
      // console.log('workbench/getBackLogProcessList', res)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            backLogProcessList: res.data
          }
        })
      }else{}
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
    //教师盒子数据 -start
    * getSchedulingList({ payload }, { select, call, put }) {
      let res = yield call(getMeetingList, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            schedulingList: res.data,
          }
        })
      }else{

      }
    },
    * getJourneyList({ payload }, { select, call, put }) {
      let res = yield call(getMeetingList, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            journeyList: res.data,
          }
        })
      }else{

      }
    },
    * getTodoList({ payload }, { select, call, put }) {
      let res = yield call(getTodoList, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            todoList: res.data
          }
        })
      }else{

      }
    },
    //教师盒子数据 --end

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
    * getBoxUsableList({ payload }, { select, call, put }) { //
      let res = yield call(getBoxUsableList, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            boxUsableList: res.data
          }
        })
      }else{
      }
    },
    * addBox({ payload }, { select, call, put }) { //
      const { box_type_ids, calback } = payload
      let res = yield call(addBox, { box_type_ids })
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getBoxList',
          payload: {
            calback: calback
          }
        })
        yield put({
          type: 'getBoxUsableList',
          payload: {}
        })
      }else{
      }
    },
    * deleteBox({ payload }, { select, call, put }) { //
      const { box_type_id, calback } = payload
      let res = yield call(deleteBox, { box_type_id })

      if(isApiResponseOk(res)) {
        yield put({
          type: 'getBoxList',
          payload: {
            calback: calback
          }
        })
        yield put({
          type: 'getBoxUsableList',
          payload: {}
        })

      }else{
        message.warn(res.message)
      }
    },
    * updateBox({ payload }, { select, call, put }) { //
      const { box_id, name} = payload
      const boxList = yield select(workbench_selectBoxList)
      let res = yield call(updateBox, payload)
      if(isApiResponseOk(res)) {
        for(let i = 0; i < boxList.length; i++ ){
          if(box_id == boxList[i]['id']) {
            boxList[i]['name'] = name
            break
          }
        }
      }else{
        message.warn(res.message)
      }
      yield put({
        type: 'updateDatas',
        payload: {
          boxList
        }
      })
    },

    * getArticleList({ payload }, { select, call, put }) { //
      const { appType, page_no } = payload
      const res = yield call(getArticleList, payload)
      const knowCityArticles = yield select(workbench_selectKnowCityArticles)
      const knowPolicyArticles = yield select(workbench_selectKnowPolicyArticles)
      const updateListName = appType === WE_APP_TYPE_KNOW_CITY ? `knowCityArticles` : `knowPolicyArticles`
      const odlist = appType === WE_APP_TYPE_KNOW_CITY? [...knowCityArticles] : [...knowPolicyArticles]
      if(isApiResponseOk(res)) {
        const newlist = Number(page_no) === 1? res.data:odlist.concat([...res.data])
        yield put({
          type: 'updateDatas',
          payload: {
            [updateListName]: newlist
          }
        })
      }else{}
    },
    * getArticleDetail({ payload }, { select, call, put }) { //
      yield put({
        type: 'updateDatas',
        payload: {
          spinning: true
        }
      })
      const res = yield call(getArticleDetail, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
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

    * filePreview({ payload }, { select, call, put }) {
      yield put({
        type: 'updateDatas',
        payload: {
          current_file_resource_id: payload['id']
        }
      })
      let res = yield call(filePreview, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            filePreviewIsUsable: res.data.isUsable,
            filePreviewUrl: res.data.url,
          }
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    * fileDownload({ payload }, { select, call, put }) {
      function openWin(url) {
        var element1 = document.createElement("a");
        element1.href= url;
        element1.id = 'openWin'
        document.querySelector('body').appendChild(element1)
        document.getElementById("openWin").click();//点击事件
        document.getElementById("openWin").parentNode.removeChild(document.getElementById("openWin"))
      }
      let res = yield call(fileDownload, payload)
      if(isApiResponseOk(res)) {
        const data = res.data
        if(data && data.length) {
          for (let val of data ) {
            // window.open(val)
            openWin(val)
          }
        }
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    //查询用户在当前组织内上传的文档
    * getCurrentOrgFileUploads({ payload }, { select, call, put }) {
      let res = yield call(getCurrentOrgFileUploads, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            currentOrgFileUploads: res.data || []
          }
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * postCommentToDynamics({ payload }, { select, call, put }) { //
      const res = yield call(postCommentToDynamics, payload)
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
    },
    emptyCurrentSelectedProjectMembersList(state, action) {
      return {
        ...state,
        datas: {...state.datas, currentSelectedProjectMembersList: []}
      }
    },
    emptyCurrentSelectedProjectFileFolderList(state, action) {
      return {
        ...state,
        datas: {...state.datas, currentSelectedProjectFileFolderList: []}
      }
    },
    setProjectTabCurrentSelectedProject(state, action) {
      const {projectId} = action.payload
      return {
        ...state,
        datas: {...state.datas, projectTabCurrentSelectedProject: projectId}
      }
    },
    reSortProjectList(state, action) {
      const {board_id} = action.payload
      const shouldPrepositionProject = state.datas.projectList.find(item => item.board_id === board_id)
      const othersProjects = state.datas.projectList.filter(item => item.board_id !== board_id)

      return {
        ...state,
        datas: {...state.datas, projectList: [shouldPrepositionProject, ...othersProjects]}
      }
    },
    updateUploadedFileNotificationIdList(state, action) {
      const {idsList} = action.payload
      return {
        ...state,
        datas: {...state.datas, uploadedFileNotificationIdList: idsList}
      }
    }
  },
});
