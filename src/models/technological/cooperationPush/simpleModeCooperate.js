import { getModelSelectDatasState, getModelSelectState } from '../../utils'

// 该model是圈子推送已读未读的内容
const model_milestoneDetail = name => `milestoneDetail/${name}`
const model_gantt = name => `gantt/${name}`

export default {
    namespace: 'simpleModeCooperate',
    state: {

    },
    effects: {
        // 处理甘特图
        * handleSimpleModeCooperate({ payload }, { call, put }) { //im的某一条消息设置已读
            const { res } = payload
            const { data } = res
            const currentProjectBoardId = yield select(getModelSelectDatasState('workbenchPublicDatas', 'board_id'))
            let coperate = data[0] //协作
            let news = data[1] || {} //消息
            //获取消息协作类型
            const coperateName = coperate.e
            const coperateType = coperateName.substring(0, coperateName.indexOf('/'))
            const coperateData = JSON.parse(coperate.d)
            const getAfterNameId = (coperateName) => { //获取跟在名字后面的id
                return coperateName.substring(coperateName.indexOf('/') + 1)
            }

            let board_id_ = ''
            let id_arr_ =  getAfterNameId(coperateName).split('/')
            switch (coperateType) {
                case 'change:cards':
                    const selectDrawContent = yield select(workbench_selectDrawContent)
                    board_id_ = id_arr_[0]
                    const list_id_ = id_arr_[1]
                    const work_parent_card_id_ = id_arr_[2] //如果有则是添加子任务
                    const selectCard_id = yield select(workbench_selectCard_id)
                    const { is_archived, is_deleted } = coperateData
                    const card_type = coperateData['type']
                    const is_has_realize = false //插入还是push标志
                    const cObj = { ...coperateData, name: coperateData['card_name'], id: coperateData['card_id'], board_id: board_id_ }

                    if (!work_parent_card_id_) { //新增父任务(一级任务)
                        if (!is_has_realize) {
                            if (card_type == '0') {
                                task_list_.push(cObj)
                            }
                        }
                    } else { //新增子任务
                        if (selectCard_id == work_parent_card_id_) { //当前查看的card_id是父类任务id
                            selectDrawContent['child_data'].push(coperateData['child_data'][0])
                        }
                    }

                    dispathes({
                        type: model_gantt('updateDatas'),
                        payload: {
                            responsibleTaskList: task_list_,
                            meetingLsit: meetingList,
                            drawContent: selectDrawContent
                        }
                    })


                    break
                case 'delete:cards':
                    break
                case 'change:card':
                    break
                case 'change:cards':
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

