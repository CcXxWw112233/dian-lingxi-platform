import React, { Component } from 'react'
import globalStyles from '@/globalset/css/globalClassName.less'
import styles from './index.less'
import { Checkbox,  } from 'antd'
import { connect } from 'dva'
import { selectBoardToSeeInfo, getOrgIdByBoardId, setBoardIdStorage, getOrgNameWithOrgIdFilter, checkIsHasPermissionInBoard } from '../../../../../utils/businessFunction'
import CreateProject from '@/routes/Technological/components/Project/components/CreateProject/index';

import BoardItem from './BoardItem'

@connect(mapStateToProps)
export default class MainBoard extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentDidMount() {
        const { dispatch } = this.props
        dispatch({
            type: 'workbench/getProjectList',
            payload: {}
        })
    }

    onSelectBoard = (board_id) => {
        const { projectList, dispatch } = this.props
        const selectBoard = projectList.filter(item => item.board_id === board_id);
        const selectOrgId = getOrgIdByBoardId(board_id)
        if (!selectBoard && selectBoard.length == 0) {
            message.error('数据异常，请刷新后重试');
            return;
        }
        if (board_id == '0') {
            dispatch({
                type: 'simplemode/updateDatas',
                payload: {
                    simplemodeCurrentProject: {}
                }
            });
            dispatch({
                type: 'accountSet/updateUserSet',
                payload: {
                    current_board: {}
                }
            });
            dispatch({
                type: 'technological/updateDatas',
                payload: {
                    currentSelectedProjectOrgIdByBoardId: ''
                }
            })
            selectBoardToSeeInfo({ board_id: '0', dispatch })
        }
        //设置当前选中的项目
        setBoardIdStorage(board_id);
        dispatch({
            type: 'simplemode/updateDatas',
            payload: {
                simplemodeCurrentProject: { ...selectBoard[0] }
            }
        });

        dispatch({
            type: 'accountSet/updateUserSet',
            payload: {
                current_board: board_id
            }
        });

        dispatch({
            type: 'technological/updateDatas',
            payload: {
                currentSelectedProjectOrgIdByBoardId: selectOrgId
            }
        })

        selectBoardToSeeInfo({ board_id: selectBoard[0] && selectBoard[0].board_id, board_name: selectBoard[0] && selectBoard[0].board_name, dispatch })

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

    // 渲染主区域
    renderBoardArea = () => {
        return (
            <div className={styles.board_area}>
                <div className={styles.board_area_top}>
                    <div className={styles.board_area_top_lf}>我的项目</div>
                    <div className={styles.board_area_top_rt}>
                        <Checkbox style={{ color: '#fff' }}>全选</Checkbox>
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
                    <BoardItem key={board_id} itemValue={value} />
                )
            })
        )
    }


    render() {
        const { addProjectModalVisible } = this.state
        return (
            <>
                {/* {this.renderCreate()} */}
                {this.renderBoardArea()}
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
        userOrgPermissions
    }
}