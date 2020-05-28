import { addCardRely, deleteCardRely, updateCardRely, getCardRelys } from "../../../services/technological/task"
import { isApiResponseOk } from "../../../utils/handleResponseData"
import { getModelSelectDatasState } from "../../utils"
import { message } from "antd"

export default {
    state: {
        rely_map: []
    },
    effects: {
        * addCardRely({ payload = {} }, { select, call, put }) {
            const { from_card_id, to_card_id, relation } = payload
            let res = yield call(addCardRely, { from_card_id, to_card_id, relation })
            if (isApiResponseOk(res)) {
                yield put({
                    type: 'getCardRelys',
                    payload: {

                    }
                })
            } else {
                message.error(res.message)
            }
        },
        * deleteCardRely({ payload }, { select, call, put }) {
            const res = yield call(deleteCardRely, payload)
            if (isApiResponseOk(res)) {
                yield put({
                    type: 'getCardRelys',
                    payload: {

                    }
                })
            } else {
                message.error(res.message)
            }
        },
        * updateCardRely({ payload }, { select, call, put }) {
            let res = yield call(updateCardRely, payload)
            if (isApiResponseOk(res)) {
                yield put({
                    type: 'updateDatas',
                    payload: {
                        about_user_boards: res.data
                    }
                })
            } else {

            }
        },
        * getCardRelys({ payload = {} }, { select, call, put }) {
            const gantt_board_id = yield select(getModelSelectDatasState('gantt', 'gantt_board_id'))
            const _organization_id = localStorage.getItem('OrganizationId')

            const res = yield call(getCardRelys, { board_id: gantt_board_id, _organization_id })

            if (isApiResponseOk(res)) {
                yield put({
                    type: 'updateDatas',
                    payload: {
                        rely_map: res.data
                    }
                })
            } else {

            }
        },
    }

}