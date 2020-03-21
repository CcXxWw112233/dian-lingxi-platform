import React, { Component } from 'react'
import { connect } from 'dva'
import BoardFeaturesItem from './BoardFeaturesItem'
import globalStyles from '@/globalset/css/globalClassName.less'
import styles from './featurebox.less'
import TaskDetailModal from '@/components/TaskDetailModal'

@connect(mapStateToProps)
export default class BoardFeatures extends Component {
    // 修改任务
    handleCard = ({ card_id, drawContent = {}, operate_properties_code }) => {
        const { is_realize } = drawContent
        // 设置完成或
        if (is_realize == '1') {
            this.handleDeleteCard({ card_id })
            return
        }
        // 移除自己
        if ('EXECUTOR' == operate_properties_code) {
            const { properties } = drawContent
            const user_id = (localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {}).id
            const excutors = properties.find(item => item.code == 'EXECUTOR').data || []
            if (excutors.findIndex(item => item.user_id == user_id) == -1) {
                this.handleDeleteCard({ card_id })
                return
            }
        }
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
    handleDeleteCard = ({ card_id }) => {
        const { board_todo_list = [], dispatch } = this.props
        const new_board_todo_list = [...board_todo_list]
        const index = new_board_todo_list.findIndex(item => item.id == card_id)

        new_board_todo_list.splice(index, 1)
        dispatch({
            type: 'simplemode/updateDatas',
            payload: {
                board_todo_list: new_board_todo_list
            }
        })
    }
    renderTodoList = () => {
        const { board_todo_list = [] } = this.props
        return (
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
        )
    }

    // 业务逻辑太复杂时间太紧张，关闭弹窗后再直接拉取接口查询待办事项
    setTaskDetailModalVisible = () => {
        const { dispatch, simplemodeCurrentProject = {} } = this.props
        const { board_id } = simplemodeCurrentProject
        let params = {
            _organization_id: localStorage.getItem('OrganizationId'),
        }
        if (board_id && board_id != '0') {
            params.board_ids = board_id
        }
        dispatch({
            type: 'simplemode/getBoardsTodoList',
            payload: params
        })
    }

    renderWelcome = () => {
        return (
            <div className={`${globalStyles.authTheme} ${styles.nodataArea2}`}>
                <div className={`${globalStyles.authTheme} ${styles.alarm}`}>&#xe704;</div>
                <div className={`${styles.title}`}>欢迎来到聆悉，我们有以上项目功能，赶快新建一个项目体验吧～</div>
            </div>
        )
    }

    render() {
        const { drawerVisible, projectList = [], projectInitLoaded, board_todo_list = [] } = this.props
        return (
            <div>
                {
                    projectInitLoaded ? (
                        projectList.length ? (
                            this.renderTodoList()
                        ) : (
                                this.renderWelcome()
                            )
                    ) : ('')
                }
                <div className={styles.feature_item} style={{ display: board_todo_list.length ? 'block' : 'none' }}></div>
                <TaskDetailModal
                    task_detail_modal_visible={drawerVisible}
                    setTaskDetailModalVisible={this.setTaskDetailModalVisible} //关闭任务弹窗回调
                    handleTaskDetailChange={this.handleCard}
                    handleDeleteCard={this.handleDeleteCard}
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
            datas: { projectList, projectInitLoaded }
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
        projectList,
        projectInitLoaded
    }
}