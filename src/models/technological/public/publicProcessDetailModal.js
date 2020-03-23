
import { isApiResponseOk } from '../../../utils/handleResponseData'
import { message } from 'antd'
import { currentNounPlanFilterName } from "../../../utils/businessFunction";
import { MESSAGE_DURATION_TIME, FILES } from "../../../globalset/js/constant";
import { getSubfixName } from '../../../utils/businessFunction'
import QueryString from 'querystring'
import { processEditDatasConstant, processEditDatasRecordsConstant, processDoingListMatch, processInfoMatch } from '../../../components/ProcessDetailModal/constant';
import { getProcessTemplateList, saveProcessTemplate, getTemplateInfo, deleteProcessTemplete } from "../../../services/technological/workFlow"

let board_id = null
let appsSelectKey = null
let flow_id = null

export default {
  namespace: 'publicProcessDetailModal',
  state: {
    currentFlowInstanceName: '', // 当前流程实例的名称
    currentFlowInstanceDescription: '', // 当前的实例描述内容
    isEditCurrentFlowInstanceName: true, // 是否正在编辑当前实例的名称
    isEditCurrentFlowInstanceDescription: false, // 是否正在编辑当前实例的描述
    processPageFlagStep: '1', // "1", "2", "3", "4" 分别对应 新建， 编辑， 启动
    process_detail_modal_visible: false,
    processDoingList: JSON.parse(JSON.stringify(processDoingListMatch)), // 进行中的流程
    processStopedList: [], // 已中止的流程
    processComepletedList: [], // 已完成的流程
    processNotBeginningList: [], // 未开始的流程
    processEditDatas:[],
    processEditDatasRecords: [],
    node_type: '', // 当前的节点类型
    processCurrentEditStep: 0, // 当前的编辑步骤 第几步
    processCurrentCompleteStep: 0, // 当前处于的操作步骤
    templateInfo: {}, // 模板信息
    processInfo: JSON.parse(JSON.stringify(processInfoMatch)), // 流程实例信息
    currentProcessInstanceId: '', // 当前查看的流程实例名称
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname.indexOf('/technological/projectDetail') !== -1) {
          const param = QueryString.parse(location.search.replace('?', ''))
          board_id = param.board_id
          appsSelectKey = param.appsSelectKey
          flow_id = param.flow_id
          if (appsSelectKey == '2') {
            dispatch({
              type: 'updateDatas',
              payload: {
                //流程
                processPageFlagStep: '1', //"1""2""3""4"分别对应新建，编辑，启动，详情界面,默认1
              }
            })
            if (board_id) {
              dispatch({
                type: 'getProcessTemplateList',
                payload: {
                  id: board_id,
                  board_id
                }
              })
            }
          }

        }
      })
    },
  },
  effects: {
    // 获取流程模板列表
    * getProcessTemplateList({ payload }, { call, put }) {
      const { id, board_id, calback } = payload
      let res = yield call(getProcessTemplateList, { id, board_id })
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            processTemplateList: res.data || []
          }
        })
        if (typeof calback === 'function') {
          calback()
        }
      } else {

      }
    },

    // 获取模板信息内容
    * getTemplateInfo({ payload }, { call, put }) {
      const { id, processPageFlagStep } = payload
      let res = yield call(getTemplateInfo, { id })
      if (isApiResponseOk(res)) {
        let newProcessEditDatas = [...res.data.nodes]
        newProcessEditDatas = newProcessEditDatas.map(item => {
          let new_item ={...item, is_edit: '1'}
          return new_item
        })
        yield put({
          type: 'updateDatas',
          payload: {
            templateInfo: res.data,
            processPageFlagStep,
            process_detail_modal_visible: true,
            processEditDatas: newProcessEditDatas,
            currentFlowInstanceName: res.data.name,
            isEditCurrentFlowInstanceName:false,
            currentFlowInstanceDescription: res.data.description
          }
        })
      }
    },

    // 新建流程模板中的保存模板(即保存新的流程模板)
    * saveProcessTemplate({ payload }, { call, put }) {
      const { calback } = payload
      let newPayload = {...payload}
      newPayload.calback ? delete newPayload.calback : ''
      let res = yield call(saveProcessTemplate,newPayload)
      if (isApiResponseOk(res)) {
        setTimeout(() => {
          message.success(`保存模板成功`,MESSAGE_DURATION_TIME)
        }, 200)
        yield put({
          type: 'getProcessTemplateList',
          payload: {
            id: payload.board_id,
            board_id: payload.board_id
          }
        })
        if (calback && typeof calback == 'function') calback()
      } else {
        message.warn(res.message)
      }
    },

    // 删除流程模板
    * deleteProcessTemplete({ payload }, { call, put }) {
      const { id, board_id } = payload
      let res = yield call(deleteProcessTemplete,{id})
      if (isApiResponseOk(res)) {
        setTimeout(() => {
          message.success('删除模板成功')
        },200)
        yield put({
          type: 'getProcessTemplateList',
          payload: {
            id: board_id,
            board_id
          }
        })
      } else {
        message.warn(res.message)
      }
    },

    // 获取流程列表，类型进行中 已终止 已完成
    * getProcessListByType({ payload }, { call, put }) {
      const { status = '1', board_id } = payload
      return
      const res = yield call(getProcessListByType, { status, board_id })
      let listName
      switch (status) {
        case '1':
          listName = 'processDoingList'
          break
        case '2':
          listName = 'processStopedList'
          break
        case '3':
          listName = 'processComepletedList'
          break
        case '4':
          listName = 'processNotBeginningList'
        default:
          listName = 'processDoingList'
          break
      }
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            [listName]: res.data
          }
        })
      } else {
      }
    }
  },
  reducers: {
    updateDatas(state, action) {
      return {
        ...state, ...action.payload
      }
    }
  }
}