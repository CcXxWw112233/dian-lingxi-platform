import React, { Component } from 'react'
import { connect } from 'dva'
import BoardFeaturesItem from './BoardFeaturesItem'
import globalStyles from '@/globalset/css/globalClassName.less'
import styles from './featurebox.less'
import TaskDetailModal from '@/components/TaskDetailModal'

@connect(mapStateToProps)
export default class BoardFeatures extends Component {
    // 修改任务
    handleCard = ({ card_id, drawContent }) => {
        const { dispatch, board_todo_list = [] } = this.props
        const new_board_todo_list = [...board_todo_list]
        const index = new_board_todo_list.findIndex(item => item.id == card_id)
        if (index == -1) {
            return
        }
        new_board_todo_list[index] = { ...new_board_todo_list[index], ...drawContent, name: drawContent.card_name }
        dispatch({
            type: 'simplemode/updateDatas',
            payload: {
                board_todo_list: new_board_todo_list
            }
        })
    }
    render() {
        const { drawerVisible, board_todo_list = [] } = this.props
        return (
            <div>
                {
                    board_todo_list.length ? (
                        board_todo_list.map(value => {
                            const { id } = value
                            return (
                                <BoardFeaturesItem key={id} itemValue={value} />
                            )
                        })
                    ) : (
                            <div className={`${globalStyles.authTheme} ${styles.nodataArea}`}>
                                <div className={`${globalStyles.authTheme} ${styles.alarm}`}>&#xe6fb;</div>
                                <div className={`${styles.title}`}>暂无待办事项</div>
                            </div>
                        )
                }
                <div className={styles.feature_item}></div>
                <TaskDetailModal
                    task_detail_modal_visible={drawerVisible}
                    // setTaskDetailModalVisible={this.setDrawerVisibleClose} //关闭任务弹窗回调
                    handleTaskDetailChange={this.handleCard}
                />
            </div>
        )
    }
}

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps(
    {
        simplemode: {
            simplemodeCurrentProject,
            board_todo_list = []
        },
        workbench: {
            datas: { projectList }
        },
        technological: {
            datas: { currentUserOrganizes, currentSelectOrganize = {} }
        },
        publicTaskDetailModal: { drawerVisible }
    }) {
    return {
        simplemodeCurrentProject,
        currentUserOrganizes,
        currentSelectOrganize,
        board_todo_list,
        drawerVisible,
        projectList
    }
}