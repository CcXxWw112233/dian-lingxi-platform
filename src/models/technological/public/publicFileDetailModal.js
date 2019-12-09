
import { isApiResponseOk } from '../../../utils/handleResponseData'
import { message } from 'antd'
import { currentNounPlanFilterName } from "../../../utils/businessFunction";
import { MESSAGE_DURATION_TIME, FILES } from "../../../globalset/js/constant";
import { getSubfixName } from '../../../utils/businessFunction'
import {
  fileInfoByUrl, fileConvertPdfAlsoUpdateVersion
} from '../../../services/technological/file'

let board_id = null
let appsSelectKey = null
let card_id = null

export default {
  namespace: 'publicFileDetailModal',
  state: {
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
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