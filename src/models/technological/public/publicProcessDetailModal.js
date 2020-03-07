
import { isApiResponseOk } from '../../../utils/handleResponseData'
import { message } from 'antd'
import { currentNounPlanFilterName } from "../../../utils/businessFunction";
import { MESSAGE_DURATION_TIME, FILES } from "../../../globalset/js/constant";
import { getSubfixName } from '../../../utils/businessFunction'
import QueryString from 'querystring'
import { processEditDatasConstant, processEditDatasRecordsConstant, processDoingListMatch, processInfoMatch } from '../../../components/ProcessDetailModal/constant';

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
    // processEditDatas: JSON.parse(JSON.stringify(processEditDatasConstant)), //json数组，每添加一步编辑内容往里面put进去一个obj,刚开始默认含有一个里程碑的
    processEditDatas:[],
    processEditDatasRecords: [],
    // processEditDatasRecords: JSON.parse(JSON.stringify(processEditDatasRecordsConstant)), //每一步的每一个类型，记录，数组的全部数据step * type
    node_type: '1', // 当前的节点类型
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
                processPageFlagStep: '1', //"1""2""3""4"分别对应欢迎，编辑，确认，详情界面,默认1
              }
            })
          }

        }
      })
    },
  },
  effects: {
    
  },
  reducers: {
    updateDatas(state, action) {
      return {
        ...state, ...action.payload
      }
    }
  }
}