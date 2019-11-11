import { isApiResponseOk } from '../../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME } from "../../../globalset/js/constant";
import { routerRedux } from "dva/router";
import queryString from 'query-string';
import { getModelSelectDatasState, getModelSelectState } from '../../utils'

export default {
    namespace: 'imCooperation',
    state: {
        im_all_unread_message: [], //全部未读消息
        im_latest_unread: {}, //最新未读
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {

            })
        },
    },
    effects: {
        * getGanttBoardsFiles({ payload }, { select, call, put }) {
            const res = yield call(getGanttBoardsFiles, payload)
            // console.log('sssssssss', { boards_flies: res.data })
            if (isApiResponseOk(res)) {
                yield put({
                    type: 'updateDatas',
                    payload: {
                        boards_flies: res.data
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
    },
}

