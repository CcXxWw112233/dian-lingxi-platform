
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
    processPageFlagStep: '3', // "1", "2", "3", "4" 分别对应 新建， 编辑， 启动
    process_detail_modal_visible: false,
    processDoingList: JSON.parse(JSON.stringify(processDoingListMatch)), // 进行中的流程
    processStopedList: [], // 已中止的流程
    processComepletedList: [], // 已完成的流程
    processNotBeginningList: [], // 未开始的流程
    // processEditDatas: JSON.parse(JSON.stringify(processEditDatasConstant)), //json数组，每添加一步编辑内容往里面put进去一个obj,刚开始默认含有一个里程碑的
    // processEditDatas:[],
    processEditDatasRecords: [],
    // processEditDatasRecords: JSON.parse(JSON.stringify(processEditDatasRecordsConstant)), //每一步的每一个类型，记录，数组的全部数据step * type
    node_type: '1', // 当前的节点类型
    processCurrentEditStep: 0, // 当前的编辑步骤 第几步
    processCurrentCompleteStep: 0, // 当前处于的操作步骤
    templateInfo: {}, // 模板信息
    processInfo: JSON.parse(JSON.stringify(processInfoMatch)), // 流程实例信息
    currentProcessInstanceId: '', // 当前查看的流程实例名称
    // 暂时的假数据
    processEditDatas: [
      {
        "node_type": "1",//流程节点类型 1=资料收集 2=审批 3=抄送
        "name": "资料收集节点",//流程节点名称
        "description": "描述",//描述 备注
        "deadline_type": "2",//期限类型 1=不限制时间 2=限制时间
        "deadline_time_type": "day",//完成期限类型 hour = 时 day =天 month = 月
        "deadline_value": "1",//完成期限值
        "assignee_type": "2",//审批人类型 1=任何人 2=指定人员
        "assignees": "1110064610620346368",//审批人 多个逗号隔开
        "forms": [//表单数据
          {
            "field_type": "1",//类型 1=文本 2=选择 3=日期 4=表格 5=附件
            "title": "文本标题",//标题
            "prompt_content": "请填写",//提示内容
            "is_required": "0",//是否必填 1=必须 0=不是必须
            "verification_rule": "shuzi",//校验规则
            "val_min_length": "10",//最小长度
            "val_max_length": "20"//最大长度
          },
          {
            "field_type": "2",//类型 1=文本 2=选择 3=日期 4=表格 5=附件
            "title": "性别",//标题
            "prompt_content": "请选择",//提示内容
            "is_required": "1",//是否必填 1=必须 0=不是必须
            "is_multiple_choice": "0",//是否多选 1=是 0=否
            "options": [//选择项
              {
                "label_name": "男",
                "label_value": "男"
              },
              {
                "label_name": "女",
                "label_value": "女"
              }
            ]
          },
          {
            "field_type": "3",//类型 1=文本 2=选择 3=日期 4=表格 5=附件
            "title": "生日",//标题
            "prompt_content": "您的出生日期",//提示内容
            "is_required": "1",//是否必填 1=必须 0=不是必须
            "date_range": "1",//日期范围 1=单个日期 2=开始日期~截止日期
            "date_precision": "1"//日期精度 1=仅日期 2=日期+时间
          },
          {
            "field_type": "5",//类型 1=文本 2=选择 3=日期 4=表格 5=附件
            "title": "简历",//标题
            "prompt_content": "请上传简历",//提示内容
            "is_required": "1",//是否必填 1=必须 0=不是必须
            "limit_file_num": "1",//上传数量
            "limit_file_type": [//限制上传类型(文件格式) document=文档 image=图像 audio=音频 video=视频
              "document", "image", "audio", "video"
            ],
            "limit_file_size": "10"//上传大小限制
          }
        ]
      },
    ]
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
                processPageFlagStep: '3', //"1""2""3""4"分别对应新建，编辑，启动，详情界面,默认1
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