
import { message } from 'antd'
import {MEMBERS, MESSAGE_DURATION_TIME, ORGANIZATION} from "../../../globalset/js/constant";
import { routerRedux } from "dva/router";
import Cookies from "js-cookie";
import { initWs} from '../../../components/WsNewsDynamic'
import QueryString from 'querystring'
import {
  selectDrawContent,
  selectCardId,
  selectTaskGroupList,
  selectGetTaskGroupListArrangeType,
  selectProjectDetailBoardId,
  selectCurrentProcessTemplateList,
  selectCurrentProcessList,
  selectCurrentProcessInstanceId,
  selectCurrentParrentDirectoryId,
  selectFileList,
  selectFilePreviewCurrentFileId,
  selectFilePreviewCommits,
  selectFilePreviewPointNumCommits,
  selectFilePreviewCommitPointNumber,
  filePreviewCommitPoints,
  selectFilePreviewCommitPoints,
} from './../select'

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
let dispathes
export default {
  namespace: 'cooperationPush',
  state: [],
  subscriptions: {
    setup({ dispatch, history }) {
      dispathes = dispatch
      history.listen((location) => {
        message.destroy()
        //头部table key
        if (location.pathname.indexOf('/technological') !== -1) {
          //websocket连接判定
          setTimeout(function () {
            console.log('1111', Cookies.get('wsLinking'))
            if(Cookies.get('wsLinking') === 'false' || !Cookies.get('wsLinking')){
              // const calback = function (event) {
              //   dispatch({
              //     type: 'connectWsToModel',
              //     payload: {
              //       event
              //     }
              //   })
              // }
              // initWs(calback)
            }
            const calback = function (event) {
              dispatch({
                type: 'connectWsToModel',
                payload: {
                  event
                }
              })
            }
            initWs(calback)
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
    * connectWsToModel({ payload }, { call, put }) {
      const { event } = payload
      if(!event) {
        return
      }
      let data = event.data;
      //服务器端回复心跳内容
      if(data=="pong"){
        return;
      }
      data = JSON.parse(data)
      yield put({
        type: 'handleWsData',
        payload: {
          res: data
        }
      })
    },

    * handleWsData({ payload }, { call, put, select }) {
      const { res } = payload
      const { data } = res
      console.log('eee', data)

      const currentProjectBoardId = yield select(selectProjectDetailBoardId)

      let coperate = data[0] //协作
      let news = data[1] //消息
      //获取消息协作类型
      const coperateName = coperate.e
      const coperateType = coperateName.substring(0, coperateName.indexOf('/'))
      let coperateData = JSON.parse(coperate.d)
      console.log('eee', coperateData)

      const getAfterNameId = (coperateName) => { //获取跟在名字后面的id
        return coperateName.substring(coperateName.indexOf('/') + 1)
      }

      let board_id_
      switch (coperateType) {
        case 'change:card': //监听到修改任务
          const drawContent = yield select(selectDrawContent)
          const card_id = yield select(selectCardId)
          const operate_card_id = coperateName.substring(coperateName.indexOf('/') + 1)
          //如果当前查看的任务和推送的任务id一样，会发生更新
          if(card_id == operate_card_id) {
            dispathes({
              type: model_projectDetailTask('updateDatas'),
              payload: {
                drawContent: {...drawContent, ...coperateData}
              }
            })
          }
          break
        case 'change:cards':
          const taskGroupList = yield select(selectTaskGroupList)
          const { board_id, list_id, item = {card_name: '11', card_id: 'sss'} } = coperateData
          for(let i = 0; i < taskGroupList.length; i++ ) {
            if(list_id === taskGroupList[i]['list_id']){
              taskGroupList[i]['card_data'].unshift(item)
              break
            }
          }
          break
        case 'change:flow:template':
          board_id_ = getAfterNameId(coperateName)
          if(board_id_ == currentProjectBoardId) {
            const { flow_template_list = [] } = coperateData
            dispathes({
              type: model_projectDetailProcess('updateDatas'),
              payload: {
                processTemplateList: flow_template_list
              }
            })
          }
          break
        case 'change:flow:instance':
          board_id_
          if(board_id_ == currentProjectBoardId) {
            const processList = yield select(selectCurrentProcessList)
            processList.push(coperateData)
            dispathes({
              type: model_projectDetailProcess('updateDatas'),
              payload: {
                processList
              }
            })
          }
          break
        case 'change:flow':
          const currentProcessInstanceId = yield select(selectCurrentProcessInstanceId)
          const flow_id = getAfterNameId(coperateName)
          if(currentProcessInstanceId == flow_id) {
            const curr_node_id = coperateData.curr_node_id
            let curr_node_sort
            for (let i = 0; i < coperateData.nodes.length; i++ ) {
              if(curr_node_id === coperateData.nodes[i].id) {
                curr_node_sort = coperateData.nodes[i].sort
                break
              }
            }
            curr_node_sort = curr_node_sort || coperateData.nodes.length + 1 //如果已全部完成了会是一个undefind,所以给定一个值
            dispathes({
              type: model_projectDetailProcess('updateDatas'),
              payload: {
                processInfo: {...coperateData, curr_node_sort},
                processEditDatas: coperateData.nodes || [],
              }
            })
          }

          break
        case 'change:file':
          const currentParrentDirectoryId = yield select(selectCurrentParrentDirectoryId)
          const directoryId = getAfterNameId(coperateName)
          //当当前的文件夹id 和操作的文件id的所属文件夹id 一样
          if(currentParrentDirectoryId == directoryId) {
            const fileList = yield select(selectFileList)
            const fileType = coperateData.type

            const { status } = coperateData
            //status 2删除
            if(status == '2') {
              const { id } = coperateData
              for( let i =0; i < fileList.length; i++ ) {
                if(fileList[i]['file_id'] == id) {
                  fileList.splice(i, 1)
                  break
                }

              }
            } else {
              //fileType 2 表示新增文件 1 表示新增文件夹
              //处理数据结构根据projectDetailFile =》 getFileList方法
              if(fileType == '2') {
                fileList.push(coperateData)
                dispathes({
                  type: model_projectDetailFile('updateDatas'),
                  payload: {
                    fileList
                  }
                })
              } else if(fileType == '1') {
                //先文件夹后文件
                const obj = {...coperateData, file_name: coperateData['folder_name'], file_id: coperateData['folder_id']}
                for(let i = 0; i < fileList.length; i++) {
                  if(fileList[i].type == '2') {
                    if(i > 0) {
                      fileList.splice(i, 0, obj )
                    } else {
                      fileList.unshift(obj )
                    }
                    break
                  }
                }
              }
            }
            dispathes({
              type: model_projectDetailFile('updateDatas'),
              payload: {
                fileList
              }
            })

          }
          break
        case 'change:file:comment':
          const comment_file_id = getAfterNameId(coperateName)
          let file_id = yield select(selectFilePreviewCurrentFileId)
          if(comment_file_id == file_id) { //如果推送评论的文档id和查看的id是一样
            const filePreviewCommits = yield select(selectFilePreviewCommits) || []
            const filePreviewPointNumCommits = yield select(selectFilePreviewPointNumCommits) || []
            const filePreviewCommitPointNumber = yield select(selectFilePreviewCommitPointNumber) || []
            const filePreviewCommitPoints = yield select(selectFilePreviewCommitPoints) || []

            let pointNo = coperateData['flag']
            if(pointNo) { //圈评
              if(pointNo == filePreviewCommitPointNumber) { //如果是当前圈评的这个点
                filePreviewPointNumCommits.push(coperateData)
              } else {
                let isHasPoint = false
                //如果没有这个点，则添加这个点
                for(let i = 0; i < filePreviewCommitPoints.length; i++ ) {
                  if(filePreviewCommitPoints[i]['flag'] == pointNo) {
                    isHasPoint = true
                    break
                  }
                }
                if(!isHasPoint) {
                  filePreviewCommitPoints.push(coperateData)
                }
              }
            }
            filePreviewCommits.push(coperateData)
            dispathes({
              type: model_projectDetailFile('updateDatas'),
              payload: {
                filePreviewCommits,
                filePreviewPointNumCommits,
                filePreviewCommitPoints
              }
            })
          }
          break
        case 'change:file:comment:delete':
          let commitId = getAfterNameId(coperateName)
          const filePreviewCommits = yield select(selectFilePreviewCommits) || []
          const filePreviewPointNumCommits = yield select(selectFilePreviewPointNumCommits) || []
          const filePreviewCommitPointNumber = yield select(selectFilePreviewCommitPointNumber) || []
          const filePreviewCommitPoints = yield select(selectFilePreviewCommitPoints) || []

          //删除点 存在最后一条is_last和点flag
          let flag_ = coperateData['flag']
          let is_last = coperateData['is_last']
          if(flag_ && is_last == '1') {
            for(let i = 0; i < filePreviewCommitPoints.length; i ++) {
              if(filePreviewCommitPoints[i]['flag'] == flag_) {
                filePreviewCommitPoints.splice(i, 1)
                break
              }
            }
          }

          if(filePreviewPointNumCommits){ //处理点的评论
            for(let i = 0; i < filePreviewPointNumCommits.length; i ++) {
              if(filePreviewPointNumCommits[i]['id'] == commitId) {
                filePreviewPointNumCommits.splice(i, 1)
                break
              }
            }
          }

          if(filePreviewCommits) { //处理整体评论
            for(let i = 0; i < filePreviewCommits.length; i ++) {
              if(filePreviewCommits[i]['id'] == commitId) {
                filePreviewCommits.splice(i, 1)
                break
              }
            }
          }

          dispathes({
            type: model_projectDetailFile('updateDatas'),
            payload: {
              filePreviewCommits,
              filePreviewPointNumCommits,
              filePreviewCommitPoints
            }
          })
          break
        case 'change:file:operation':
          let ids = getAfterNameId(coperateName)
          let idArr = ids.split('/')
          let fileList_ = yield select(selectFileList)
          let folder_id = yield select(selectCurrentParrentDirectoryId)
          let coFileList = coperateData['file_list']
          if(idArr.length == 1) { //复制
            if(idArr[0] == folder_id) {
              fileList_ = [].concat(fileList_, coFileList)
            }
          }else if(idArr.length == 2) { //移动
            if(idArr[0] != idArr[1]) { ////移入的文件和移除的文件夹不是同一个
              if(idArr[1] == folder_id) { //当前文件夹有文件移除
                 for(let i = 0; i< fileList_.length; i++) {
                   for (let j = 0; j < coFileList.length; j++) {
                     if(fileList_[i]['file_id'] == coFileList[j]['file_id']) {
                       fileList_.splice(i, 1)
                       break
                     }

                   }
                 }
              }else if(idArr[0] == folder_id){ //当前文件夹有文件移进
                fileList_ = [].concat(fileList_, coFileList)
              }

            }
          } else {

          }
          dispathes({
            type: model_projectDetailFile('updateDatas'),
            payload: {
              fileList: fileList_
            }
          })

          break
        default:
          break
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
