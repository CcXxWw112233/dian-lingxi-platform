
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
  selectCurrentProcessList
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
              const calback = function (event) {
                dispatch({
                  type: 'connectWsToModel',
                  payload: {
                    event
                  }
                })
              }
              initWs(calback)
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
      console.log('eeedddaaa', data)
      const currentProjectBoardId = yield select(selectProjectDetailBoardId)

      let coperate = data[0] //协作
      let news = data[1] //消息
      //获取消息协作类型
      const coperateName = coperate.e
      const coperateType = coperateName.substring(0, coperateName.indexOf('/'))
      let coperateData = JSON.parse(coperate.d)

      const getAfterNameId = (coperateName) => { //获取跟在名字后面的id
        return coperateName.substring(coperateName.indexOf('/') + 1)
      }

      let board_id_ = getAfterNameId(coperateName)
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
        case '':
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
