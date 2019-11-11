import { isApiResponseOk } from '../../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME } from "../../../globalset/js/constant";
import { routerRedux } from "dva/router";
import queryString from 'query-string';
import { getModelSelectDatasState, getModelSelectState } from '../../utils'
import { Im } from 'lingxi-im'

// 该model是圈子推送已读未读的内容
export default {
    namespace: 'imCooperation',
    state: {
        im_all_latest_unread_messages: [], //最新未读消息列表
        // im_latest_unread_message: {}, //最新未读
        im_all_latest_readed_messages: [], //最新已读列表
        wil_handle_types: [
            'board.card.create',
            'board.card.update.file.add',
            'board.file.upload',
            'board.file.version.upload'
        ]
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
            })
        },
    },
    effects: {
        * getImUnReadAllMessages({ payload }, { call, put }) { //获取和设置全部未读消息
            const { messages = [] } = payload
            const wil_handle_types = yield select(getModelSelectState('imCooperation', 'wil_handle_types'))
            const im_all_latest_unread_messages = messages.filter(item => {
                if (wil_handle_types.indexOf(item.action) != -1) {
                    return item
                }
            })
            yield put({
                type: 'updateDatas',
                payload: {
                    im_all_latest_unread_messages
                }
            })
        },
        * imUnReadMessageItemClear({ payload }, { call, put, select }) { //未读消息清除,场景（当用户点开某一条具有红点的消息后，会清除该条消息）
            const { relaDataId } = payload
            let im_all_latest_unread_messages = yield select(getModelSelectState('imCooperation', 'im_all_latest_unread_messages'))
            const idServer = (im_all_latest_unread_messages.find((item) => item.relaDataId == relaDataId || item.cardId == relaDataId) || {}).idServer
            const target = (im_all_latest_unread_messages.find((item) => item.relaDataId == relaDataId || item.cardId == relaDataId) || {}).target
            im_all_latest_unread_messages = im_all_latest_unread_messages.filter(item => item.relaDataId != relaDataId && item.cardId != relaDataId)
            yield put({
                type: 'updateDatas',
                payload: {
                    im_all_latest_unread_messages
                }
            })
            // 告知im消息已读
            if (!!!idServer) {
                return
            }
            yield ({
                type: 'imMessageToRead',
                payload: {
                    idServer,
                    target
                }
            })
        },
        * listenImLatestAreadyReadMessages({ payload }, { select, call, put }) { //在触发的已读推送,已读后更新未读列表
            const { messages = [] } = payload
            console.log('ssss_已读列表', messages)
            let im_all_latest_unread_messages = yield select(getModelSelectState('imCooperation', 'im_all_latest_unread_messages'))
            im_all_latest_unread_messages = im_all_latest_unread_messages.filter(item => {
                if (messages.findIndex(item2 => item2.idServer == item.idServer) == -1) { //传递进来的已读列表不包含该条未读消息
                    return item
                }
            })
            yield put({
                type: 'updateDatas',
                payload: {
                    im_all_latest_unread_messages
                }
            })
        },
        * listenImUnReadLatestMessage({ payload }, { select, call, put }) { //获取最新的一条未读消息推送
            const { message_item = {} } = payload
            const wil_handle_types = yield select(getModelSelectState('imCooperation', 'wil_handle_types'))
            const { action } = messages
            if (wil_handle_types.indexOf(action) == -1) {
                return
            }
            console.log('ssss_最新未读', message_item)
            let im_all_latest_unread_messages = yield select(getModelSelectState('imCooperation', 'im_all_latest_unread_messages'))
            let arr = [...im_all_latest_unread_messages]
            arr.push(message_item)
            yield put({
                type: 'updateDatas',
                payload: {
                    im_all_latest_unread_messages: arr
                }
            })
        },
        * imMessageToRead({ payload }, { call, put }) { //im的某一条消息设置已读
            const { idServer, target } = payload
            if (Im) {
                Im.fireEvent('readMsg', { id: idServer, target })
            }
        },

    },

    reducers: {
        updateDatas(state, action) {
            return {
                ...state, ...action.payload
            }
        }
    },
}

