import { addCardRely, deleteCardRely, updateCardRely, getCardRelys } from "../../../services/technological/task"
import { saveGanttOutlineSort, getGanttGroupElseInfo } from "../../../services/technological/gantt"
import { isApiResponseOk } from "../../../utils/handleResponseData"
import { getModelSelectDatasState } from "../../utils"
import { message } from "antd"
import OutlineTree from '@/routes/Technological/components/Gantt/components/OutlineTree';
import { getProcessTemplateList } from "../../../services/technological/workFlow";
import { ganttIsOutlineView, gantt_head_width_init } from "../../../routes/Technological/components/Gantt/constants"
import { delayInGenerator } from "../../../utils/util"
// F:\work\newdicolla-platform\src\routes\Technological\components\Gantt\components\OutlineTree\index.js
const is_schedule = (start_time, due_time) => {
    if ((!!start_time && !!Number(start_time)) || (!!due_time && !!Number(due_time))) {
        return true
    }
    return false
}
export default {
    state: {
        gantt_head_width: gantt_head_width_init,
        rely_map: [],
        proccess_templates: [],
        triggle_request_board_template: false, //大纲视图保存为项目模板后，触发为true，右边模板列表接收到变化会触发查询
        drag_outline_node: { id: '', parent_id: '', parent_ids: [] }, //大纲拖拽排序所需要的信息
        outline_node_draging: false, //大纲是否拖拽排序中
        selected_card_visible: false, //查看任务抽屉
        uploading_folder_id: '', //任务详情上传文件的文件id, 下方抽屉在上传后判断文件夹id进行更新
        notification_todos: {}, //[id:{code:'', message: ''}]，当更新任务时间后，由于任务列表的key是根据id_start_time duetime等多个属性设置，会重新didmount导致之前操作丢失，用来存放待办
    },
    effects: {
        * addCardRely({ payload = {} }, { select, call, put }) {
            const { from_id, to_id, relation } = payload
            let res = yield call(addCardRely, { from_id, to_id, relation })
            const rely_map = yield select(getModelSelectDatasState('gantt', 'rely_map'))
            const group_view_type = yield select(getModelSelectDatasState('gantt', 'group_view_type'))
            let _rely_map = JSON.parse(JSON.stringify(rely_map))
            if (isApiResponseOk(res)) {
                message.success('已成功添加依赖')

                const index = _rely_map.findIndex(item => item.id == from_id)
                if (index != -1) { //该任务存在和其它的依赖关系则添加新的一条进next [], 反之构建一个新的item
                    _rely_map[index].next.push({ id: to_id, relation })
                } else {
                    _rely_map.push({ id: from_id, next: [{ id: to_id, relation }] })

                }
                yield put({
                    type: 'updateDatas',
                    payload: {
                        rely_map: _rely_map
                    }
                })
                const updateAction = ganttIsOutlineView({ group_view_type }) ? 'updateOutLineTree' : 'updateListGroup'
                yield put({
                    type: updateAction,
                    payload: {
                        datas: res.data
                    }
                })
            } else {
                message.error(res.message)
            }
            return res || {}
        },
        * deleteCardRely({ payload }, { select, call, put }) {
            const { move_id, line_id } = payload
            const res = yield call(deleteCardRely, { from_id: move_id, to_id: line_id })
            const rely_map = yield select(getModelSelectDatasState('gantt', 'rely_map'))

            if (isApiResponseOk(res)) {
                message.success('已成功删除依赖')
                if (!(rely_map && rely_map.length)) return
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
            return res || {}
        },
        * updateCardRely({ payload }, { select, call, put }) {
            const rely_map = yield select(getModelSelectDatasState('gantt', 'rely_map'))
            const { from_id, to_id, ...update_prop } = payload
            let res = yield call(updateCardRely, payload)
            if (isApiResponseOk(res)) {
                let _re_rely_map = JSON.parse(JSON.stringify(rely_map))
                const move_index = rely_map.findIndex(item => item.id == from_id) //起始点索引
                const move_item = rely_map.find(item => item.id == from_id) //起始点这一项
                const move_next = move_item.next //起始点所包含的全部终点信息
                const line_index = move_next.findIndex(item => item.id == to_id)
                if (typeof update_prop == 'object') {
                    for (let key in update_prop) {
                        _re_rely_map[move_index].next[line_index][key] = update_prop[key] //更新赋值
                    }
                }
                yield put({
                    type: 'updateDatas',
                    payload: {
                        rely_map: _re_rely_map
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
        // 获取分组头部的其它信息（百分比进度，人员）
        * getGanttGroupElseInfo({ payload = {} }, { select, call, put }) {
            const { list_id } = payload
            const gantt_board_id = yield select(getModelSelectDatasState('gantt', 'gantt_board_id'))
            let current_list_group_id = yield select(getModelSelectDatasState('gantt', 'current_list_group_id'))
            if (!!list_id) {
                current_list_group_id = list_id
            }
            const list_group = yield select(getModelSelectDatasState('gantt', 'list_group'))
            let params = {}
            if (gantt_board_id == '0') {
                params = {
                    board_id: current_list_group_id
                }
            } else {
                params = {
                    board_id: gantt_board_id, list_id: current_list_group_id
                }
            }
            const res = yield call(getGanttGroupElseInfo, { ...params })
            if (isApiResponseOk(res)) {
                const index = list_group.findIndex(item => item.list_id == current_list_group_id)
                for (let key in res.data) {
                    list_group[index][key] = res.data[key]
                }
            }
            return list_group
        },
        // 分组视图下跟新任务
        * updateListGroup({ payload = {} }, { select, call, put }) {
            // return
            // datas = [
            //     { id: '1266250771897389056', start_time: '1589990400', due_time: '1590768000' },
            //     { id: '1266250784136368128', start_time: '1590595200', due_time: '1590854400' }
            // ]

            const { datas = [], origin_list_group } = payload
            const list_group = yield select(getModelSelectDatasState('gantt', 'list_group'))
            let list_group_new = Object.prototype.toString.call(origin_list_group) == '[object Array]' ? origin_list_group : [...list_group]
            const Aa = yield put({
                type: 'getGanttGroupElseInfo',
            })
            const transform_list_group = () => new Promise(resolve => {
                resolve(Aa.then())
            })
            list_group_new = yield call(transform_list_group) || list_group_new
            for (let val of datas) {
                const has_time = is_schedule(val.start_time, val.due_time) //存在时间
                for (let val2 of list_group_new) {
                    const card_index = val2.lane_data.cards.findIndex(item => item.id == val.id) //所在排期的索引
                    const card_no_time_index = val2.lane_data.card_no_times.findIndex(item => item.id == val.id) //所在未排期的索引
                    let card_item = {} //存储该条数据
                    if (card_index != -1) { //如果在已排期的列表中找到了
                        card_item = val2.lane_data.cards.find(item => item.id == val.id) || {}
                        if (has_time) { //如果返回的结果存在时间，则操作已排期列表
                            val2.lane_data.cards[card_index] = { ...card_item, ...val }
                        } else { //如果返回的结果不存在时间，则将该条任务从已排期挪到未排期
                            val2.lane_data.cards.splice(card_index, 1)
                            val2.lane_data.card_no_times.push({ ...card_item, ...val })
                        }
                        continue
                    }
                    if (card_no_time_index != -1) { //如果在未排期的列表中找到了
                        card_item = val2.lane_data.card_no_times.find(item => item.id == val.id) || {}
                        if (has_time) { //如果返回的结果存在时间，则将该条任务挪到已排期排期列表
                            val2.lane_data.card_no_times.splice(card_no_time_index, 1)
                            val2.lane_data.cards.push({ ...card_item, ...val })
                        } else { //没有时间，就操作当前未排期
                            val2.lane_data.card_no_times[card_no_time_index] = { ...card_item, ...val }
                        }
                        continue
                    }
                }
            }
            yield put({
                type: 'gantt/handleListGroup',
                payload: {
                    data: list_group_new
                }
            })

        },
        // // 分组视图下跟新任务
        // * updateListGroup({ payload = {} }, { select, call, put }) {
        //     // return
        //     // datas = [
        //     //     { id: '1266250771897389056', start_time: '1589990400', due_time: '1590768000' },
        //     //     { id: '1266250784136368128', start_time: '1590595200', due_time: '1590854400' }
        //     // ]

        //     const { datas = [], origin_list_group } = payload
        //     const list_group = yield select(getModelSelectDatasState('gantt', 'list_group'))
        //     const list_group_new = Object.prototype.toString.call(origin_list_group) == '[object Array]' ? origin_list_group : [...list_group]
        //     for (let val of datas) {
        //         for (let val2 of list_group_new) {
        //             const card_index = val2.lane_data.cards.findIndex(item => item.id == val.id)
        //             const card_item = val2.lane_data.cards.find(item => item.id == val.id)
        //             if (card_index != -1) {
        //                 val2.lane_data.cards[card_index] = { ...card_item, ...val }
        //                 // break
        //             }
        //         }
        //     }
        //     yield put({
        //         type: 'gantt/handleListGroup',
        //         payload: {
        //             data: list_group_new
        //         }
        //     })

        // },
        // 更新分组下未排期任务 (对未排期的任务进行拖拽 设置时间)
        * updateGroupListWithCardsNoTime({ payload = {} }, { select, call, put }) {
            const { datas = [], drop_group_id, original_group_id = '0', card_id, updateData = {}, origin_list_group } = payload
            const list_group = yield select(getModelSelectDatasState('gantt', 'list_group'))
            const list_group_new = Object.prototype.toString.call(origin_list_group) == '[object Array]' ? origin_list_group : [...list_group]
            // 1. 找到下落的分组列表
            const group_drop_index = list_group_new.findIndex(item => item.lane_id == drop_group_id)
            // 2. 找到当前未排期任务原始所在的分组列表
            const group_original_index = list_group_new.findIndex(item => item.lane_id == original_group_id)
            // 3. 从当前原始的分组中找到当前这条未排期的任务
            const group_index_cards_index = list_group_new[group_original_index].lane_data.card_no_times.findIndex(item => item.id == updateData.id)
            // 4. 取出这条任务 （保存一下数据）
            let group_index_cards_item = list_group_new[group_original_index].lane_data.card_no_times[group_index_cards_index]
            // 5. 取出的这条任务需要进行更新
            group_index_cards_item = {
                ...group_index_cards_item,
                ...updateData
            }
            // 6. 将这条任务添加至已排期的任务中 （下落的分组中添加）
            list_group_new[group_drop_index].lane_data.cards.push(group_index_cards_item)
            // 7. 将这条任务从原始未排期中移除
            list_group_new[group_original_index].lane_data.card_no_times.splice(group_index_cards_index, 1)
            yield put(({
                type: 'updateListGroup',
                payload: {
                    datas,
                    origin_list_group: list_group_new
                }
            }))
        },

        * updateOutLineTree({ payload = {} }, { select, call, put }) {
            const { datas = [] } = payload
            let outline_tree = yield select(getModelSelectDatasState('gantt', 'outline_tree'))
            let outline_tree_ = JSON.parse(JSON.stringify(outline_tree))
            const mapSetProto = (data, nodeValue) => {
                Object.keys(data).map(item => {
                    nodeValue[item] = data[item]
                })
                // 为了避免删除开始时间后，关闭弹窗再删除截至时间，大纲树结构item的time覆盖问题
                // if (!data.start_time) nodeValue['start_time'] = ''
                // if (!data.due_time) nodeValue['due_time'] = ''
            }
            for (let val of datas) {
                const nodeValue = OutlineTree.getTreeNodeValueByName(outline_tree_, 'id', val.id);
                if (nodeValue) {
                    mapSetProto(val, nodeValue)
                    continue
                }
            }
            yield put({
                type: 'handleOutLineTreeData',
                payload: {
                    data: outline_tree_
                }
            });
        },
        * getProcessTemplateList({ payload = {} }, { select, call, put }) {
            const res = yield call(getProcessTemplateList, { _organization_id: localStorage.getItem('OrganizationId') })
            if (isApiResponseOk(res)) {
                yield put({
                    type: 'updateDatas',
                    payload: {
                        proccess_templates: res.data
                    }
                })
            } else {

            }
        },
        // 保存大纲视图的相对位置
        * saveGanttOutlineSort({ payload = {} }, { select, call, put }) {
            const { outline_tree = [] } = payload
            const gantt_board_id = yield select(getModelSelectDatasState('gantt', 'gantt_board_id'))
            const outline_tree_ = yield select(getModelSelectDatasState('gantt', 'outline_tree'))
            const data = outline_tree || outline_tree_
            let content_ids = []
            const mapGetContentId = (arr) => {
                for (let val of arr) {
                    const { children = [], id } = val
                    if (id) {
                        content_ids.push(id)
                    }
                    if (children.length) {
                        mapGetContentId(children)
                    }
                }
            }
            mapGetContentId(data)
            const res = yield call(saveGanttOutlineSort, { content_ids, board_id: gantt_board_id })

        },
        // 获取大纲某个节点
        * getOutlineNode({ payload = {} }, { select, call, put }) {
            const { outline_tree = [], id } = payload
            const outline_tree_ = yield select(getModelSelectDatasState('gantt', 'outline_tree'))
            const data = outline_tree.length ? outline_tree : outline_tree_
            const getNode = (outline_tree, id) => {
                let nodeValue = null;
                if (outline_tree) {
                    nodeValue = outline_tree.find((item) => item.id == id);
                    if (nodeValue) {
                        return nodeValue;
                    } else {
                        for (let i = 0; i < outline_tree.length; i++) {
                            let node = outline_tree[i];
                            if (node.children && node.children.length > 0) {
                                nodeValue = getNode(node.children, id);
                                if (nodeValue) {
                                    return nodeValue;
                                }
                            } else {
                                continue
                                // return null;
                            }
                        }
                    }
                }
                return nodeValue
            }
            const getTreeNodeValue = (outline_tree, id) => {
                if (outline_tree) {
                    for (let i = 0; i < outline_tree.length; i++) {
                        let node = outline_tree[i];
                        if (node.id == id) {
                            return node;
                        } else {
                            if (node.children && node.children.length > 0) {
                                let childNode = getNode(node.children, id);
                                if (childNode) {
                                    return childNode;
                                }
                            } else {
                                continue
                                // return null;
                            }
                        }
                    }
                } else {
                    return null;
                }

            }
            const node = getTreeNodeValue(data, id)
            // console.log('sssssssss_find', { node, outline_tree, id })
            return node
        }
    }

}