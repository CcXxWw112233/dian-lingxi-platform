import React, { Component } from 'react';
import { connect } from 'dva';
import { message, Menu, Dropdown, Modal, Button } from 'antd';
import styles from './index.less';
import globalStyles from '@/globalset/css/globalClassName.less';
import OutlineTree from './components/OutlineTree';
import TreeNode from './components/OutlineTree/TreeNode'
import {
    addTaskInWorkbench,
    updateTask,
    changeTaskType,
    updateMilestone,
    addMilestoneExcutos,
    removeMilestoneExcutos,
    addTaskExecutor,
    removeTaskExecutor,
    updateTaskVTwo
} from '../../../../services/technological/task';
import { addMenbersInProject } from '../../../../services/technological/project';
import { getBoardTemplateList, importBoardTemplate } from '@/services/technological/gantt.js';
import { createMilestone } from '@/services/technological/prjectDetail.js';
import { isApiResponseOk } from '@/utils/handleResponseData';
import { checkIsHasPermissionInBoard, getOrgIdByBoardId, getGlobalData } from '@/utils/businessFunction';
import DetailInfo from '@/routes/Technological/components/ProjectDetail/DetailInfo/index'
import { PROJECT_TEAM_BOARD_MEMBER, NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME, PROJECT_TEAM_CARD_CREATE, PROJECT_TEAM_CARD_EDIT, PROJECT_TEAM_BOARD_MILESTONE } from '@/globalset/js/constant';
import ShowAddMenberModal from '../../../../routes/Technological/components/Project/ShowAddMenberModal';
import SafeConfirmModal from './components/SafeConfirmModal';
import { updateFlowInstanceNameOrDescription } from '../../../../services/technological/workFlow';
import SaveBoardTemplate from './components/Modal/SaveBoardTemplate'
import { task_item_margin_top } from './constants';
import { currentNounPlanFilterName } from '../../../../utils/businessFunction';
import { PROJECTS } from '../../../../globalset/js/constant';
import { closeFeature } from '../../../../utils/temporary';
import { onChangeCardHandleCardDetail } from './ganttBusiness';
import { rebackCreateNotify } from '../../../../components/NotificationTodos';
const { SubMenu } = Menu;
// const { TreeNode } = OutlineTree;
const { confirm } = Modal;

@connect(mapStateToProps)
export default class OutLineHeadItem extends Component {
    state = {
        template_list: [],
        board_info_visible: false,
        show_add_menber_visible: false,
        safeConfirmModalVisible: false,
        selectedTpl: null,
        save_board_template_visible: false,
    }
    componentDidMount() {
        const OrganizationId = localStorage.getItem('OrganizationId')
        const aboutBoardOrganizationId = getGlobalData('aboutBoardOrganizationId')
        if (
            !OrganizationId ||
            (OrganizationId == '0' && (!aboutBoardOrganizationId || aboutBoardOrganizationId == '0'))
        ) {
            return
        }
        const _organization_id = OrganizationId != '0' ? OrganizationId : aboutBoardOrganizationId
        getBoardTemplateList({ _organization_id }).then((res) => {
            //console.log("getBoardTemplateList", res);
            if (isApiResponseOk(res)) {
                const { data } = res
                this.setState({
                    template_list: data
                })
            } else {
                message.error(res.message)
            }
        });
    }

    handleProjectMenu = ({ key }) => {
        const { dispatch, gantt_board_id } = this.props;
        if (key.indexOf('importTpl') != -1) {
            let tplId = key.replace("importTpl_", "");
            const { template_list = [] } = this.state;
            const selectedTpl = template_list.find((item) => item.id == tplId);
            this.setState({
                safeConfirmModalVisible: true,
                selectedTpl,
            });

        } else {
            if (key == 'boardInfo') {
                this.setBoardInfoVisible();
            }
        }


    }

    ganttProjectMenus = () => {
        const { gantt_board_id } = this.props;
        const { template_list = [] } = this.state;
        return (
            <Menu onClick={this.handleProjectMenu}>
                {/* <Menu.Item key="publishTpl" disabled>将项目内容发布为模版</Menu.Item>
                <Menu.Item key="saveTpl" disabled>将项目内容保存为模版</Menu.Item> */}
                {/* {
                    checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_CREATE, gantt_board_id) && checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_MILESTONE, gantt_board_id) &&
                    <SubMenu title="引用项目模版" >
                        {
                            template_list.map((item) => {
                                return (
                                    <Menu.Item key={`importTpl_${item.id}`}>{item.name}</Menu.Item>
                                );
                            })
                        }
                    </SubMenu>
                } */}


                <Menu.Item key="boardInfo">项目信息</Menu.Item>
            </Menu>
        );
    }

    updateOutLineTreeData = (outline_tree) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'gantt/handleOutLineTreeData',
            payload: {
                data: outline_tree
            }
        });
    }
    onSelect = (selectedKeys, info) => {
        //console.log('selected', selectedKeys, info);
    };

    onHover = (id, hover, parentId, is_add_node) => {
        //console.log("大纲:onHover", id, hover);
        const { dispatch, outline_tree } = this.props;
        let nodeValue = {};
        // 设置hover状态
        let outline_hover_obj = {}
        if (is_add_node) {
            outline_hover_obj.add_id = id
        } else {
            outline_hover_obj.id = id
        }
        if (hover) {
            if (is_add_node) {
                nodeValue = OutlineTree.getTreeAddNodeValue(outline_tree, id) || {};
            } else {
                nodeValue = OutlineTree.getTreeNodeValue(outline_tree, id) || {};
            }

        } else {
            if (is_add_node) {
                let placeholderNodeValue = OutlineTree.getTreeAddNodeValue(outline_tree, id) || {};
                placeholderNodeValue.is_focus = false;
            }
            outline_hover_obj = {}
        }

        dispatch({
            type: 'gantt/updateDatas',
            payload: {
                outline_hover_obj: outline_hover_obj//nodeValue
            }
        });
        // this.updateOutLineTreeData(outline_tree);

    }

    onExpand = (id, is_expand) => {
        //console.log("大纲:onExpand", id, is_expand);
        const { dispatch, outline_tree } = this.props;
        let nodeValue = OutlineTree.getTreeNodeValue(outline_tree, id);
        if (nodeValue) {
            nodeValue.is_expand = is_expand;
            this.updateOutLineTreeData(outline_tree);
        } else {
            console.error("OutlineTree.getTreeNodeValue:未查询到节点");
        }

    }

    onChangeCardHandleCardDetail = (nodeValue) => {
        const { card_detail_id, selected_card_visible, itemValue = {}, dispatch } = this.props
        const { id, parent_card_id } = nodeValue
        onChangeCardHandleCardDetail({
            card_detail_id, //来自任务详情的id
            selected_card_visible, //任务详情弹窗是否弹开
            dispatch,
            operate_id: id, //当前操作的id
            operate_parent_card_id: parent_card_id, //当前操作的任务的父任务id
        })
    }

    onDataProcess = ({ action, param, calback }) => {
        //console.log("大纲:onDataProcess", action, param);
        const { dispatch, gantt_board_id, group_view_type } = this.props;
        let { outline_tree = [] } = this.props;
        switch (action) {
            case 'add_milestone':
                {
                    let updateParams = {};
                    updateParams.name = param.name;
                    updateParams.board_id = gantt_board_id;

                    createMilestone({ ...updateParams }, { isNotLoading: false })
                        .then(res => {
                            if (isApiResponseOk(res)) {
                                let addNodeValue = {
                                    id: res.data,
                                    tree_type: '1',
                                    name: param.name,
                                    is_expand: true,
                                    children: [],
                                    executors: []
                                };
                                const index = outline_tree.findIndex(item => item.add_id == 'add_milestone')
                                if (index != -1) {
                                    outline_tree.splice(index, 0, addNodeValue);
                                } else {
                                    outline_tree.push(addNodeValue);
                                }
                                outline_tree = outline_tree.filter(item => item.add_id != 'add_milestone')
                                //this.setCreateAfterInputFous(null,outline_tree);
                                this.updateOutLineTreeData(outline_tree);
                                // 保存位置
                                dispatch({
                                    type: 'gantt/saveGanttOutlineSort',
                                    payload: {
                                        outline_tree
                                    }
                                })
                            } else {
                                message.error(res.message)
                            }
                        }).catch(err => {
                            message.error('更新失败')
                        })
                }
                break;
            case 'edit_milestone':
                {

                    let updateParams = {};
                    updateParams.id = param.id;
                    updateParams.name = param.name;

                    updateMilestone({ ...updateParams }, { isNotLoading: false })
                        .then(res => {
                            if (isApiResponseOk(res)) {
                                let nodeValue = OutlineTree.getTreeNodeValue(outline_tree, param.id);

                                if (nodeValue) {
                                    nodeValue.name = param.name;
                                    this.updateOutLineTreeData(outline_tree);
                                } else {
                                    console.error("OutlineTree.getTreeNodeValue:未查询到节点");
                                }
                            } else {

                                message.error(res.message)
                            }
                        }).catch(err => {
                            message.error('更新失败')
                        })
                }
                break;
            case 'add_task':
                {

                    if (!checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_CREATE, gantt_board_id)) {
                        message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
                        return;
                    }
                    let updateParams = {};
                    updateParams.add_type = 0;

                    updateParams.name = param.name;
                    updateParams.board_id = gantt_board_id;
                    updateParams.start_time = param.start_time;
                    updateParams.due_time = param.due_time;


                    let paraseNodeValue = OutlineTree.getTreeNodeValue(outline_tree, param.parentId);
                    if (paraseNodeValue && paraseNodeValue.tree_type == '1') {
                        updateParams.milestone_id = paraseNodeValue.id;
                    } else {
                        updateParams.parent_id = param.parentId;
                    }

                    addTaskInWorkbench({ ...updateParams }, { isNotLoading: false })
                        .then(res => {
                            if (isApiResponseOk(res)) {
                                let nodeValue = OutlineTree.getTreeNodeValue(outline_tree, param.parentId);
                                let addNodeValue = {
                                    id: res.id,
                                    tree_type: '2',
                                    name: param.name,
                                    is_expand: true,
                                    children: [],
                                    time_span: 0,
                                    ...res.data
                                };

                                let children = [];
                                if (nodeValue) {
                                    children = nodeValue.children
                                } else {
                                    children = outline_tree
                                }
                                if (children.length > 0) {
                                    const index = children.findIndex((item) => item.tree_type == '0');
                                    children.splice(index, 0, addNodeValue);
                                } else {
                                    children.push(addNodeValue);
                                }
                                if (nodeValue) {
                                    nodeValue.children = children;
                                } else {
                                    outline_tree = children
                                }
                                if (nodeValue) {
                                    this.setCreateAfterInputFous(paraseNodeValue, outline_tree);
                                }


                                //当前的添加按钮
                                let addInputNodeValue = OutlineTree.getTreeNodeValueByName(outline_tree, 'add_id', param.add_id);
                                addInputNodeValue.start_time = null;
                                addInputNodeValue.due_time = null;
                                addInputNodeValue.time_span = 1;
                                addInputNodeValue.name = '';
                                addInputNodeValue.editing = true;
                                this.updateOutLineTreeData(outline_tree);
                                // 保存位置
                                dispatch({
                                    type: 'gantt/saveGanttOutlineSort',
                                    payload: {
                                        outline_tree
                                    }
                                })
                                if (typeof calback == 'function') {
                                    calback()
                                }
                            } else {

                                message.error(res.message)
                            }
                        }).catch(err => {
                            console.error('sssasd', err);

                            message.error('更新失败')
                        })

                }
                break;
            case 'edit_task':
                {
                    if (!checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_EDIT, gantt_board_id)) {
                        message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
                        return;
                    }
                    let updateParams = {};
                    updateParams.card_id = param.id;
                    updateParams.name = param.name;
                    updateParams.board_id = gantt_board_id;
                    // if(){

                    // }

                    updateParams.time_span = param.time_span;
                    if (param.time_span == 0) {
                        updateParams.start_time = null;
                        updateParams.due_time = null;
                    } else {
                        updateParams.start_time = param.start_time;
                        updateParams.due_time = param.due_time;
                    }
                    updateTaskVTwo({ ...updateParams }, { isNotLoading: false })
                        .then(res => {
                            if (isApiResponseOk(res)) {
                                rebackCreateNotify.call(this, { res, id: param.id, board_id: gantt_board_id, group_view_type, dispatch })

                                let nodeValue = OutlineTree.getTreeNodeValue(outline_tree, param.id);
                                if (nodeValue) {
                                    this.onChangeCardHandleCardDetail(nodeValue)
                                    nodeValue.name = param.name;
                                    nodeValue.time_span = param.time_span;
                                    if (param.time_span == 0) {
                                        nodeValue.start_time = null;
                                        nodeValue.due_time = null;
                                    } else {
                                        nodeValue.start_time = param.start_time;
                                        nodeValue.due_time = param.due_time;
                                    }
                                    this.updateOutLineTreeData(outline_tree);
                                } else {
                                    console.error("OutlineTree.getTreeNodeValue:未查询到节点");
                                }
                                dispatch({
                                    type: `gantt/updateOutLineTree`,
                                    payload: {
                                        datas: [...res.data.scope_content.filter(item => item.id != param.id)]
                                    }
                                })
                            } else {

                                message.error(res.message)
                            }
                        }).catch(err => {
                            message.error('更新失败')
                        })
                }
                break;
            case 'add_executor':
                {
                    const { projectDetailInfoData } = this.props;
                    if (param.tree_type != '1' && !checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_EDIT, gantt_board_id)) {
                        message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
                        return;
                    }
                    let updateParams = {};
                    //里程碑
                    if (param.tree_type == '1') {
                        updateParams.id = param.id;
                        updateParams.user_id = param.user_id;
                        addMilestoneExcutos({ ...updateParams }, { isNotLoading: false })
                            .then(res => {
                                if (isApiResponseOk(res)) {
                                    let nodeValue = OutlineTree.getTreeNodeValue(outline_tree, param.id);
                                    if (nodeValue) {
                                        if (!nodeValue.executors) {
                                            nodeValue.executors = [];
                                        }
                                        if (projectDetailInfoData.data) {

                                            nodeValue.executors.push({ ...(projectDetailInfoData.data.find((item) => item.user_id == param.user_id)), id: param.user_id });
                                        }

                                        this.updateOutLineTreeData(outline_tree);
                                    } else {
                                        console.error("OutlineTree.getTreeNodeValue:未查询到节点");
                                    }
                                } else {

                                    message.error(res.message)
                                }
                            }).catch(err => {
                                message.error('设置里程碑负责人失败')
                            });
                    }
                    if (param.tree_type == '2') {
                        updateParams.card_id = param.id;
                        updateParams.executor = param.user_id;
                        addTaskExecutor({ ...updateParams }, { isNotLoading: false })
                            .then(res => {
                                if (isApiResponseOk(res)) {
                                    let nodeValue = OutlineTree.getTreeNodeValue(outline_tree, param.id);
                                    if (nodeValue) {
                                        if (!nodeValue.executors) {
                                            nodeValue.executors = [];
                                        }
                                        nodeValue.executors.push({ ...(projectDetailInfoData.data.find((item) => item.user_id == param.user_id)), id: param.user_id });
                                        this.updateOutLineTreeData(outline_tree);
                                    } else {
                                        console.error("OutlineTree.getTreeNodeValue:未查询到节点");
                                    }
                                } else {

                                    message.error(res.message)
                                }
                            }).catch(err => {
                                message.error('设置里程碑负责人失败')
                            });
                    }


                }
                break;
            case 'remove_executor':
                {
                    if (param.tree_type != '1' && !checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_EDIT, gantt_board_id)) {
                        message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
                        return;
                    }
                    const { outline_tree } = this.props;
                    let updateParams = {};
                    //里程碑
                    if (param.tree_type == '1') {
                        updateParams.id = param.id;
                        updateParams.user_id = param.user_id;
                        removeMilestoneExcutos({ ...updateParams }, { isNotLoading: false })
                            .then(res => {
                                if (isApiResponseOk(res)) {
                                    let nodeValue = OutlineTree.getTreeNodeValue(outline_tree, param.id);
                                    if (nodeValue && nodeValue.executors) {
                                        nodeValue.executors = nodeValue.executors.filter(item => (item.id || item.user_id) != param.user_id)
                                        // nodeValue.executors.splice(nodeValue.executors.findIndex((item) => item.id == param.id));
                                        this.updateOutLineTreeData(outline_tree);
                                    } else {
                                        console.error("OutlineTree.getTreeNodeValue:未查询到节点");
                                    }
                                } else {

                                    message.error(res.message)
                                }
                            }).catch(err => {
                                message.error('更新失败')
                            })
                    }

                    //任务
                    if (param.tree_type == '2') {
                        updateParams.card_id = param.id;
                        updateParams.executor = param.user_id;
                        removeTaskExecutor({ ...updateParams }, { isNotLoading: false })
                            .then(res => {
                                if (isApiResponseOk(res)) {
                                    let nodeValue = OutlineTree.getTreeNodeValue(outline_tree, param.id);
                                    if (nodeValue && nodeValue.executors) {
                                        nodeValue.executors.splice(nodeValue.executors.findIndex((item) => item.id == param.id));
                                        this.updateOutLineTreeData(outline_tree);
                                    } else {
                                        console.error("OutlineTree.getTreeNodeValue:未查询到节点");
                                    }
                                } else {

                                    message.error(res.message)
                                }
                            }).catch(err => {
                                message.error('更新失败')
                            })
                    }

                }
                break;
            case 'reloadProjectDetailInfo':
                {
                    dispatch({
                        type: 'gantt/getAboutUsersBoards',
                        payload: {

                        }
                    });
                    dispatch({
                        type: 'projectDetail/projectDetailInfo',
                        payload: {
                            id: gantt_board_id,
                        }
                    }).then(res => {
                        if (isApiResponseOk(res)) {
                            if (calback) {
                                calback({ user_data: res.data.data })
                            }
                        }
                    });
                }
                break;
            case 'onBlur': {
                // let nodeValue = OutlineTree.getTreeAddNodeValue(outline_tree, param.add_id);
                let nodeValue = OutlineTree.getTreeNodeValueByName(outline_tree, 'add_id', param.add_id);
                if (nodeValue) {
                    // nodeValue.name = param.name;
                    if (nodeValue.parent_id) {
                        nodeValue.editing = false;
                        nodeValue.time_span = 0;
                        nodeValue.start_time = null;
                        nodeValue.due_time = null;
                        this.updateOutLineTreeData(outline_tree);
                    } else { //在最外层插入时，插入成功后会任务弹窗聚焦,失焦时没去掉输入创建的item
                        const new_outline_tree = JSON.parse(JSON.stringify(outline_tree)).filter(item => !item.add_id)
                        this.updateOutLineTreeData(new_outline_tree);
                    }
                    if (typeof calback == 'function') {
                        calback()
                    }
                } else {
                    console.error("OutlineTree.getTreeNodeValue:未查询到节点");
                }
            }
                break
            case 'edit_flow':

                let updateParams = {};
                updateParams.id = param.id;
                updateParams.name = param.name;

                updateFlowInstanceNameOrDescription({ ...updateParams }, { isNotLoading: false })
                    .then(res => {
                        if (isApiResponseOk(res)) {
                            let nodeValue = OutlineTree.getTreeNodeValue(outline_tree, param.id);

                            if (nodeValue) {
                                nodeValue.name = param.name;
                                this.updateOutLineTreeData(outline_tree);
                            } else {
                                console.error("OutlineTree.getTreeNodeValue:未查询到节点");
                            }
                        } else {

                            message.error(res.message)
                        }
                    }).catch(err => {
                        message.error('更新失败')
                    })
                break
            default:
                break;

        }
    }

    setCreateAfterInputFous = (paraseNodeValue, outline_tree = []) => {
        let placeholder = null;
        if (paraseNodeValue) {
            placeholder = paraseNodeValue.children.find((item) => item.tree_type == '0');

        } else {
            placeholder = outline_tree.find((item) => item.tree_type == '0');
        }
        if (placeholder) {
            placeholder.is_focus = true;
        }
    }
    renderGanttOutLineTree = (outline_tree, level, parentNode) => {
        if (!outline_tree) {
            return null;
        }
        //console.log("outline_tree", outline_tree);
        return (
            outline_tree.map((item, index) => {
                if (item.children && item.children.length > 0) {
                    return (
                        <TreeNode {...this.props} key={index} nodeValue={item} level={level} onHover={this.onHover} setScrollPosition={this.props.setScrollPosition} setGoldDateArr={this.props.setGoldDateArr}>
                            {this.renderGanttOutLineTree(item.children, level + 1, item)}
                        </TreeNode>
                    );
                } else {
                    if (item.tree_type == 0) {
                        if (item.add_id.indexOf('add_milestone') != -1) {
                            return (
                                this.renderAddMilestone(item)
                                // <TreeNode
                                //     setScrollPosition={this.props.setScrollPosition}
                                //     setGoldDateArr={this.props.setGoldDateArr}
                                //     type={'1'}
                                //     level={level}
                                //     placeholder={'新建里程碑'}
                                //     onHover={this.onHover}
                                //     nodeValue={item}//{{ add_id: 'add_milestone', 'tree_type': '0' }}
                                //     icon={<span className={`${styles.addMilestoneNode} ${globalStyles.authTheme}`}  >&#xe8fe;</span>}
                                //     label={<span className={styles.addMilestone}>新建里程碑</span>} key="addMilestone">
                                // </TreeNode>
                            )
                        } else {
                            return (
                                <TreeNode
                                    setScrollPosition={this.props.setScrollPosition}
                                    setGoldDateArr={this.props.setGoldDateArr}
                                    level={level}
                                    nodeValue={item}
                                    type={'2'}
                                    onHover={this.onHover}
                                    placeholder={parentNode && parentNode.tree_type == '2' ? '新建子任务' : '新建任务'}
                                    icon={<span className={`${styles.addTaskNode} ${globalStyles.authTheme}`}  >&#xe8fe;</span>}
                                    label={<span className={styles.addTask}>{parentNode && parentNode.tree_type == '2' ? '新建子任务' : '新建任务'}</span>} key={`addTask_${item.index}`}>
                                </TreeNode>
                            );
                        }
                    } else {
                        return (<TreeNode  {...this.props} setScrollPosition={this.props.setScrollPosition} setGoldDateArr={this.props.setGoldDateArr} key={index} nodeValue={item} level={level} onHover={this.onHover}></TreeNode>);
                    }

                }


            })
        );
    }
    setBoardInfoVisible = () => {
        const { board_info_visible } = this.state
        const { dispatch, gantt_board_id, projectDetailInfoData } = this.props
        //console.log("projectDetailInfoData",projectDetailInfoData);
        if (!board_info_visible) {
            dispatch({
                type: 'projectDetail/projectDetailInfo',
                payload: {
                    id: gantt_board_id
                }
            })
            let _organization_id = localStorage.getItem('OrganizationId')
            dispatch({
                type: 'projectDetail/getProjectRoles',
                payload: {
                    type: '2',
                    _organization_id: (!_organization_id || _organization_id) == '0' ? getGlobalData('aboutBoardOrganizationId') : _organization_id
                }
            })
        }
        this.setState({
            board_info_visible: !board_info_visible
        })
    }

    //添加项目组成员操作
    setShowAddMenberModalVisibile = () => {
        this.setState({
            show_add_menber_visible: !this.state.show_add_menber_visible
        })
    }

    addMenbersInProject = (values) => {
        const { gantt_board_id } = this.props;
        const { dispatch } = this.props
        addMenbersInProject({ ...values }).then(res => {
            if (isApiResponseOk(res)) {
                message.success('已成功添加项目成员')
                setTimeout(() => {
                    dispatch({
                        type: 'gantt/getAboutUsersBoards',
                        payload: {

                        }
                    })
                }, 1000)
                setTimeout(() => {
                    dispatch({
                        type: 'projectDetail/projectDetailInfo',
                        payload: {
                            id: gantt_board_id
                        }
                    })
                }, 1000)

            } else {
                message.error(res.message)
            }
        })
    }
    invitationJoin = () => {
        const { gantt_board_id } = this.props;
        if (!checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_MEMBER, gantt_board_id)) {
            message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
            return false
        }
        this.setShowAddMenberModalVisibile()
    }

    changeSafeConfirmModalVisible = () => {
        this.setState({
            safeConfirmModalVisible: !this.state.safeConfirmModalVisible
        });
    }


    onImportBoardTemplate = () => {
        const { dispatch, gantt_board_id } = this.props;
        const { selectedTpl = {} } = this.state;
        importBoardTemplate({ "board_id": gantt_board_id, 'template_id': selectedTpl.id }).then(res => {
            if (isApiResponseOk(res)) {
                //console.log("importBoardTemplate", res);
                dispatch({
                    type: 'gantt/getGanttData',
                    payload: {

                    }
                })
            } else {
                message.error(res.message)
            }
        }).catch(err => {
            message.error('引入模板失败')
        })
    }

    // 一键折叠或一键展开
    recusionSetFold = (data, fold_state) => {
        if (data) {
            data = data.map(item => {
                item.parent_expand = fold_state
                item.is_expand = fold_state
                let { children } = item
                if (children && children.length) {
                    this.recusionSetFold(children, fold_state)
                }
                return item
            })
        }
    }
    outlineTreeFold = (action) => {
        const { outline_tree, dispatch } = this.props
        let new_outline_tree = JSON.parse(JSON.stringify(outline_tree))
        const fold_state = action == 'fold' ? false : true
        this.recusionSetFold(new_outline_tree, fold_state)
        dispatch({
            type: 'gantt/handleOutLineTreeData',
            payload: {
                data: new_outline_tree
            }
        })
    }
    isExistExpand = () => { //是否存在已经展开的树
        const { outline_tree } = this.props
        let flag = false
        const recusionCheck = (data) => {
            for (let val of data) {
                if (val['is_expand']) { //存在展开了
                    flag = true
                    break
                } else {
                    const { children = [] } = val
                    if (children.length) {
                        recusionCheck(children)
                    }
                }
            }
        }
        const levelone_tree = outline_tree.filter(item => item.is_expand)
        if (!levelone_tree.length) { //最外层都是收起状态则是收起
            return false
        }
        recusionCheck(outline_tree)
        return flag
    }

    // 设置保存模板弹窗------start
    saveBoardTemplateVisible = (bool) => {
        this.setState({
            save_board_template_visible: bool
        })
    }

    // 设置保存模板弹窗------end
    renderAddMilestone = (item, normal) => {
        return (
            <TreeNode
                setScrollPosition={this.props.setScrollPosition}
                setGoldDateArr={this.props.setGoldDateArr}
                type={'1'}
                placeholder={'新建里程碑'}
                onHover={this.onHover}
                nodeValue={normal ? { add_id: 'add_milestone_out', 'tree_type': '0' } : item}//{{ add_id: 'add_milestone', 'tree_type': '0' }}
                icon={<span className={`${styles.addMilestoneNode} ${globalStyles.authTheme}`}  >&#xe8fe;</span>}
                label={<span className={styles.addMilestone}>新建里程碑</span>} key="addMilestone">
            </TreeNode>
        )
    }
    render() {
        const { board_info_visible, show_add_menber_visible, safeConfirmModalVisible } = this.state;
        const { outline_tree, outline_hover_obj, gantt_board_id, projectDetailInfoData, outline_tree_round, changeOutLineTreeNodeProto, deleteOutLineTreeNode } = this.props;
        //console.log("刷新了数据", outline_tree);
        return (
            <div className={styles.outline_wrapper} style={{ marginTop: task_item_margin_top }}>

                <OutlineTree
                    // defaultExpandedKeys={['0-0-0']}
                    gantt_board_id={gantt_board_id}
                    onSelect={this.onSelect}
                    onDataProcess={this.onDataProcess}
                    onExpand={this.onExpand}
                    onHover={this.onHover}
                    hoverItem={outline_hover_obj}
                    outline_tree_round={outline_tree_round}
                    projectDetailInfoData={projectDetailInfoData}
                    changeOutLineTreeNodeProto={changeOutLineTreeNodeProto}
                    deleteOutLineTreeNode={deleteOutLineTreeNode}
                >
                    {this.renderGanttOutLineTree(outline_tree, 0)}
                    {this.renderAddMilestone({}, true)}

                </OutlineTree>

                <div className={styles.outlineFooter}>
                    {
                        !this.isExistExpand() ? (
                            <div onClick={() => this.outlineTreeFold('expand')} style={{ color: '#1890FF' }}>
                                <span className={`${globalStyles.authTheme}`} style={{ fontSize: 16, marginRight: 2 }}>&#xe712;</span>
                                <span>展开全部</span>
                            </div>
                        ) : (
                                <div onClick={() => this.outlineTreeFold('fold')} style={{ color: '#1890FF' }}>
                                    <span className={`${globalStyles.authTheme}`} style={{ fontSize: 16, marginRight: 4 }}>&#xe712;</span>
                                    <span>收起全部</span>
                                </div>
                            )
                    }

                    <div>
                        {
                            !closeFeature({ board_id: gantt_board_id }) && (
                                <div style={{ color: '#1890FF' }} onClick={() => this.saveBoardTemplateVisible(true)}>
                                    <span className={`${globalStyles.authTheme}`} style={{ fontSize: 16, marginRight: 4 }}>&#xe6b5;</span>
                                    <span style={{ marginRight: 16 }}>保存为{`${currentNounPlanFilterName(PROJECTS)}`}模版</span>
                                </div>
                            )
                        }
                        {/* {
                            checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_MEMBER, gantt_board_id) &&
                            <span className={`${styles.actionIcon} ${globalStyles.authTheme}`} onClick={this.invitationJoin}>&#xe7ae;</span>
                        }

                        <Dropdown overlay={this.ganttProjectMenus()} trigger={['click']} placement={'topCenter'}>
                            <span className={`${styles.actionIcon} ${globalStyles.authTheme}`}>&#xe66f;</span>
                        </Dropdown> */}
                    </div>
                </div>
                <div onWheel={e => e.stopPropagation()}>
                    {
                        show_add_menber_visible && (
                            <ShowAddMenberModal
                                invitationType='1'
                                invitationId={gantt_board_id}
                                invitationOrg={getOrgIdByBoardId(gantt_board_id)}
                                show_wechat_invite={true}
                                _organization_id={getOrgIdByBoardId(gantt_board_id)}
                                board_id={gantt_board_id}
                                addMenbersInProject={this.addMenbersInProject}
                                modalVisible={show_add_menber_visible}
                                setShowAddMenberModalVisibile={this.setShowAddMenberModalVisibile}
                            />
                        )
                    }
                </div>
                <div onWheel={e => e.stopPropagation()}>
                    <DetailInfo setProjectDetailInfoModalVisible={this.setBoardInfoVisible} modalVisible={board_info_visible} invitationType='1' invitationId={gantt_board_id} />
                    {
                        safeConfirmModalVisible &&
                        <SafeConfirmModal selectedTpl={this.state.selectedTpl} visible={safeConfirmModalVisible} onChangeVisible={this.changeSafeConfirmModalVisible} onOk={this.onImportBoardTemplate} />
                    }
                </div>
                <>
                    <SaveBoardTemplate
                        setVisible={this.saveBoardTemplateVisible}
                        visible={this.state.save_board_template_visible}
                    />
                </>
            </div>
        );
    }

}

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({
    gantt: { datas: { gantt_board_id, group_view_type, outline_tree, outline_hover_obj, outline_tree_round, date_arr_one_level = [],
        ceilWidth,
        gantt_view_mode, selected_card_visible } },
    technological: { datas: { currentUserOrganizes = [], is_show_org_name, is_all_org, userBoardPermissions = [] } },
    projectDetail: { datas: { projectDetailInfoData = {} } },
    publicTaskDetailModal: { card_id: card_detail_id },
}) {
    return { card_detail_id, selected_card_visible, date_arr_one_level, gantt_view_mode, ceilWidth, currentUserOrganizes, is_show_org_name, is_all_org, gantt_board_id, group_view_type, projectDetailInfoData, userBoardPermissions, outline_tree, outline_hover_obj, outline_tree_round }
}

