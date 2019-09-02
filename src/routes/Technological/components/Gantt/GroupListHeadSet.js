import React, { Component } from 'react'
import ContentFilter from './components/contentFilter'
import { Dropdown, Tooltip } from 'antd'
import indexStyles from './index.less'
import { connect } from 'dva'
import globalStyles from '@/globalset/css/globalClassName.less'
import { beforeCreateBoardUpdateGantt } from './ganttBusiness';
import CreateProject from './../Project/components/CreateProject/index';

@connect(mapStateToProps)
export default class GroupListHeadSet extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dropdownVisible: false,
            addProjectModalVisible: false
        }
    }

    setGroupViewType = (group_view_type_new) => {
        const { dispatch, group_view_type } = this.props
        if (group_view_type == group_view_type_new) {
            return
        }
        dispatch({
            type: 'gantt/updateDatas',
            payload: {
                gantt_board_id: '0',
                group_view_type: group_view_type_new
            }
        })
        dispatch({
            type: 'gantt/getGanttData',
            payload: {}
        })
    }
    onVisibleChange = (bool) => {
        this.setDropdownVisible(bool)
    }
    setDropdownVisible = (bool) => {
        this.setState({
            dropdownVisible: bool
        })
    }
    //返回
    backClick = () => {
        const { dispatch } = this.props
        dispatch({
            type: 'gantt/updateDatas',
            payload: {
                gantt_board_id: '0'
            }
        })
        dispatch({
            type: 'gantt/getGanttData',
            payload: {

            }
        })
    }
    // 添加项目
    setAddProjectModalVisible = (data) => {
        const { addProjectModalVisible } = this.state
        this.setState({
            addProjectModalVisible: !addProjectModalVisible
        })
    }

    handleSubmitNewProject = data => {
        const { dispatch } = this.props;
        const calback = (id) => {
            if(!!!id) {
                return
            }
            dispatch({
                type: 'gantt/updateDatas',
                payload: {
                    gantt_board_id: id,
                }
            })
        }
        Promise.resolve(
            dispatch({
                type: 'project/addNewProject',
                payload: {
                    ...data,
                    calback
                }
            })
        )
            .then(() => {
                dispatch({
                    type: 'workbench/getProjectList',
                    payload: {}
                });
            })
            .then(() => {
                beforeCreateBoardUpdateGantt(dispatch)
            });
    };
    render() {
        const { dropdownVisible, addProjectModalVisible } = this.state
        const { target_scrollLeft, target_scrollTop, group_view_type = '1', gantt_board_id = '0', group_view_filter_boards, group_view_filter_users } = this.props
        const selected = `${indexStyles.button_nomal_background} ${indexStyles.type_select}`
        return (
            <div className={indexStyles.groupHeadSet} style={{ left: target_scrollLeft, top: target_scrollTop }}>
                <div className={indexStyles.set_content}>

                    <div className={indexStyles.set_content_left}>
                        {gantt_board_id != '0' && (
                            <div onClick={this.backClick} className={`${indexStyles.group_back_to_board} ${globalStyles.authTheme}`}>&#xe7ec;</div>
                        )}
                        <div className={indexStyles.set_content_view_type}>
                            <div onClick={() => this.setGroupViewType('1')} className={`${indexStyles.set_content_left_left} ${globalStyles.authTheme} ${group_view_type == '1' && selected}`}>&#xe604;</div>
                            <div onClick={() => this.setGroupViewType('2')} className={`${indexStyles.set_content_left_right} ${globalStyles.authTheme}  ${group_view_type == '2' && selected}`}>&#xe7b2;</div>
                        </div>

                    </div>

                    <div className={indexStyles.set_content_right}>
                        <Tooltip title={'内容过滤'}>
                            <Dropdown
                                overlay={<ContentFilter dropdownVisible={dropdownVisible} setDropdownVisible={this.setDropdownVisible} />}
                                trigger={['click']}
                                visible={dropdownVisible}
                                zIndex={500}>
                                <div className={`${indexStyles.set_content_right_left} ${globalStyles.authTheme} 
                                ${(group_view_filter_boards.length || group_view_filter_users.length) && indexStyles.has_filter_content}`}
                                    onClick={() => this.setDropdownVisible(true)} >&#xe8bd;</div>
                            </Dropdown>
                        </Tooltip>
                        {/* 在项目视图，并且在查看全部项目下 */}

                        {
                            group_view_type == '1' && gantt_board_id == '0' && (
                                <Tooltip title={'新建项目'}>
                                    <div className={`${indexStyles.set_content_right_right} ${globalStyles.authTheme}`}
                                        onClick={this.setAddProjectModalVisible}>&#xe846;</div>
                                </Tooltip>
                            )
                        }

                    </div>
                </div>
                {addProjectModalVisible && (
                    <CreateProject
                        setAddProjectModalVisible={this.setAddProjectModalVisible}
                        addProjectModalVisible={addProjectModalVisible}
                        addNewProject={this.handleSubmitNewProject}
                    />
                )}
            </div>
        )
    }
}
function mapStateToProps({ gantt: { datas: { target_scrollLeft = [], target_scrollTop = [], group_view_type, gantt_board_id, group_view_filter_boards, group_view_filter_users } }, }) {
    return { target_scrollLeft, target_scrollTop, group_view_type, gantt_board_id, group_view_filter_boards, group_view_filter_users }
}
