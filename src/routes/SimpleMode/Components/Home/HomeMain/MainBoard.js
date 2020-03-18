import React, { Component } from 'react'
import globalStyles from '@/globalset/css/globalClassName.less'
import styles from './index.less'
import { Checkbox, } from 'antd'
import { connect } from 'dva'
import { selectBoardToSeeInfo, getOrgIdByBoardId, setBoardIdStorage, getOrgNameWithOrgIdFilter, checkIsHasPermissionInBoard } from '../../../../../utils/businessFunction'
import CreateProject from '@/routes/Technological/components/Project/components/CreateProject/index';

import BoardItem from './BoardItem'

@connect(mapStateToProps)
export default class MainBoard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            local_selected_board: {}
        }
    }
    componentDidMount() {
        const { dispatch } = this.props
        dispatch({
            type: 'workbench/getProjectList',
            payload: {}
        })
    }
    setAddProjectModalVisible = () => {
        this.setState({
            addProjectModalVisible: !this.state.addProjectModalVisible
        })
    }
    handleSubmitNewProject = data => {
        const { dispatch } = this.props;
        this.setAddProjectModalVisible();
        const calback = (id, name) => {
            dispatch({
                type: 'workbench/getProjectList',
                payload: {}
            });
            selectBoardToSeeInfo({ board_id: id, board_name: name, dispatch, org_id: data._organization_id, group_view_type: '4' }) //极简模式项目选择
            window.sessionStorage.removeItem('session_currentSelectedWorkbenchBox') //重置当前盒子类型
            dispatch({//重置当前盒子类型
                type: 'simplemode/updateDatas',
                payload: {
                    currentSelectedWorkbenchBox: {}
                }
            });
            dispatch({
                type: 'simplemode/routingJump',
                payload: {
                    route: '/technological/simplemode/workbench'
                }
            });
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
    }
    // 缓存上一个选择的项目
    setLocalSelectedBoard = (data = {}) => {
        this.setState({
            local_selected_board: data
        })
    }
    checkBoxChange = (e) => {
        const checked = e.target.checked
        const { local_selected_board = {} } = this.state
        const { projectList = [], dispatch } = this.props

        if (checked) {
            dispatch({
                type: 'simplemode/updateDatas',
                payload: {
                    simplemodeCurrentProject: {}
                }
            });
            dispatch({
                type: 'accountSet/updateUserSet',
                payload: {
                    current_board: '0'
                }
            });
            dispatch({
                type: 'technological/updateDatas',
                payload: {
                    currentSelectedProjectOrgIdByBoardId: ''
                }
            })
            selectBoardToSeeInfo({ board_id: '0', dispatch })
        } else {
            //设置当前选中的项目
            if (local_selected_board.board_id) {
                setBoardIdStorage(local_selected_board.board_id);
                dispatch({
                    type: 'simplemode/updateDatas',
                    payload: {
                        simplemodeCurrentProject: { local_selected_board }
                    }
                });
                dispatch({
                    type: 'accountSet/updateUserSet',
                    payload: {
                        current_board: local_selected_board.board_id
                    }
                });
                dispatch({
                    type: 'technological/updateDatas',
                    payload: {
                        currentSelectedProjectOrgIdByBoardId: local_selected_board.board_id
                    }
                })
                selectBoardToSeeInfo({ board_id: local_selected_board && local_selected_board.board_id, board_name: local_selected_board && local_selected_board.board_name, dispatch })
            } else {
                setBoardIdStorage(projectList[0].board_id);
                dispatch({
                    type: 'simplemode/updateDatas',
                    payload: {
                        simplemodeCurrentProject: { ...projectList[0] }
                    }
                });

                dispatch({
                    type: 'accountSet/updateUserSet',
                    payload: {
                        current_board: projectList[0].board_id
                    }
                });

                dispatch({
                    type: 'technological/updateDatas',
                    payload: {
                        currentSelectedProjectOrgIdByBoardId: projectList[0].board_id
                    }
                })
                selectBoardToSeeInfo({ board_id: projectList[0] && projectList[0].board_id, board_name: projectList[0] && projectList[0].board_name, dispatch })
            }

        }
    }
    // 渲染主区域
    renderBoardArea = () => {
        const { simplemodeCurrentProject = {}, local_selected_board = {} } = this.props
        return (
            <div className={styles.board_area}>
                <div className={styles.board_area_top}>
                    <div className={styles.board_area_top_lf}>我的项目</div>
                    <div className={styles.board_area_top_rt}>
                        <Checkbox
                            checked={(simplemodeCurrentProject.board_id == '0' || !simplemodeCurrentProject.board_id) && !local_selected_board.board_id}
                            onChange={this.checkBoxChange}
                            style={{ color: '#fff' }}>全选</Checkbox>
                    </div>
                </div>
                <div className={`${styles.board_area_middle} ${globalStyles.global_vertical_scrollbar}`}>
                    {this.renderBoardList()}
                </div>
                <div className={styles.board_area_bott}>
                    <div className={`${styles.create_btn}`} onClick={this.setAddProjectModalVisible}>
                        <i className={`${globalStyles.authTheme}`}>&#xe846;</i>
                        <span>新建项目</span>
                    </div>
                </div>
            </div>
        )
    }
    renderCreate = () => {
        return (
            <div className={styles.create}>
                <div className={`${styles.create_top} ${globalStyles.authTheme}`}>
                    &#xe63a;
                        </div>
                <div className={styles.create_middle}>暂无项目，赶快新建一个吧</div>
                <div className={styles.create_btn} onClick={this.setAddProjectModalVisible}>
                    <i className={`${globalStyles.authTheme}`}>&#xe846;</i>
                    <span>新建项目</span>
                </div>
            </div>
        )
    }

    // 项目列表操作项
    renderBoardList = () => {
        const { projectList = [], simplemodeCurrentProject = {} } = this.props
        return (
            projectList.map(value => {
                const { board_id } = value
                return (
                    <BoardItem key={board_id} itemValue={value} setLocalSelectedBoard={this.setLocalSelectedBoard} />
                )
            })
        )
    }


    render() {
        const { addProjectModalVisible } = this.state
        const { projectList = [], projectInitLoaded } = this.props
        return (
            <>
                {
                    projectInitLoaded ? (
                        projectList.length ? (
                            this.renderBoardArea()
                        ) : (
                                this.renderCreate()
                            )
                    ) : ('')
                }
                <CreateProject
                    setAddProjectModalVisible={this.setAddProjectModalVisible}
                    addProjectModalVisible={addProjectModalVisible} //addProjectModalVisible
                    addNewProject={this.handleSubmitNewProject}
                />
            </>
        )
    }
}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps(
    {
        workbench: {
            datas: {
                projectList,
                projectInitLoaded
            } },
        simplemode: {
            myWorkbenchBoxList,
            workbenchBoxList,
            simplemodeCurrentProject
        },
        technological: {
            datas: {
                currentUserOrganizes,
                currentSelectedProjectOrgIdByBoardId,
                userOrgPermissions
            }
        },
    }) {
    return {
        projectList,
        myWorkbenchBoxList,
        workbenchBoxList,
        simplemodeCurrentProject,
        currentUserOrganizes,
        currentSelectedProjectOrgIdByBoardId,
        userOrgPermissions,
        projectInitLoaded
    }
}