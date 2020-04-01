import React, { Component } from 'react';
import { connect } from 'dva';
import { message, Menu, Dropdown, Modal, Button } from 'antd';
import styles from './index.less';
import globalStyles from '@/globalset/css/globalClassName.less';
import OutlineTree from './components/OutlineTree';
import {
    addTaskInWorkbench,
    updateTask,
    changeTaskType,
    updateMilestone,
    addMilestoneExcutos,
    removeMilestoneExcutos,
    addTaskExecutor,
    removeTaskExecutor
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

const { SubMenu } = Menu;
const { TreeNode } = OutlineTree;
const { confirm } = Modal;

@connect(mapStateToProps)
export default class OutLineHeadItem extends Component {
    state = {
        template_list: [],
        board_info_visible: false,
        show_add_menber_visible: false,
        safeConfirmModalVisible: false,
        selectedTpl: null,

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

        }
        dispatch({
            type: 'gantt/updateDatas',
            payload: {
                outline_hover_obj: nodeValue
            }
        });
        this.updateOutLineTreeData(outline_tree);

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
    onDataProcess = ({ action, param }) => {
        //console.log("大纲:onDataProcess", action, param);
        const { dispatch, gantt_board_id, } = this.props;
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
                                    children: []
                                };

                                outline_tree.push(addNodeValue);
                                //this.setCreateAfterInputFous(null,outline_tree);
                                this.updateOutLineTreeData(outline_tree);

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

                                let children = nodeValue.children || [];
                                if (children.length > 0) {
                                    const index = children.findIndex((item) => item.tree_type == '0');
                                    children.splice(index, 0, addNodeValue);
                                } else {
                                    children.push(addNodeValue);
                                }

                                nodeValue.children = children;
                                this.setCreateAfterInputFous(paraseNodeValue, outline_tree);


                                //当前的添加按钮
                                let addInputNodeValue = OutlineTree.getTreeAddNodeValue(outline_tree, param.add_id);
                                addInputNodeValue.start_time = null;
                                addInputNodeValue.due_time = null;
                                addInputNodeValue.time_span = 1;
                                addInputNodeValue.name = '';
                                addInputNodeValue.editing = false;
                                this.updateOutLineTreeData(outline_tree);
                            } else {

                                message.error(res.message)
                            }
                        }).catch(err => {
                            console.error(err);

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
                    updateTask({ ...updateParams }, { isNotLoading: false })
                        .then(res => {
                            if (isApiResponseOk(res)) {
                                let nodeValue = OutlineTree.getTreeNodeValue(outline_tree, param.id);
                                if (nodeValue) {

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
                    });
                }
                break;
            case 'onBlur': {
                let nodeValue = OutlineTree.getTreeAddNodeValue(outline_tree, param.add_id);
                if (nodeValue) {

                    // nodeValue.name = param.name;
                    nodeValue.editing = false;
                    nodeValue.time_span = 0;
                    nodeValue.start_time = null;
                    nodeValue.due_time = null;

                    this.updateOutLineTreeData(outline_tree);
                } else {
                    console.error("OutlineTree.getTreeNodeValue:未查询到节点");
                }
            }
            default:
                ;

        }
    }

    setCreateAfterInputFous = (paraseNodeValue, outline_tree = []) => {
        let placeholder = null;
        if (paraseNodeValue) {
            placeholder = paraseNodeValue.children.find((item) => item.tree_type == '0');

        } else {
            placeholder = outline_tree.children.find((item) => item.tree_type == '0');
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
                        <TreeNode key={index} nodeValue={item} level={level}>
                            {this.renderGanttOutLineTree(item.children, level + 1, item)}
                        </TreeNode>
                    );
                } else {
                    if (item.tree_type == 0) {
                        return (
                            <TreeNode
                                level={level}
                                nodeValue={item}
                                type={'2'}
                                placeholder={parentNode && parentNode.tree_type == '2' ? '新建子任务' : '新建任务'}
                                icon={<span className={`${styles.addTaskNode} ${globalStyles.authTheme}`}  >&#xe8fe;</span>}
                                label={<span className={styles.addTask}>{parentNode && parentNode.tree_type == '2' ? '新建子任务' : '新建任务'}</span>} key={`addTask_${item.index}`}>
                            </TreeNode>
                        );
                    } else {
                        return (<TreeNode key={index} nodeValue={item} level={level}></TreeNode>);
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
        recusionCheck(outline_tree)
        return flag
    }

    render() {
        const { board_info_visible, show_add_menber_visible, safeConfirmModalVisible } = this.state;
        const { outline_tree, outline_hover_obj, gantt_board_id, projectDetailInfoData, outline_tree_round } = this.props;
        //console.log("刷新了数据", outline_tree);
        console.log("刷新了数据", checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_MEMBER, gantt_board_id));
        return (
            <div className={styles.outline_wrapper}>

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
                >
                    {this.renderGanttOutLineTree(outline_tree, 0)}
                    <TreeNode
                        type={'1'}
                        placeholder={'新建里程碑'}
                        nodeValue={{ add_id: 'add_milestone', 'tree_type': '0' }}
                        icon={<span className={`${styles.addMilestoneNode} ${globalStyles.authTheme}`}  >&#xe8fe;</span>}
                        label={<span className={styles.addMilestone}>新建里程碑</span>} key="addMilestone">
                    </TreeNode>

                </OutlineTree>

                <div className={styles.outlineFooter}>
                    {
                        !this.isExistExpand() ? (
                            <div onClick={() => this.outlineTreeFold('expand')}>展开全部</div>
                        ) : (
                                <div onClick={() => this.outlineTreeFold('fold')}>收起全部</div>
                            )
                    }

                    <div>
                        {
                            checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_MEMBER, gantt_board_id) &&
                            <span className={`${styles.actionIcon} ${globalStyles.authTheme}`} onClick={this.invitationJoin}>&#xe7ae;</span>
                        }

                        <Dropdown overlay={this.ganttProjectMenus()} trigger={['click']} placement={'topCenter'}>
                            <span className={`${styles.actionIcon} ${globalStyles.authTheme}`}>&#xe66f;</span>
                        </Dropdown>
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
            </div>
        );
    }

}

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({
    gantt: { datas: { gantt_board_id, group_view_type, outline_tree, outline_hover_obj, outline_tree_round } },
    technological: { datas: { currentUserOrganizes = [], is_show_org_name, is_all_org, userBoardPermissions = [] } },
    projectDetail: { datas: { projectDetailInfoData = {} } }
}) {
    return { currentUserOrganizes, is_show_org_name, is_all_org, gantt_board_id, group_view_type, projectDetailInfoData, userBoardPermissions, outline_tree, outline_hover_obj, outline_tree_round }
}

