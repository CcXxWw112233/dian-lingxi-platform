
import { isApiResponseOk } from '../../../utils/handleResponseData'
import { message } from 'antd'
import { currentNounPlanFilterName } from "../../../utils/businessFunction";
import { MESSAGE_DURATION_TIME, FILES } from "../../../globalset/js/constant";
import { getSubfixName } from '../../../utils/businessFunction'
import QueryString from 'querystring'

let board_id = null
let appsSelectKey = null
let flow_id = null

export default {
  namespace: 'publicProcessDetailModal',
  state: {
    processPageFlagStep: '1', // "1", "2", "3", "4" 分别对应 新建， 编辑， 启动
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