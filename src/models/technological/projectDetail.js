import { projectDetailInfo, updateProject, removeMenbers } from '../../services/technological/prjectDetail'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME } from "../../globalset/js/constant";
import { routerRedux } from "dva/router";
import { getUrlQueryString } from '../../utils/util'
import {
  addMenbersInProject, archivedProject, cancelCollection, deleteProject,collectionProject,
  quitProject
} from "../../services/technological/project";
import { getFileList,filePreview,fileCopy,fileDownload,fileRemove,fileMove,fileUpload,fileVersionist,recycleBinList,deleteFile,restoreFile,getFolderList,addNewFolder,updateFolder, } from '../../services/technological/file'
import { getProjectGoupList, addTaskGroup, addCardNewComment, getCardCommentList, getTaskGroupList, addTask, updateTask, deleteTask, archivedTask, changeTaskType, addChirldTask, addTaskExecutor, completeTask, addTaskTag, removeTaskTag, removeProjectMenbers } from "../../services/technological/task";
import { selectBreadcrumbList,selectCurrentParrentDirectoryId, selectAppsSelectKeyIsAreadyClickArray, selectAppsSelectKey, selectTaskGroupListIndex, selectTaskGroupList, selectTaskGroupListIndexIndex, selectDrawContent } from './select'
import Cookies from "js-cookie";
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
        board_id = Cookies.get('board_id')
        dispatch({
          type: 'updateDatas',
          payload:{
            //全局任务key
            appsSelectKey: undefined, //应用key
            appsSelectKeyIsAreadyClickArray: [], //点击过的appsSelectKey push进数组，用来记录无需重新查询数据
            //项目详情和任务
            projectInfoDisplay: false, //项目详情是否出现 projectInfoDisplay 和 isInitEntry 要同时为一个值
            isInitEntry: false, //是否初次进来项目详情
            drawContent: {}, //任务右方抽屉内容
            projectDetailInfoData: {}, //项目详情全部数据
            cardCommentList: [], //任务评论列表
            projectGoupList: [], //项目分组列表
            taskGroupList: [],  //任务列表
            // 文档
            // fileList: [], //文档列表
            // filedata_1: [], //文档列表--文件夹
            // filedata_2: [], //文档列表--文件
            // selectedRowKeys: [],//选择的列表项
            // isInAddDirectory: false, //是否正在创建文件家判断标志
            // moveToDirectoryVisiblie: false, // 是否显示移动到文件夹列表
            // openMoveDirectoryType: '', //打开移动或复制弹窗方法 ‘1’：多文件选择。 2：‘单文件选择’，3 ‘从预览入口进入’
            // currentFileListMenuOperatorId: '', //文件列表项点击菜单选项设置当前要操作的id
            // breadcrumbList: [],  //文档路劲面包屑{id: '123456', name: '根目录', type: '1'},从项目详情里面初始化
            // currentParrentDirectoryId: '', //当前文件夹id，根据该id来判断点击文件或文件夹时是否打开下一级，从项目详情里面初始化
            // isInOpenFile: false, //当前是否再打开文件状态，用来判断文件详情是否显示
            // treeFolderData: {}, //文件夹树状结构
            // filePreviewIsUsable: true, //文件是否可以预览标记
            // filePreviewUrl: '',  //预览文件url
            // filePreviewCurrentId: '', //当前预览的文件id
            // filePreviewCurrentVersionId: '', //当前预览文件版本id
            // filePreviewCurrentVersionList: [], //预览文件的版本列表
            // filePreviewCurrentVersionKey: 0, //预览文件选中的key

            //流程

            node_type: '1', //节点类型
            processCurrentEditStep: 0, //编辑第几步，默认 0
            processCurrentEditData: {
              "name":"编辑节点名称",//节点名称
              "node_type":"1",//节点类型：1代表里程碑节点
              "description":"",
              "deadline_type":"1",//完成期限类型 1=无期限 2=启动流程时指定 3=固定天数
              "deadline_value":"3",//完成期限值
              "assignee_type":"1",//审批人类型 1=任何人 2=启动流程时指定 3=固定人选
              "assignees":"",//审批人(id) 多个逗号隔开
              "transfer_mode":"1",//流转方式 1=自由选择 2= 下一步
              "enable_revocation":"1",//是否可撤回 1=可撤回 0=不可撤回
              "enable_opinion":"1"//是否填写意见  1=填写 0=不填写
            },

            processEditDatas: [
              {
                "name":"编辑节点名称",//节点名称
                "node_type":"1",//节点类型：1代表里程碑节点
                "description":"",
                "deadline_type":"1",//完成期限类型 1=无期限 2=启动流程时指定 3=固定天数
                "deadline_value":"1",//完成期限值
                "assignee_type":"1",//审批人类型 1=任何人 2=启动流程时指定 3=固定人选
                "assignees":"",//推进人(id) 多个逗号隔开
                "transfer_mode":"1",//流转方式 1=自由选择 2= 下一步
                "enable_revocation":"1",//是否可撤回 1=可撤回 0=不可撤回
                "enable_opinion":"1"//是否填写意见  1=填写 0=不填写
              },

            ], //json数组，每添加一步编辑内容往里面put进去一个obj,刚开始默认含有一个里程碑的
            processEditDatasRecords: [
              { 'node_type': '1',
                'alltypedata': [
                  {
                    "name":"编辑节点名称",//节点名称
                    "node_type":"1",//节点类型：1代表里程碑节点
                    "description":"",
                    "deadline_type":"1",//完成期限类型 1=无期限 2=启动流程时指定 3=固定天数
                    "deadline_value":"1",//完成期限值
                    "is_workday":"0",
                    "assignee_type":"1",//审批人类型 1=任何人 2=启动流程时指定 3=固定人选
                    "assignees":"",//审批人(id) 多个逗号隔开
                    "transfer_mode":"1",//流转方式 1=自由选择 2= 下一步
                    "enable_revocation":"1",//是否可撤回 1=可撤回 0=不可撤回
                    "enable_opinion":"1"//是否填写意见  1=填写 0=不填写
                  },
                  {
                    "name":"编辑节点名称",
                    "node_type":"2",//节点类型：2代表上传节点
                    "description":"",
                    "deadline_type":"1",//完成期限类型 1=无期限 2=启动流程时指定 3=固定天数
                    "deadline_value":"1",//完成期限值
                    "is_workday":"0",
                    "assignee_type":"1",//审批人类型 1=任何人 2=启动流程时指定 3=固定人选
                    "assignees":"",//审批人(id) 多个逗号隔开
                    "transfer_mode":"1",//流转方式 1=自由选择 2= 下一步
                    "enable_revocation":"1",//是否可撤回 1=可撤回 0=不可撤回
                    "enable_opinion":"1",//是否填写意见  1=填写 0=不填写
                    "requires_data":{
                      "limit_file_num":"0",//限制文件上传数量 0=不限制
                      "limit_file_type":"1,2,3,4",//限制上传类型(文件格式)1=文档 2=图像 3=音频 4=视频
                      "limit_file_size":"20"//限制文件大小
                    }
                  },
                  {
                    "name":"编辑节点名称",
                    "node_type":"3",//节点类型：3代表填写节点
                    "description":"",
                    "deadline_type":"1",//完成期限类型 1=无期限 2=启动流程时指定 3=固定天数
                    "deadline_value":"1",//完成期限值
                    "is_workday":"0",
                    "assignee_type":"1",//审批人类型 1=任何人 2=启动流程时指定 3=固定人选
                    "assignees":"",//审批人(id) 多个逗号隔开
                    "transfer_mode":"1",//流转方式 1=自由选择 2= 下一步
                    "enable_revocation":"1",//是否可撤回 1=可撤回 0=不可撤回
                    "enable_opinion":"1",//是否填写意见  1=填写 0=不填写
                    "forms_data":[
                      {
                        "field_type":"1",//字段类型 1=输入框
                        "property_name":"输入框",//属性名称(标题)
                        "default_value":"默认值",//默认值
                        "verification_rule":"email",//校验规则 '' =不校验格式 mobile = 手机号码，tel = 座机，ID_card = 身份证号码，chinese_name = 中文名，url = 网址,qq = QQ号，postal_code = 邮政编码，positive_integer = 正整数，negative = 负数，two_decimal_places = 精确到两位小数
                        "val_length":"20",//长度
                        "is_required":"1"//是否必须 1=必须 0=不是必须
                      },
                      {
                        "field_type":"2",//字段类型 2=日期选择
                        "property_name":"日期选择",//属性名称(标题)
                        "default_value":"默认值",//默认值
                        "verification_rule":"SINGLE_DATE_TIME",//校验规则 单个+日期+时分 = SINGLE_DATE_TIME ,单个+日期 = SINGLE_DATE,多个+日期+时分 = MULTI_DATE_TIME ,多个+日期 = MULTI_DATE
                        "is_required":"1"//是否必须 1=必须 0=不是必须
                      },
                      {
                        "field_type":"3",//字段类型 3=下拉框
                        "property_name":"下拉框",//属性名称(标题)
                        "default_value":"默认值",//默认值(预设值)
                        "verification_rule":"redio",//校验规则 redio = 单选， multiple = 多选 ，province = 省市区
                        "is_required":"1",//是否必须 1=必须 0=不是必须
                        "options_data":[
                          "one","two"
                        ]
                      }
                    ]
                  },
                  {
                    "name":"编辑节点名称",
                    "node_type":"4",//节点类型：4代表抄送节点
                    "description":"",
                    "deadline_type":"1",//完成期限类型 1=无期限 2=启动流程时指定 3=固定天数
                    "deadline_value":"1",//完成期限值
                    "is_workday":"0",
                    "assignee_type":"1",//抄送人类型 2=启动流程时指定 3=固定人选
                    "assignees":"",//抄送人 多个逗号隔开（传的是邮箱）
                    "transfer_mode":"1",//流转方式 1=自由选择 2= 下一步
                    "enable_revocation":"1",//是否可撤回 1=可撤回 0=不可撤回
                    "enable_opinion":"1"//是否填写意见  1=填写 0=不填写
                  },
                  {
                    "name":"编辑节点名称",
                    "node_type":"5",//节点类型：5代表审批节点
                    "description":"",
                    "approve_type":"1",//审批模式 1=串签 2=并签 3=汇签
                    "approve_value":"",//汇签值 当approve_type=3 时该字段有效
                    "deadline_type":"1",//完成期限类型 1=无期限 2=启动流程时指定 3=固定天数
                    "deadline_value":"1",//完成期限值
                    "is_workday":"0",
                    "assignee_type":"1",//审批人类型 1=任何人 2=启动流程时指定 3=固定人选
                    "assignees":"",//审批人(id) 多个逗号隔开
                    "transfer_mode":"1",//流转方式 1=自由选择 2= 下一步
                    "enable_revocation":"1",//是否可撤回 1=可撤回 0=不可撤回
                    "enable_opinion":"1"//是否填写意见  1=填写 0=不填写
                  },
                ]
              },
            ] //每一步的每一个类型，记录，数组的全部数据step * type
          }
        })
        if (location.pathname === '/technological/projectDetail') {
          dispatch({
            type: 'initProjectDetail',
            payload:{
              id: board_id
            }
          })
        }else{

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
        if(result.data.app_data[0] ) {
          if( result.data.app_data[0].key === 3) { //任务
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
          }else if(result.data.app_data[0].key === 4){ //文档
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
          }else {

          }
        }

      }else{
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

      if( appsSelectKey === 3) { //任务
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
      }else if(appsSelectKey === 2){ //流程

      }else if(appsSelectKey === 4) { //文档
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

    //文档----------start
    * getFileList({ payload }, { select, call, put }) {
      let res = yield call(getFileList, payload)
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
            filePreviewUrl: res.data.url
          }
        })
      }else{

      }
    },

    * fileUpload({ payload }, { select, call, put }) {
      let res = yield call(fileUpload, payload)
      if(isApiResponseOk(res)) {

      }else{

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
            board_id: board_id
          }
        })
      }else{

      }
    },
    * fileDownload({ payload }, { select, call, put }) {
      let res = yield call(fileDownload, payload)
      if(isApiResponseOk(res)) {
         const data = res.data
        if(data && data.length) {
           for (let val of data ) {
             window.open(val)
           }
        }
      }else{

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
            board_id: board_id
          }
        })
      }else{

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
             board_id: board_id
           }
          })
      }else{

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
              id: res.data[0].file_id
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
    * getFolderList({ payload }, { select, call, put }) {
      let res = yield call(getFolderList, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            treeFolderData: res.data
          }
        })
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
            board_id: board_id
          }
        })
      }else{

      }
    },
    * updateFolder({ payload }, { select, call, put }) {
      let res = yield call(updateFolder, payload)
      if(isApiResponseOk(res)) {

      }else{

      }
    },
    //文档----------end


    //项目增删改查--start
    * projectDetailInfo({ payload }, { select, call, put }) { //查看项目详情信息
      const { id } = payload
      let res = yield call(projectDetailInfo, id)
      const appsSelectKey = yield select(selectAppsSelectKey)
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

    * removeMenbers({ payload }, { select, call, put }) { //
      let res = yield call(removeMenbers, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'projectDetailInfo',
          payload:{
            id: board_id
          }
        })
      }else{
      }
    },

    * updateProject({ payload }, { select, call, put }) { //
      let res = yield call(updateProject, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'projectDetailInfo',
          payload:{
            id: board_id
          }
        })
      }else{
      }
    },

    * collectionProject({ payload }, { select, call, put }) {
      const { id } = payload
      let res = yield call(collectionProject, id)
      if(isApiResponseOk(res)) {

      }else{

      }
    },

    * cancelCollection({ payload }, { select, call, put }) {
      const { id } = payload
      let res = yield call(cancelCollection, id)
      if(isApiResponseOk(res)) {

      }else{

      }
    },

    * quitProject({ payload }, { select, call, put }) {
      let res = yield call(quitProject, payload)
      if(isApiResponseOk(res)) {

      }else{

      }
    },

    * archivedProject({ payload }, { select, call, put }) {
      let res = yield call(archivedProject, payload)
      if(isApiResponseOk(res)) {

      }else{

      }
    },

    * addMenbersInProject({ payload }, { select, call, put }) {
      let res = yield call(addMenbersInProject, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'projectDetailInfo',
          payload:{
            id: board_id
          }
        })
      }else{

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
      }else{
      }
    },

    * getTaskGroupList({ payload }, { select, call, put }) { //
      let res = yield call(getTaskGroupList, payload)
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
      if(isApiResponseOk(res)) {
         yield put({
           type: 'getTaskGroupList',
           payload: {
             type: '2',
             board_id: board_id,
             arrange_type: '1'
           }
         })
      }else{
      }
    },

    * updateTask({ payload }, { select, call, put }) { //
      const { updateObj } = payload
      let res = yield call(updateTask, updateObj)
      if(isApiResponseOk(res)) {
        // yield put({
        //   type: 'updateDatas',
        //   payload: {
        //     drawContent
        //   }
        // })
      }else{
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
      }else{
      }
    },

    * archivedTask({ payload }, { select, call, put }) { //
      let res = yield call(archivedTask, payload)
      if(isApiResponseOk(res)) {

      }else{
      }
    },

    * changeTaskType({ payload }, { select, call, put }) { //
      const { requestObj, indexObj } = payload
      const { board_id } = requestObj
      const { taskGroupListIndex, taskGroupListIndex_index } = indexObj
      let res = yield call(changeTaskType, requestObj)

      if(isApiResponseOk(res)) {
        Cookies.set('board_id', board_id,{expires: 30, path: ''})
        yield  put({
          type: 'projectDetailInfo',
          payload:{
            id: Cookies.get('board_id')
          }
        })
        yield  put({
          type: 'getProjectGoupList',
          payload:{
          }
        })
        yield  put({
          type: 'putTask',
          payload: indexObj
        })
      }else{
      }
    },

    * addChirldTask({ payload }, { select, call, put }) { //
      const { length } = payload
      const newPayload = {...payload}
      newPayload.executors ? delete newPayload.executors: '' //去掉不需要的数据
      let res = yield call(addChirldTask, newPayload)
      const drawContent = yield select(selectDrawContent) //  获取到全局设置filter,分页设置
      if(isApiResponseOk(res)) {
        drawContent.child_data[length -1] = res.data || payload
        // yield put({
        //   type: 'updateDatas',
        //   payload:{
        //     drawContent,
        //   }
        // })
      }else{
      }
    },

    * addTaskExecutor({ payload }, { select, call, put }) { //
      let res = yield call(addTaskExecutor, payload)
      if(isApiResponseOk(res)) {

      }else{
      }
    },

    * completeTask({ payload }, { select, call, put }) { //
      let res = yield call(completeTask, payload)
      if(isApiResponseOk(res)) {
          yield put({
            type: 'projectDetailInfo',
            payload:{
              id: board_id
            }
          })
      }else{
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
      }else{
      }
    },

    * removeTaskTag({ payload }, { select, call, put }) { //
      let res = yield call(removeTaskTag, payload)
      if(isApiResponseOk(res)) {

      }else{
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

      }else{
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
