import { getProjectRoles,setMemberRoleInProject,projectDetailInfo, updateProject, removeMenbers } from '../../services/technological/prjectDetail'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import {MESSAGE_DURATION_TIME, TASKS, PROJECTS, MEMBERS} from "../../globalset/js/constant";
import { routerRedux } from "dva/router";
import { getUrlQueryString } from '../../utils/util'
import {
  addMenbersInProject, archivedProject, cancelCollection, deleteProject, collectionProject,
  quitProject, getAppsList, addProjectApp
} from "../../services/technological/project";
import {getFileCommitPoints,getPreviewFileCommits,addFileCommit,deleteCommit ,getFileList,filePreview,fileCopy,fileDownload,fileRemove,fileMove,fileUpload,fileVersionist,recycleBinList,deleteFile,restoreFile,getFolderList,addNewFolder,updateFolder, } from '../../services/technological/file'
import { removeTaskExecutor, deleteTaskFile,deleteTaskGroup,updateTaskGroup, getProjectGoupList, addTaskGroup, addCardNewComment, getCardCommentList, getTaskGroupList, addTask, updateTask, deleteTask, archivedTask, changeTaskType, addChirldTask, addTaskExecutor, completeTask, addTaskTag, removeTaskTag, removeProjectMenbers,getBoardTagList, updateBoardTag,toTopBoardTag,deleteBoardTag, deleteCardNewComment } from "../../services/technological/task";
import { selectFilePreviewCommitPointNumber, selectProjectDetailInfoData,selectGetTaskGroupListArrangeType,selectCurrentProcessInstanceId,selectDrawerVisible,selectBreadcrumbList,selectCurrentParrentDirectoryId, selectAppsSelectKeyIsAreadyClickArray, selectAppsSelectKey, selectTaskGroupListIndex, selectTaskGroupList, selectTaskGroupListIndexIndex, selectDrawContent } from './select'
import Cookies from "js-cookie";
import { fillFormComplete,getProessDynamics, getProcessTemplateList, saveProcessTemplate, getTemplateInfo, getProcessList,createProcess,completeProcessTask,getProcessInfo, rebackProcessTask, resetAsignees, rejectProcessTask } from '../../services/technological/process'
import { processEditDatasConstant, processEditDatasRecordsConstant } from '../../routes/Technological/components/ProjectDetail/Process/constant'
import {currentNounPlanFilterName} from "../../utils/businessFunction";
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
            console.log('projectDetail',JSON.parse(JSON.parse(e.newValue)),JSON.parse(JSON.parse(e.newValue)).type)
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
            Cookies.set('updateNewMessageItem_2', true,{expires: 30, path: ''})
          }
        }
        board_id = Cookies.get('board_id')
        const initialData = () => {
          dispatch({
            type: 'updateDatas',
            payload:{
              projectRoles: [], //项目角色
              //全局任务key
              appsSelectKey: undefined, //应用key
              appsSelectKeyIsAreadyClickArray: [], //点击过的appsSelectKey push进数组，用来记录无需重新查询数据
              appsList: [], //全部app列表
              //项目详情和任务
              projectInfoDisplay: false, //项目详情是否出现 projectInfoDisplay 和 isInitEntry 要同时为一个值
              isInitEntry: false, //是否初次进来项目详情
              drawContent: {}, //任务右方抽屉内容
              drawerVisible: false, //查看任务的抽屉是否可见
              projectDetailInfoData: {}, //项目详情全部数据
              cardCommentList: [], //任务评论列表
              projectGoupList: [], //项目分组列表
              taskGroupList: [],  //任务列表
              boardTagList: [], //项目标签列表
              getTaskGroupListArrangeType: '1', //1按分组 2按执行人 3按标签

              // 文档
              fileList: [], //文档列表
              filedata_1: [], //文档列表--文件夹
              filedata_2: [], //文档列表--文件
              selectedRowKeys: [],//选择的列表项
              isInAddDirectory: false, //是否正在创建文件家判断标志
              moveToDirectoryVisiblie: false, // 是否显示移动到文件夹列表
              openMoveDirectoryType: '', //打开移动或复制弹窗方法 ‘1’：多文件选择。 2：‘单文件选择’，3 ‘从预览入口进入’
              currentFileListMenuOperatorId: '', //文件列表项点击菜单选项设置当前要操作的id
              breadcrumbList: [],  //文档路劲面包屑{id: '123456', name: '根目录', type: '1'},从项目详情里面初始化
              currentParrentDirectoryId: '', //当前文件夹id，根据该id来判断点击文件或文件夹时是否打开下一级，从项目详情里面初始化
              isInOpenFile: false, //当前是否再打开文件状态，用来判断文件详情是否显示
              treeFolderData: {}, //文件夹树状结构
              filePreviewIsUsable: true, //文件是否可以预览标记
              filePreviewUrl: '',  //预览文件url
              filePreviewCurrentId: '', //当前预览的文件resource_id
              filePreviewCurrentFileId: '', //当前预览的文件id
              filePreviewCurrentVersionId: '', //当前预览文件版本id
              filePreviewCurrentVersionList: [], //预览文件的版本列表
              filePreviewCurrentVersionKey: 0, //预览文件选中的key
              filePreviewCommits: [],//文件评论列表
              filePreviewPointNumCommits: [], //文件评论列表某个点的评论列表
              filePreviewCommitPoints: [], //文件图评点列表
              filePreviewCommitType: '0', //新增评论 1 回复圈点评论
              filePreviewCommitPointNumber: '',//评论当前的点
              filePreviewIsRealImage: true, //当前预览的图片是否真正图片
              seeFileInput: '',//查看文件详情入口
              //流程
              processPageFlagStep: '1', //"1""2""3""4"分别对应欢迎，编辑，确认，详情界面,默认1
              node_type: '1', //节点类型， 默认1
              processCurrentEditStep: 0, //编辑第几步，默认 0
              processEditDatas: JSON.parse(JSON.stringify(processEditDatasConstant)), //json数组，每添加一步编辑内容往里面put进去一个obj,刚开始默认含有一个里程碑的
              processEditDatasRecords: JSON.parse(JSON.stringify(processEditDatasRecordsConstant)) ,//每一步的每一个类型，记录，数组的全部数据step * type
              processTemplateList: [], //流程模板列表
              templateInfo: {},  //所选择的流程模板的信息数据
              processInfo: {},  //所选中的流程的信息
              processList: [],   //流程列表
              processDynamics: [], //流程动态列表,
              currentProcessInstanceId: '', //当前查看的流程实例id

              //  团队展示发布
              teamShowCertainOneShow: true, //编辑的时候展示，提交时设为false
              editTeamShowPreview: false, //编辑预览状态
              editTeamShowSave: false,  //编辑保存状态
            }
          })
        }
        initialData()

        if (location.pathname.indexOf('/technological/projectDetail') !== -1) {
          dispatch({ //查询项目角色列表
            type: 'getProjectRoles',
            payload:{
              type: '2',
            }
          })
          dispatch({
            type: 'initProjectDetail',
            payload:{
              id: board_id
            }
          })
          dispatch({
            type: 'getAppsList',
            payload: {
              type:'2'
            }
          })

          //监听消息存储在localstorage变化
          window.addEventListener('setMessageItemEvent_2',evenListentNewMessage,false);
        }else{
          window.removeEventListener('setMessageItemEvent_2',evenListentNewMessage,false);
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
          payload:{
            projectDetailInfoData: result.data,
            appsSelectKey: appsSelectKey || (result.data.app_data[0]? result.data.app_data[0].key : 1),//设置默认
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
        payload:{
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

    //流程
    * getProcessTemplateList({ payload }, { select, call, put }) {
      const { board_id, calback } = payload
      let res = yield call(getProcessTemplateList, {board_id})
      if(isApiResponseOk(res)) {
        yield put({
            type: 'updateDatas',
            payload:{
              processTemplateList: res.data || []
            }
          })
        if(typeof calback === 'function') {
          calback()
        }
      }else{

      }
    },
    //保存流程模板
    * saveProcessTemplate({ payload }, { select, call, put }) {
      let res = yield call(saveProcessTemplate, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getProcessTemplateList',
          payload: {
            board_id: board_id,
            calback: function () {
              message.success('保存模板成功', MESSAGE_DURATION_TIME)
            }
          }
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    // 直接启动时保存模板但不保留，查询该模板，将数据保留用于启动流程
    * directStartSaveTemplate({ payload }, { select, call, put }) {
      let res = yield call(saveProcessTemplate, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getTemplateInfo',
          payload: res.data.flow_template_id
        })
      }else{

      }
    },
    * getTemplateInfo({ payload }, { select, call, put }) {
      let res = yield call(getTemplateInfo, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            templateInfo: res.data,
            processEditDatas: res.data.nodes,
            processPageFlagStep: '3'
          }
        })
      }else{

      }
    },
    * getProcessList({ payload }, { select, call, put }) {
      let res = yield call(getProcessList, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            processList: res.data
          }
        })
      }else{

      }
    },
    * createProcess({ payload }, { select, call, put }) {
      const res = yield call(createProcess, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getProcessList',
          payload: {
            board_id: board_id,
            type: '1'
          }
        })
        yield put({
          type: 'getProcessInfo',
          payload:  {
            id: res.data.id
          }
        })
      }else{
        message.warn(res.message)
      }
    },
    * getProcessInfo({ payload }, { select, call, put }) {
      yield put({
        type: 'updateDatas',
        payload: {
          currentProcessInstanceId: payload
        }
      })
      const { id, calback } = payload
      let res = yield call(getProcessInfo, id)
      if(isApiResponseOk(res)) {
        //设置当前节点排行,数据返回只返回当前节点id,要根据id来确认当前走到哪一步
        const curr_node_id = res.data.curr_node_id
        let curr_node_sort
        for (let i=0; i<res.data.nodes.length; i++ ) {
          if(curr_node_id === res.data.nodes[i].id) {
            curr_node_sort = res.data.nodes[i].sort
            break
          }
        }
        curr_node_sort = curr_node_sort || res.data.nodes.length + 1 //如果已全部完成了会是一个undefind,所以给定一个值
        yield put({
          type: 'updateDatas',
          payload: {
            processInfo: {...res.data, curr_node_sort},
            processEditDatas: res.data.nodes || [] ,
            processPageFlagStep: '4'
          }
        })
        //查询流程动态
        const res2 = yield call(getProessDynamics,{flow_instance_id: id})
        if(isApiResponseOk(res2)) {
          yield put({
            type: 'updateDatas',
            payload: {
              processDynamics: res2.data
            }
          })
        }else{

        }
        if(typeof calback === 'function') {
          calback()
        }
      }else{

      }
    },
    * listenWsProcessDynamics({ payload }, { select, call, put }) {
      //查询流程动态
      const { newsData } = payload
      const id = newsData.rela_id
      const newsUserId = newsData.userId
      const currentUserId = JSON.parse(Cookies.get('userInfo')).id
      const currentProcessInstanceId = yield select(selectCurrentProcessInstanceId)
      console.log('进入查询状态之前', id, currentProcessInstanceId, newsUserId, currentUserId)

      // 当且仅当发送消息的用户不是当前用户， 当前查看的流程id和推送的id一样
      if(id === currentProcessInstanceId && newsUserId !== currentUserId) {
        console.log('进入查询状态')
        const res = yield call(getProessDynamics,{flow_instance_id: id})
        if(isApiResponseOk(res)) {
          yield put({
            type: 'updateDatas',
            payload: {
              processDynamics: res.data
            }
          })
        }
        console.log('进入查询状态之后')
      }
    },
    * completeProcessTask({ payload }, { select, call, put }) {
      let res = yield call(completeProcessTask, payload)
      const { instance_id } = payload
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getProcessInfo',
          payload:  {
            id: instance_id,
            calback: function () {
              message.success('已完成节点',MESSAGE_DURATION_TIME)
            }
          }
        })
      }else{
         message.warn(res.message)
      }
    },
    * fillFormComplete({ payload }, { select, call, put }) {
      let res = yield call(fillFormComplete, payload)
      const { instance_id } = payload
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getProcessInfo',
          payload:  {
            id: instance_id,
            calback: function () {
              message.success('已完成节点',MESSAGE_DURATION_TIME)
            }
          }
        })
      }else{
        message.warn(res.message)
      }
    },

    * rebackProcessTask({ payload }, { select, call, put }) {
      let res = yield call(rebackProcessTask, payload)
      const { instance_id } = payload
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getProcessInfo',
          payload:  {
            id: instance_id,
            calback: function () {
              message.success('撤回成功',MESSAGE_DURATION_TIME)
            }
          }
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    * rejectProcessTask({ payload }, { select, call, put }) {
      let res = yield call(rejectProcessTask, payload)
      const { instance_id } = payload
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getProcessInfo',
          payload:  {
            id: instance_id,
            calback: function () {
              message.success('已拒绝',MESSAGE_DURATION_TIME)
            }
          }
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    * resetAsignees({ payload }, { select, call, put }) {
      let res = yield call(resetAsignees, payload)
      const { instance_id } = payload
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getProcessInfo',
          payload:  {
            id: instance_id,
            calback: function () {
              message.success('推进人设置成功',MESSAGE_DURATION_TIME)
            }
          }
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)

      }
    },
    //文档----------start
    * getFileList({ payload }, { select, call, put }) {
      const { folder_id, calback } = payload
      let res = yield call(getFileList, {folder_id})

      if(isApiResponseOk(res)) {
        const filedata_1 = res.data.folder_data;
        for(let val of filedata_1) {
          val['file_name'] = val['folder_name']
          val['file_id'] = val['folder_id']
        }
        const filedata_2 = res.data.file_data;
        yield put({
          type: 'updateDatas',
          payload: {
            filedata_1,
            filedata_2,
            fileList: [...filedata_1, ...filedata_2]
          }
        })
        if (typeof calback === 'funciton') {
          calback()
        }
      }else{

      }
    },
    * getFolderList({ payload }, { select, call, put }) {
      const { board_id, calback } = payload
      let res = yield call(getFolderList, {board_id})
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            treeFolderData: res.data
          }
        })
        if (typeof calback === 'function') {
          calback()
        }
      }else{

      }
    },
    * filePreview({ payload }, { select, call, put }) {
      let res = yield call(filePreview, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            filePreviewIsUsable: res.data.isUsable,
            filePreviewUrl: res.data.url,
            filePreviewIsRealImage: res.data.isRealImage,
          }
        })
        const { file_id } = payload
        yield put({
          type: 'getPreviewFileCommits',
          payload: {
            id: file_id
          }
        })
        yield put({
          type: 'getFileCommitPoints',
          payload: {
            id: file_id
          }
        })

      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * fileUpload({ payload }, { select, call, put }) {
      let res = yield call(fileUpload, payload)
      if(isApiResponseOk(res)) {

      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    * fileCopy({ payload }, { select, call, put }) {
      let res = yield call(fileCopy, payload)
      const currentParrentDirectoryId = yield select(selectCurrentParrentDirectoryId)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            selectedRowKeys: []
          }
        })
        yield put({
          type: 'getFileList',
          payload: {
            folder_id: currentParrentDirectoryId
          }
        })
        yield put({
          type: 'getFolderList',
          payload: {
            board_id: board_id,
            calback:function () {
              message.success('复制成功', MESSAGE_DURATION_TIME)
            }
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
    * fileRemove({ payload }, { select, call, put }) {
      let res = yield call(fileRemove, payload)
      const currentParrentDirectoryId = yield select(selectCurrentParrentDirectoryId)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            selectedRowKeys: []
          }
        })
        yield put({
          type: 'getFileList',
          payload: {
            folder_id: currentParrentDirectoryId
          }
        })
        yield put({
          type: 'getFolderList',
          payload: {
            board_id: board_id,
            calback:function () {
              message.success('已成功移入回收站', MESSAGE_DURATION_TIME)
            }
          }
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    * fileMove({ payload }, { select, call, put }) {
      let res = yield call(fileMove, payload)
      const currentParrentDirectoryId = yield select(selectCurrentParrentDirectoryId)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            selectedRowKeys: []
          }
        })
         yield put({
           type: 'getFileList',
           payload: {
             folder_id: currentParrentDirectoryId
           }
         })
         yield put({
           type: 'getFolderList',
           payload: {
             board_id: board_id,
             calback:function () {
               message.success('移动成功', MESSAGE_DURATION_TIME)
             }
           }
          })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    * fileVersionist({ payload }, { select, call, put }) {
      let res = yield call(fileVersionist, payload)
      const { isNeedPreviewFile } = payload //是否需要重新读取文档
      const breadcrumbList = yield select(selectBreadcrumbList)
      const currentParrentDirectoryId = yield select(selectCurrentParrentDirectoryId)

      if(isApiResponseOk(res)) {
        breadcrumbList[breadcrumbList.length - 1] = res.data[0]
        yield put({
          type: 'updateDatas',
          payload:{
            filePreviewCurrentVersionList: res.data,
            breadcrumbList,
          }
        })
        if(isNeedPreviewFile) {
          yield put({
            type: 'filePreview',
            payload: {
              id: res.data[0].file_resource_id
            }
          })
          yield put({
            type: 'getFileList',
            payload: {
              folder_id: currentParrentDirectoryId,
            }
          })
        }
      }else{

      }
    },
    * recycleBinList({ payload }, { select, call, put }) {
      let res = yield call(recycleBinList, payload)
      if(isApiResponseOk(res)) {

      }else{

      }
    },
    * deleteFile({ payload }, { select, call, put }) {
      let res = yield call(deleteFile, payload)
      if(isApiResponseOk(res)) {

      }else{

      }
    },
    * restoreFile({ payload }, { select, call, put }) {
      let res = yield call(restoreFile, payload)
      if(isApiResponseOk(res)) {

      }else{

      }
    },
    * addNewFolder({ payload }, { select, call, put }) {
      let res = yield call(addNewFolder, payload)
      const { parent_id } = payload
      if(isApiResponseOk(res)) {
         yield put({
           type: 'getFileList',
           payload: {
             folder_id: parent_id
           }
         })
        yield put({
          type: 'getFolderList',
          payload: {
            board_id: board_id,
            calback:function () {
              message.success('已成功添加文件夹', MESSAGE_DURATION_TIME)
            }
          }
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    * updateFolder({ payload }, { select, call, put }) {
      let res = yield call(updateFolder, payload)
      if(isApiResponseOk(res)) {

      }else{

      }
    },
    * getPreviewFileCommits({ payload }, { select, call, put }) {
      const  filePreviewCommitPointNumber = yield select(selectFilePreviewCommitPointNumber)
      const { type } = payload
      let name = type != 'point' ? 'filePreviewCommits':'filePreviewPointNumCommits'
      let res = yield call(getPreviewFileCommits, {...payload, point_number: type == 'point'?filePreviewCommitPointNumber: ''})

      if(isApiResponseOk(res)) {
         yield put({
           type: 'updateDatas',
           payload: {
             [name]: res.data ,
           }
         })
      }else{

      }
    },
    * getFileCommitPoints({ payload }, { select, call, put }) {
      let res = yield call(getFileCommitPoints, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            filePreviewCommitPoints: res.data ,
          }
        })
      }else{

      }
    },

    * addFileCommit({ payload }, { select, call, put }) {
      let res = yield call(addFileCommit, payload)
      const { file_id,type, filePreviewCommitType = '0' } = payload
      //filePreviewCommitType 0 新增 1 回复
      if(isApiResponseOk(res)) {
        const flag = res.data.flag

        yield put({
          type: 'updateDatas',
          payload: {
            filePreviewCommitPointNumber: flag
          }
        })

        if(type == '1') {
          yield put({
            type: 'getPreviewFileCommits',
            payload: {
              id: file_id,
              type: 'point',
              point_number: flag
            }
          })
        }

        yield put({
          type: 'getPreviewFileCommits',
          payload: {
            id: file_id,
          }
        })

        yield put({
          type: 'getFileCommitPoints',
          payload: {
            id: file_id
          }
        })

      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)

      }
    },

    * deleteCommit({ payload }, { select, call, put }) {
      let res = yield call(deleteCommit, payload)
      const  filePreviewCommitPointNumber = yield select(selectFilePreviewCommitPointNumber)
      const { file_id, type, point_number } = payload
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getPreviewFileCommits',
          payload: {
            id: file_id,
          }
        })

        if(type === '1') {
          yield put({
            type: 'getPreviewFileCommits',
            payload: {
              id: file_id,
              type: 'point',
              point_number: filePreviewCommitPointNumber
            }
          })
        }

      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)

      }
    },

    //文档----------end


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
          payload:{
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
          payload:{
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
          payload:{
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
          payload:{
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
          payload:{
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

    //任务---start

    * addTaskGroup({ payload }, { select, call, put }) { //
      let res = yield call(addTaskGroup, payload)
      const { length } = payload
      const taskGroupList = yield select(selectTaskGroupList)
      if(isApiResponseOk(res)) {
        taskGroupList[length].list_id = res.data.id
        yield put({
          type: 'updateDatas',
          payload: {
            taskGroupList
          }
        })
        message.success(`添加${currentNounPlanFilterName(TASKS)}分组成功`, MESSAGE_DURATION_TIME)
        const delay = (ms) => new Promise(resolve => {
          setTimeout(resolve, ms)
        })
        yield call(delay, MESSAGE_DURATION_TIME*1000)
        yield put({
          type: 'getProjectGoupList',
          payload: {}
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * deleteTaskGroup({ payload }, { select, call, put }) { //
      let res = yield call(deleteTaskGroup, payload)
      const { itemKey = 0 } = payload
      const taskGroupList = yield select(selectTaskGroupList)
      if(isApiResponseOk(res)) {
        taskGroupList.splice(itemKey, 1)
        yield put({
          type: 'updateDatas',
          payload: {
            taskGroupList
          }
        })
        message.success(`删除${currentNounPlanFilterName(TASKS)}分组成功`, MESSAGE_DURATION_TIME)
        const delay = (ms) => new Promise(resolve => {
          setTimeout(resolve, ms)
        })
        yield call(delay, MESSAGE_DURATION_TIME*1000)
        yield put({
          type: 'getProjectGoupList',
          payload: {}
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * updateTaskGroup({ payload }, { select, call, put }) { //
      let res = yield call(updateTaskGroup, payload)
      const { itemKey = 0, name } = payload
      const taskGroupList = yield select(selectTaskGroupList)
      if(isApiResponseOk(res)) {
        taskGroupList[itemKey]['list_name'] = name
        yield put({
          type: 'updateDatas',
          payload: {
            taskGroupList
          }
        })
        message.success(`更新${currentNounPlanFilterName(TASKS)}分组成功`, MESSAGE_DURATION_TIME)
        const delay = (ms) => new Promise(resolve => {
          setTimeout(resolve, ms)
        })
        yield call(delay, MESSAGE_DURATION_TIME*1000)
        yield put({
          type: 'getProjectGoupList',
          payload: {}
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * getTaskGroupList({ payload }, { select, call, put }) { //
      const  { type, board_id, arrange_type, calback, operateType } = payload
      let res = yield call(getTaskGroupList, {type, arrange_type, board_id})
      if (typeof calback === 'function') {
        calback()
      }
      if(operateType === '1') { //代表分类查询选择
        yield put({
          type: 'updateDatas',
          payload:{
            taskGroupList: []
          }
        })
      }
      // message.destroy()
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload:{
            taskGroupList: res.data
          }
        })
      }else{
      }
    },

    * addTask({ payload }, { select, call, put }) { //
      let res = yield call(addTask, payload)
      let getTaskGroupListArrangeType = yield select(selectGetTaskGroupListArrangeType)
      if(isApiResponseOk(res)) {
         yield put({
           type: 'getTaskGroupList',
           payload: {
             type: '2',
             board_id: board_id,
             arrange_type: getTaskGroupListArrangeType,
             calback: function () {
               message.success('添加成功', MESSAGE_DURATION_TIME)
             }
           }
         })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * updateTask({ payload }, { select, call, put }) { //
      const { updateObj } = payload
      const taskGroupListIndex = yield select(selectTaskGroupListIndex) //
      const taskGroupListIndex_index = yield  select(selectTaskGroupListIndexIndex)
      const taskGroupList = yield select(selectTaskGroupList) //
      const drawContent = yield  select(selectDrawContent)
      const { description } = updateObj
      let res = yield call(updateTask, updateObj)
      if(isApiResponseOk(res)) {
        if(description) {
          drawContent['description'] = description
          taskGroupList[taskGroupListIndex]['card_data'][taskGroupListIndex_index]['description'] = description
        }
        yield put({
          type: 'updateDatas',
          payload: {
            drawContent,
            taskGroupList
          }
        })
        message.success('更新成功',MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * deleteTask({ payload }, { select, call, put }) { //
      const { id } = payload
      let res = yield call(deleteTask, id)
      if(isApiResponseOk(res)) {
        const taskGroupList = yield select(selectTaskGroupList)
        const taskGroupListIndex = yield select(selectTaskGroupListIndex) //  获取到全局设置filter,分页设置
        const taskGroupListIndex_index = yield  select(selectTaskGroupListIndexIndex)
        taskGroupList[taskGroupListIndex]['card_data'].splice(taskGroupListIndex_index, 1)
        yield put({
          type: 'updateDatas',
          payload:{
            taskGroupList
          }
        })
        message.success('删除成功',MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * updateChirldTask({ payload }, { select, call, put }) { //
      const { updateObj } = payload
      const taskGroupListIndex = yield select(selectTaskGroupListIndex) //
      const taskGroupListIndex_index = yield  select(selectTaskGroupListIndexIndex)
      const taskGroupList = yield select(selectTaskGroupList) //
      const drawContent = yield  select(selectDrawContent)
      const { description } = updateObj
      let res = yield call(updateTask, updateObj)
      if(isApiResponseOk(res)) {
        if(description) {
          drawContent['description'] = description
          taskGroupList[taskGroupListIndex]['card_data'][taskGroupListIndex_index]['description'] = description
        }
        yield put({
          type: 'updateDatas',
          payload: {
            drawContent,
            taskGroupList
          }
        })
        message.success('更新成功',MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * deleteChirldTask({ payload }, { select, call, put }) { //
      const {card_id, chirldDataIndex} = payload
      let res = yield call(deleteTask, card_id)
      if(isApiResponseOk(res)) {
        const taskGroupList = yield select(selectTaskGroupList)
        const taskGroupListIndex = yield select(selectTaskGroupListIndex) //  获取到全局设置filter,分页设置
        const taskGroupListIndex_index = yield  select(selectTaskGroupListIndexIndex)
        taskGroupList[taskGroupListIndex]['card_data'][taskGroupListIndex_index]['child_data'].splice(chirldDataIndex, 1)
        yield put({
          type: 'updateDatas',
          payload:{
            taskGroupList
          }
        })
        message.success('删除成功',MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * archivedTask({ payload }, { select, call, put }) { //
      let res = yield call(archivedTask, payload)
      if(isApiResponseOk(res)) {
        message.success(`已归档`,MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * changeTaskType({ payload }, { select, call, put }) { // 此方法注释掉的地方是先前做了任务跳转sss
      const { requestObj, indexObj } = payload
      // const { board_id } = requestObj
      // const { taskGroupListIndex, taskGroupListIndex_index } = indexObj
      let res = yield call(changeTaskType, requestObj)
      const getTaskGroupListArrangeType = yield select(selectGetTaskGroupListArrangeType)

      if(isApiResponseOk(res)) {
        //跳转操作
        // Cookies.set('board_id', board_id,{expires: 30, path: ''})
        // yield  put({
        //   type: 'projectDetailInfo',
        //   payload:{
        //     id: Cookies.get('board_id')
        //   }
        // })
        // yield  put({
        //   type: 'getProjectGoupList',
        //   payload:{
        //   }
        // })
        // yield  put({
        //   type: 'putTask',
        //   payload: indexObj
        // })
        yield put({
          type: 'getTaskGroupList',
          payload: {
            type: '2',
            board_id: board_id,
            arrange_type: getTaskGroupListArrangeType,
            calback: function () {
              message.success('移动成功', MESSAGE_DURATION_TIME)
            }
          }
        })
        yield put({
          type: 'updateDatas',
          payload: {
            drawerVisible: false
          }
        })

      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * addChirldTask({ payload }, { select, call, put }) { //
      const { length } = payload
      const newPayload = {...payload}
      newPayload.executors ? delete newPayload.executors: '' //去掉不需要的数据
      let res = yield call(addChirldTask, newPayload)
      const drawContent = yield select(selectDrawContent) //  获取到全局设置filter,分页设置
      if(isApiResponseOk(res)) {
        drawContent.child_data[0] =  payload
        drawContent.child_data[0]['card_id'] = res.data.id
        // yield put({
        //   type: 'updateDatas',
        //   payload:{
        //     drawContent,
        //   }
        // })
        message.success(`添加成功`, MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * addTaskExecutor({ payload }, { select, call, put }) { //
      let res = yield call(addTaskExecutor, payload)
      if(isApiResponseOk(res)) {
        message.success(`已成功设置执行人`, MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    * removeTaskExecutor({ payload }, { select, call, put }) { //
      let res = yield call(removeTaskExecutor, payload)
      if(isApiResponseOk(res)) {
        message.success(`已成功删除执行人`, MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    * completeTask({ payload }, { select, call, put }) { //
      const { is_realize  } = payload
      let res = yield call(completeTask, payload)
      if(isApiResponseOk(res)) {
          yield put({
            type: 'projectDetailInfo',
            payload:{
              id: board_id,
              calback: function () {
                message.success(is_realize === '1'? `已完成该${currentNounPlanFilterName(TASKS)}`: `已将该${currentNounPlanFilterName(TASKS)}设置未完成`, MESSAGE_DURATION_TIME)
              }
            }
          })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * removeTaskTag({ payload }, { select, call, put }) { //
      let res = yield call(removeTaskTag, payload)
      if(isApiResponseOk(res)) {
        message.success('已删除标签', MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * putTask({ payload }, { select, call, put }) {
      let res = yield call(getTaskGroupList,  {type: '2', board_id: Cookies.get('board_id'), arrange_type: '1'})
      const { taskGroupListIndex, taskGroupListIndex_index } = payload
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload:{
            taskGroupListIndex,
            taskGroupListIndex_index,
            taskGroupList: res.data,
            drawContent: res.data[taskGroupListIndex].card_data[taskGroupListIndex_index]
          }
        })
      }else{
      }
    },

    * removeProjectMenbers({ payload }, { select, call, put }) { //
      let res = yield call(removeProjectMenbers, payload)
      if(isApiResponseOk(res)) {
        message.success(`已从${currentNounPlanFilterName(PROJECTS)}移出该${currentNounPlanFilterName(MEMBERS)}`, MESSAGE_DURATION_TIME)
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * getProjectGoupList({ payload }, { select, call, put }) { //
      let res = yield call(getProjectGoupList, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            projectGoupList: res.data
          }
        })
      } else {

      }
    },

    * deleteTaskFile({ payload }, { select, call, put }) { //
      let res = yield call(deleteTaskFile, payload)
      if(isApiResponseOk(res)) {

      }else {

      }
    },

    * addTaskTag({ payload }, { select, call, put }) { //
      const { length } = payload
      let res = yield call(addTaskTag, payload)
      const drawContent = yield select(selectDrawContent) //  获取到全局设置filter,分页设置
      if(isApiResponseOk(res)) {
        drawContent.label_data[length-1].label_id = res.data.label_id
        yield put({
          type: 'updateDatas',
          payload:{
            drawContent
          }
        })
        yield put({
          type: 'getBoardTagList',
          payload: {
            board_id,
            calback: function () {
              message.success('添加任务标签成功', MESSAGE_DURATION_TIME)
            }
          }
        })
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * getBoardTagList({ payload }, { select, call, put }) { //
      const { board_id, calback } = payload
      let res = yield call(getBoardTagList, {board_id})
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            boardTagList: res.data
          }
        })
        if(calback && typeof calback === 'function') {
          calback()
        }
      }else {

      }
    },

    * updateBoardTag({ payload }, { select, call, put }) { //
      let res = yield call(updateBoardTag, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getBoardTagList',
          payload: {
            board_id,
            calback: function () {
              message.success('更新标签成功', MESSAGE_DURATION_TIME)
            }
          }
        })
      }else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * toTopBoardTag({ payload }, { select, call, put }) { //
      let res = yield call(toTopBoardTag, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getBoardTagList',
          payload: {
            board_id,
            calback: function () {
              message.success('已成功置顶该项目标签', MESSAGE_DURATION_TIME)
            }
          }
        })
      }else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * deleteBoardTag({ payload }, { select, call, put }) { //
      let res = yield call(deleteBoardTag, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getBoardTagList',
          payload: {
            board_id,
            calback: function () {
              message.success('已成功删除该项目标签', MESSAGE_DURATION_TIME)
            }
          }
        })
      }else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    //任务---end

    //评论---start
    * getCardCommentList({ payload }, { select, call, put }) { //
      const { id } = payload
      yield put({
        type: 'updateDatas',
        payload:{
          cardCommentList: []
        }
      })
      let res = yield call(getCardCommentList, id)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload:{
            cardCommentList: res.data
          }
        })
      }else{
      }
    },

    * addCardNewComment({ payload }, { select, call, put }) { //
      let res = yield call(addCardNewComment, payload)
      if(isApiResponseOk(res)) {
        const { card_id } = payload
        let res = yield call(getCardCommentList, card_id)
        if(isApiResponseOk(res)) {
          yield put({
            type: 'updateDatas',
            payload:{
              cardCommentList: res.data
            }
          })
        }else{
        }
      }else{
      }
    },

    * deleteCardNewComment({ payload }, { select, call, put }) { //
      const res = yield call(deleteCardNewComment, payload)
      if(isApiResponseOk(res)) {
        const { card_id } = payload
        const res = yield call(getCardCommentList, card_id)
        if(isApiResponseOk(res)) {
          yield put({
            type: 'updateDatas',
            payload:{
              cardCommentList: res.data
            }
          })
        }else{
        }
      }else{
        message.warn(res.message)
      }
    },

    * listenWsCardNewComment({ payload }, { select, call, put }) { //
      const { newsData } = payload
      const id = newsData.activityTypeId
      const newsUserId = newsData.userId
      const currentUserId = JSON.parse(Cookies.get('userInfo')).id
      const drawContent = yield select(selectDrawContent)
      const drawerVisible = yield select(selectDrawerVisible)
      const { card_id } = drawContent
      // 当且仅当发送消息的用户不是当前用户， 当前查看的任务id和推送的任务id一样,抽屉可见
      if(id === card_id && newsUserId !== currentUserId && drawerVisible) {
        let res = yield call(getCardCommentList, id)
        if(isApiResponseOk(res)) {
          yield put({
            type: 'updateDatas',
            payload:{
              cardCommentList: res.data
            }
          })
        }else{
        }
      }
    },

    //评论--end


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
