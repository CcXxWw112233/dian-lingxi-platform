import { getModelSelectDatasState, getModelSelectState } from '../../utils'

// 该model是圈子推送已读未读的内容
const model_milestoneDetail = name => `milestoneDetail/${name}`
const model_gantt = name => `gantt/${name}`
const model_publicTaskDetailModal = name => `publicTaskDetailModal/${name}`

let dispathes = null
export default {
    namespace: 'simpleModeCooperate',
    subscriptions: {
        setup({ dispatch, history }) {
            dispathes = dispatch
        }
    },
    state: {

    },
    effects: {
        // 处理甘特图
        * handleSimpleModeCooperate({ payload }, { select, call, put }) { //im的某一条消息设置已读
            const { res } = payload
            const { data } = res
            let coperate = data[0] //协作
            let news = data[1] || {} //消息
            //获取消息协作类型
            const coperateName = coperate.e
            const coperateType = coperateName.substring(0, coperateName.indexOf('/'))
            const coperateData = JSON.parse(coperate.d)
            const getAfterNameId = (coperateName) => { //获取跟在名字后面的id
                return coperateName.substring(coperateName.indexOf('/') + 1)
            }


            const id_arr_ = getAfterNameId(coperateName).split('/') //name/id1/id2/...
            const drawContent = yield select(getModelSelectState('publicTaskDetailModal', 'drawContent')) //任务详情
            const card_detail_card_id = yield select(getModelSelectState('publicTaskDetailModal', 'card_id')) //任务弹窗的id

            const gantt_list_group = yield select(getModelSelectDatasState('gantt', 'list_group')) //甘特图任务数据
            const gantt_board_id = yield select(getModelSelectDatasState('gantt', 'gantt_board_id')) //甘特图项目id

            let cObj = { ...coperateData }
            let gantt_list_group_ = [...gantt_list_group]
            let drawContent_ = { ...drawContent }
            let belong_board_id_ = id_arr_[0] //推送过来所属项目id
            let belong_list_id_ = id_arr_[1] //所属分组id
            let belong_card_id_ = id_arr_[2] //所属任务id，针对子任务操作
            let curr_card_id = '' //对象的任务id

            switch (coperateType) {
                case 'change:cards':
                    belong_board_id_ = id_arr_[0]
                    belong_list_id_ = id_arr_[1]
                    belong_card_id_ = id_arr_[2] //如果有则是添加子任务
                    const is_level_one_task = !belong_card_id_ //(一级任务
                    cObj = { ...cObj, name: coperateData['card_name'], id: coperateData['card_id'], board_id: belong_board_id_ }
                    if (is_level_one_task) { //新增父任务(一级任务)
                        gantt_list_group_ = gantt_list_group_.map(item => {
                            const new_item = { ...item }
                            if (
                                new_item.lane_id == (gantt_board_id == '0' ? belong_board_id_ : belong_list_id_) ||
                                (gantt_board_id != '0' && new_item.lane_id == '0' && !belong_list_id_) //分组情况下，默认分组处理，如果没有list_id_,则放到这里
                            ) { //匹配上项目或者分组id
                                if (coperateData.start_time || coperateData.due_time) {
                                    new_item.lane_data.cards.push(cObj)
                                } else {
                                    new_item.lane_data.card_no_times.push(cObj)
                                }
                            }
                            return new_item
                        })
                    } else { //新增子任务
                        // if (selectCard_id == belong_card_id_) { //当前查看的card_id是父类任务id
                        //     selectDrawContent['child_data'].push(coperateData['child_data'][0])
                        // }
                    }
                    dispathes({
                        type: model_gantt('handleListGroup'),
                        payload: {
                            data: gantt_list_group_
                        }
                    })
                    break
                case 'delete:cards':
                    belong_board_id_ = id_arr_[0]
                    belong_list_id_ = id_arr_[1] == 'null' ? '0' : id_arr_[1]
                    belong_card_id_ = id_arr_[2] //删除子任务
                    if (!!belong_card_id_) {
                        return
                    }
                    gantt_list_group_ = gantt_list_group_.map(item => {
                        const new_item = { ...item }
                        item.lane_data.card_no_times = item.lane_data.card_no_times.filter(item => item.id != coperateData.card_id)
                        item.lane_data.cards = item.lane_data.cards.filter(item => item.id != coperateData.card_id)
                        return new_item
                    })
                    dispathes({
                        type: model_gantt('handleListGroup'),
                        payload: {
                            data: gantt_list_group_
                        }
                    })
                    break
                case 'change:card':
                    curr_card_id = id_arr_[0]
                    if (curr_card_id == card_detail_card_id) { //当前推送的id和当前查看任务id一样
                        dispathes({
                            type: model_publicTaskDetailModal('updateDatas'),
                            payload: {
                                drawContent: { ...drawContent, ...coperateData }
                            }
                        })
                    }
                    gantt_list_group_ = gantt_list_group_.map(item => {
                        const new_item = { ...item }
                        const index_1 = item.lane_data.card_no_times.findIndex(item => item.id == curr_card_id)
                        const index_2 = item.lane_data.cards.findIndex(item => item.id == curr_card_id)
                        if (index_1 != -1) {
                            if (coperateData.card_name) {
                                cObj.name = coperateData.card_name
                            }
                            item.lane_data.card_no_times[index_1] = { ...item.lane_data.card_no_times[index_1], ...cObj }
                        }
                        if (index_2 != -1) {
                            if (coperateData.card_name) {
                                cObj.name = coperateData.card_name
                            }
                            item.lane_data.cards[index_2] = { ...item.lane_data.cards[index_2], ...cObj }
                        }
                        return new_item
                    })
                    dispathes({
                        type: model_gantt('handleListGroup'),
                        payload: {
                            data: gantt_list_group_
                        }
                    })
                    break
                case 'change:card:list':
                    belong_board_id_ = coperateData.board_id
                    if (gantt_board_id != '0' && gantt_board_id == belong_board_id_) {
                        dispathes({
                            type: model_gantt('getGanttData'),
                            payload: {
                                not_set_loading: true
                            }
                        })
                    }
                    break
                default:
                    break
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

