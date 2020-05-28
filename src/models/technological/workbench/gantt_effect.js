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
            const rely_map = yield select(getModelSelectDatasState('gantt', 'rely_map'))
            let _rely_map = JSON.parse(JSON.stringify(rely_map))
            if (isApiResponseOk(res)) {
                message.success('已成功添加依赖')

                const index = _rely_map.findIndex(item => item.id == from_card_id)
                if (index != -1) { //该任务存在和其它的依赖关系则添加新的一条进next [], 反之构建一个新的item
                    _rely_map[index].next.push({ id: to_card_id, relation })
                } else {
                    _rely_map.push({ id: from_card_id, next: [{ id: to_card_id, relation }] })

                }
                yield put({
                    type: 'updateDatas',
                    payload: {
                        rely_map: _rely_map
                    }
                })
            } else {
                message.error(res.message)
            }
        },
        * deleteCardRely({ payload }, { select, call, put }) {
            const { move_id, line_id } = payload
            const res = yield call(deleteCardRely, { from_card_id: move_id, to_card_id: line_id })
            const rely_map = yield select(getModelSelectDatasState('gantt', 'rely_map'))

            if (isApiResponseOk(res)) {
                message.success('已成功删除依赖')

                let _re_rely_map = JSON.parse(JSON.stringify(rely_map))
                const move_index = rely_map.findIndex(item => item.id == move_id) //起始点索引
                const move_item = rely_map.find(item => item.id == move_id) //起始点这一项
                const move_next = move_item.next //起始点所包含的全部终点信息
                const line_index = move_next.findIndex(item => item.id == line_id)
                if (move_next.length > 1) {
                    _re_rely_map[move_index].next.splice(line_index, 1)
                } else {
                    _re_rely_map.splice(move_index, 1)
                }
                yield put({
                    type: 'updateDatas',
                    payload: {
                        rely_map: _re_rely_map
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
            if (gantt_board_id == '0') {
                yield put({
                    type: 'updateDatas',
                    payload: {
                        rely_map: []
                    }
                })
                return
            }
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