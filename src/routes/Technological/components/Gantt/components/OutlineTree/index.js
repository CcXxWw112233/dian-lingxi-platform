import React, { Component } from 'react'
import styles from './index.less';
import { Input, Dropdown, message, Tooltip, Menu } from 'antd';
import globalStyles from '@/globalset/css/globalClassName.less';
import ManhourSet from './ManhourSet.js';
import { Popover, Avatar } from 'antd';
import MenuSearchPartner from '@/components/MenuSearchMultiple/MenuSearchPartner.js'
import { getOrgIdByBoardId } from '@/utils/businessFunction';
import moment from 'moment';
import AvatarList from '@/components/avatarList'
import NodeOperate from './NodeOperate'
class TreeNode extends Component {
    constructor(props) {
        //console.log("TreeNode", props);
        super(props);
        this.state = {
            isTitleHover: false,
            isTitleEdit: false,
            nodeValue: {
                is_focus: false,
                is_expand: true,
                hover: false,
                ...props.nodeValue
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            nodeValue: nextProps.nodeValue
        });
    }



    isShowSetTimeSpan = (nodeValue) => {
        if (nodeValue.tree_type == '2') {
            return true;
        } else {
            return false;

        }

    }



    onChangeExpand = (e) => {
        e.stopPropagation();
        const { nodeValue = {} } = this.state;
        let { id, is_expand } = nodeValue;
        is_expand = !is_expand;
        this.setState({
            nodeValue: { ...nodeValue, is_expand }
        });
        this.props.onExpand(id, is_expand);
    }

    onMouseEnterTitle = () => {
        this.setState({
            isTitleHover: true
        });
    }

    onMouseLeaveTitle = () => {
        this.setState({
            isTitleHover: false,
            //isTitleEdit: false
        });
    }

    toggleTitleEdit = (e) => {
        // console.log("toggleTitleEdit", e);
        this.setState({
            isTitleEdit: !this.state.isTitleEdit,
        });
        const { nodeValue = {} } = this.state;
        const { id } = nodeValue;
        this.props.onHover(id, false, this.props.parentId);
    }

    onMouseEnter = () => {
        const { nodeValue = {} } = this.state;
        const { id, add_id } = nodeValue;
        this.props.onHover(id || add_id, true, this.props.parentId, add_id ? true : false);
    }

    onMouseLeave = () => {
        const { nodeValue = {} } = this.state;
        const { id, add_id } = nodeValue;
        this.props.onHover(id || add_id, false, this.props.parentId, add_id ? true : false);

    }


    onPressEnter = (e) => {

        let { nodeValue = {} } = this.state;
        nodeValue.name = e.target.value;

        if (nodeValue.name) {
            let action;
            nodeValue.editing = false;
            if (this.props.placeholder) {
                action = 'add_' + (this.props.type == '1' ? 'milestone' : 'task');
            } else {
                action = 'edit_' + (nodeValue.tree_type == '1' ? 'milestone' : 'task');
            }

            if (this.props.onDataProcess) {
                this.props.onDataProcess({
                    action,
                    param: { ...nodeValue, parentId: this.props.parentId }
                });
            }
            //清空
            if (action.indexOf('add') != -1) {
                this.setState({
                    nodeValue: {}
                });
            }
        } else {
            message.warn('标题不能为空');
            nodeValue.name = (this.props.nodeValue || {}).name || '';

            if (nodeValue.editing) {
                if (this.props.onDataProcess) {
                    this.props.onDataProcess({
                        action: 'onBlur',
                        param: { ...nodeValue, parentId: this.props.parentId }
                    });
                }

            }

            this.setState({
                nodeValue
            });
        }

        this.setState({
            isTitleHover: false,
            isTitleEdit: false
        });

    }
    onChangeTitle = (e) => {
        const { nodeValue = {} } = this.state;
        this.setState({
            nodeValue: { ...nodeValue, name: e.target.value }
        });
    }

    onManHourChange = (value) => {
        const { outline_tree_round = [] } = this.props;
        const { nodeValue = {} } = this.state;
        if (value > 999) {
            message.warn('设置天数最大支持999天');
            return;
        }
        const newNodeValue = { ...nodeValue, time_span: value };
        if (newNodeValue.is_has_start_time && newNodeValue.is_has_end_time) {
            //开始时间不变，截至时间后移
            newNodeValue.due_time = moment(newNodeValue.start_time).add(value - 1, 'days').hour(23).minute(59).second(59).valueOf();

        } else {
            if (newNodeValue.is_has_start_time) {
                newNodeValue.due_time = moment(newNodeValue.start_time).add(value - 1, 'days').hour(23).minute(59).second(59).valueOf();
            }
            if (newNodeValue.is_has_end_time) {
                newNodeValue.start_time = moment(newNodeValue.start_time).add(value - 1, 'days').hour(0).minute(0).second(0).valueOf();
            }
        }

        this.setState({
            nodeValue: newNodeValue
        });
        let action = 'edit_' + (newNodeValue.tree_type == '1' ? 'milestone' : 'task');
        //console.log("onManHourChange", value, action);
        if (this.props.onDataProcess) {
            this.props.onDataProcess({
                action,
                param: { ...newNodeValue, parentId: this.props.parentId }
            });
        }


    }



    onExecutorTaskChargeChange = (data) => {
        let { nodeValue = {} } = this.state;
        //{selectedKeys: Array(1), key: "1194507125745913856", type: "add"}
        const { selectedKeys, key, type } = data;

        let action = type + '_executor';

        if (!nodeValue.executors) {
            nodeValue.executors = [];
        }
        if (type == 'add') {
            //nodeValue.executors.push(key);
        }
        if (type == 'remove') {
            //nodeValue.executors.splice(nodeValue.executors.findIndex((item) => item.id == key));
        }
        this.setState({
            nodeValue
        });

        // console.log("kkkknodeValue",nodeValue);
        if (this.props.onDataProcess) {
            this.props.onDataProcess({
                action,
                param: { id: nodeValue.id, user_id: key, tree_type: nodeValue.tree_type, parentId: this.props.parentId }
            });
        }
    }

    inviteOthersToBoardCalback = ({ users }) => {
        const { dispatch, gantt_board_id } = this.props
        const action = 'reloadProjectDetailInfo';
        if (this.props.onDataProcess) {
            this.props.onDataProcess({
                action,
                calback: ({ user_data }) => this.inviteOthersToBoardCalbackFn({ user_data, users })
            });
        }
    }
    inviteOthersToBoardCalbackFn = ({ user_data = [], users }) => { //遍历找到user,将执行人添加到树
        const { nodeValue = {} } = this.state
        const { start_time, due_time, id, executors } = nodeValue
        let add_executors = users.map(item => user_data.find(item2 => item2.user_id == item))
        add_executors = add_executors.filter(item => item.user_id)
        this.props.changeOutLineTreeNodeProto(id, {
            start_time, due_time, executors: [].concat(executors, add_executors)
        })

    }


    renderExecutor = (members = [], { user_id }) => {

        const currExecutor = members.find((item) => item.user_id == user_id);
        if (currExecutor && currExecutor.avatar) {
            return (<span><Avatar size={20} src={currExecutor.avatar} /></span>);
        } else if (currExecutor) {
            return (<span><Avatar size={20} >{currExecutor.name}</Avatar></span>);
        }
        return (<span className={`${styles.editIcon}`}>&#xe7b2;</span>);
    }

    renderTitle = () => {
        const { isTitleHover, isTitleEdit, nodeValue = {} } = this.state;
        const { id, name: title, tree_type, is_expand, time_span, executors = [], is_focus, editing } = nodeValue;
        const { onDataProcess, onExpand, onHover, key, leve = 0, icon, placeholder, label, hoverItem = {}, gantt_board_id, projectDetailInfoData = {} } = this.props;
        let type;
        if (tree_type) {
            type = tree_type;
        } else {
            type = this.props.type;
        }

        //console.log("isTitleHover || isTitleEdit", isTitleHover, isTitleEdit);


        return (
            <span className={`${styles.outline_tree_node_label} ${isTitleHover ? styles.hoverTitle : ''}`}>
                {/*<span><span>确定</span><span>取消</span></span> */}
                <Tooltip mouseEnterDelay={0.5} mouseLeaveDelay={0} placement="top" title={title != '0' ? title : ''}>
                    <span className={`${styles.title}`} onMouseEnter={this.onMouseEnterTitle} onMouseLeave={this.onMouseLeaveTitle}>

                        {
                            editing || (isTitleHover || isTitleEdit) ?
                                <Input defaultValue={title != '0' ? title : ''}
                                    autoFocus={editing ? true : false}
                                    style={{ width: '100%' }}
                                    onChange={this.onChangeTitle}
                                    placeholder={placeholder ? placeholder : '请填写任务名称'}
                                    className={`${isTitleEdit ? styles.titleInputFocus : styles.titleInputHover}`}
                                    onFocus={this.toggleTitleEdit}
                                    onBlur={this.onPressEnter}
                                    // addonAfter={isTitleEdit ? null : null}
                                    onPressEnter={this.onPressEnter} />
                                :
                                (placeholder ? label : (title ? title : '未填写任务名称'))
                        }

                    </span>
                </Tooltip>
                {/* <span className={`${styles.editIcon} ${globalStyles.authTheme}`}>&#xe7b2;</span>


                    <span className={`${styles.editIcon} ${globalStyles.authTheme}`}>&#xe6d9;</span> */}


                {
                    tree_type != '0' &&
                    <div onWheel={e => e.stopPropagation()}>
                        <Dropdown
                            overlayClassName={styles.selectExecutors}
                            overlay={
                                <MenuSearchPartner
                                    // isInvitation={true}
                                    inviteOthersToBoardCalback={this.inviteOthersToBoardCalback}

                                    invitationType={tree_type == '1' ? '13' : '4'}
                                    invitationId={nodeValue.id}
                                    invitationOrg={getOrgIdByBoardId(gantt_board_id)}
                                    listData={projectDetailInfoData.data}
                                    keyCode={'user_id'}
                                    searchName={'name'}
                                    currentSelect={executors}

                                    chirldrenTaskChargeChange={this.onExecutorTaskChargeChange}
                                    board_id={gantt_board_id} />
                            }
                        >
                            {
                                executors && executors.length > 0 ?
                                    (
                                        <div style={{ display: 'inline-block', verticalAlign: 'text-bottom' }}>
                                            <AvatarList users={executors} size={20} />
                                        </div>
                                    )
                                    // <span className={`${styles.editIcon} ${globalStyles.authTheme}`}>
                                    //     {
                                    //         this.renderExecutor(projectDetailInfoData.data, executors[0])

                                    //     }
                                    // </span>
                                    :
                                    <span className={`${styles.editIcon} ${globalStyles.authTheme}`}>&#xe7b2;</span>
                            }

                        </Dropdown>
                        {
                            this.isShowSetTimeSpan(nodeValue) &&
                            <Popover placement="bottom" content={<ManhourSet onChange={this.onManHourChange} value={time_span} />} title={<div style={{ textAlign: 'center', height: '36px', lineHeight: '36px', fontWeight: '600' }}>花费时间</div>} trigger="click">
                                {
                                    time_span ?
                                        <span className={`${styles.editTitle}`}>{time_span}天</span>
                                        :
                                        <span className={`${styles.editIcon} ${globalStyles.authTheme}`}>&#xe6d9;</span>
                                }
                            </Popover>
                        }

                    </div>
                }

            </span>
        );
    }

    // 操作项点击------start
    operateVisibleChange = (bool) => {
        this.setState({
            operateVisible: bool
        })
    }
    // 操作项点击------end

    render() {
        const { isTitleHover, isTitleEdit, nodeValue = {}, operateVisible } = this.state;
        const { id, add_id, name: title, tree_type, is_expand, time_span } = nodeValue;
        const { changeOutLineTreeNodeProto, onDataProcess, onExpand, onHover, key, leve = 0, icon, placeholder, label, hoverItem = {}, gantt_board_id, projectDetailInfoData = {}, outline_tree_round = [] } = this.props;
        let type;
        if (tree_type) {
            type = tree_type;
        } else {
            type = this.props.type;
        }
        //console.log("更新节点", nodeValue);
        const menu = <NodeOperate node_id={id} setVisble={this.operateVisibleChange} />
        if (this.props.children && this.props.children.length > 0) {

            let className = `${styles.outline_tree_node} ${styles[`leve_${leve}`]} ${isLeaf ? (is_expand ? styles.expanded : '') : ''} `;
            let isLeaf = false;
            return (
                <div className={className} key={id}>
                    <div className={`${styles.outline_tree_node_content} ${((hoverItem.id && hoverItem.id == id) || (hoverItem.add_id && hoverItem.add_id == add_id)) ? styles.hover : ''}`} style={{ paddingLeft: (leve * 23) + 'px' }} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                        {
                            (hoverItem.id && hoverItem.id == id) || (hoverItem.add_id && hoverItem.add_id == add_id || operateVisible) ? (
                                <Dropdown overlay={menu}
                                    visible={operateVisible}
                                    trigger={['click']} onVisibleChange={this.operateVisibleChange}>
                                    <div className={`${styles.node_opeator} ${globalStyles.authTheme}`}>&#xe7fd;</div>
                                </Dropdown>
                            ) : (
                                    <span className={`${styles.outline_tree_line_node_dot} ${type == '1' ? styles.milestoneNode : styles.taskNode}`}></span>
                                )
                        }
                        {
                            !isLeaf &&
                            <span className={`${styles.outline_tree_node_expand_icon_out}`} onClick={this.onChangeExpand}>
                                <span className={`${styles.outline_tree_node_expand_icon} ${is_expand ? styles.expanded : ''}`} ></span>
                            </span>
                        }
                        {this.renderTitle()}

                    </div>
                    <div className={styles.collapse_transition} data-old-padding-top="0px" data-old-padding-bottom="0px" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: is_expand ? 'block' : 'none' }}>
                        <div className={styles.outline_tree_node_children}>
                            {
                                React.Children.map(this.props.children, (child, i) => {
                                    // console.log("child.props", child.props);
                                    //child.props['leve'] = leve + 1;
                                    if (child && child.props && child.props.children && child.props.children.length > 0) {
                                        return (
                                            <TreeNode {...child.props}
                                                changeOutLineTreeNodeProto={changeOutLineTreeNodeProto}
                                                leve={leve + 1} isLeaf={false} onDataProcess={onDataProcess} onExpand={onExpand} onHover={onHover} parentId={id} hoverItem={hoverItem} gantt_board_id={gantt_board_id} projectDetailInfoData={projectDetailInfoData} outline_tree_round={outline_tree_round}>
                                                {child.props.children}
                                            </TreeNode>
                                        );
                                    } else {
                                        return (
                                            <TreeNode {...child.props}
                                                changeOutLineTreeNodeProto={changeOutLineTreeNodeProto}
                                                leve={leve + 1} isLeaf={true} onDataProcess={onDataProcess} onExpand={onExpand} onHover={onHover} parentId={id} hoverItem={hoverItem} gantt_board_id={gantt_board_id} projectDetailInfoData={projectDetailInfoData} outline_tree_round={outline_tree_round} />
                                        );
                                    }
                                })
                            }

                        </div>
                    </div>
                </div>
            );

        } else {
            let className = `${styles.outline_tree_node} ${styles[`leve_${leve}`]} ${isLeaf ? (is_expand ? styles.expanded : '') : ''} `;
            let isLeaf = true;
            return (
                <div className={className} key={id}>
                    <div className={`${styles.outline_tree_node_content} ${((hoverItem.id && hoverItem.id == id) || (hoverItem.add_id && hoverItem.add_id == add_id)) ? styles.hover : ''}`} style={{ paddingLeft: (leve * 23) + 'px' }} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                        {
                            icon ?
                                icon
                                : (
                                    (hoverItem.id && hoverItem.id == id) || (hoverItem.add_id && hoverItem.add_id == add_id) ? (
                                        <div className={`${styles.node_opeator} ${globalStyles.authTheme}`}>&#xe7fd;</div>
                                    ) : (
                                            <span className={`${styles.outline_tree_line_node_dot} ${type == '1' ? styles.milestoneNode : styles.taskNode}`}></span>
                                        )
                                )
                            // <span className={`${styles.outline_tree_line_node_dot} ${type == '1' ? styles.milestoneNode : styles.taskNode}`}></span>
                        }
                        {
                            !isLeaf &&
                            <span className={`${styles.outline_tree_node_expand_icon_out}`}>
                                <span className={`${styles.outline_tree_node_expand_icon} ${is_expand ? styles.expanded : ''}`}></span>
                            </span>
                        }

                        {this.renderTitle()}
                    </div>
                </div>
            );
        }
    }
}

class MyOutlineTree extends Component {
    render() {
        const { onDataProcess, onExpand, onHover, hoverItem, gantt_board_id, projectDetailInfoData, outline_tree_round, changeOutLineTreeNodeProto } = this.props;

        return (
            <div className={styles.outline_tree}>
                {
                    React.Children.map(this.props.children, (child, i) => {
                        return (
                            <TreeNode {...child.props}
                                changeOutLineTreeNodeProto={changeOutLineTreeNodeProto}
                                onDataProcess={onDataProcess} onExpand={onExpand} onHover={onHover} hoverItem={hoverItem} gantt_board_id={gantt_board_id} projectDetailInfoData={projectDetailInfoData} outline_tree_round={outline_tree_round}>
                                {child.props.children}
                            </TreeNode>
                        );
                    })
                }
            </div>
        );
    }
}

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
                    return null;
                }
            }
        }
    }
    return nodeValue
}

const getNodeByname = (outline_tree, key, value) => {
    let nodeValue = null;
    if (outline_tree) {
        nodeValue = outline_tree.find((item) => item[key] == value);
        if (nodeValue) {
            return nodeValue;
        } else {
            let length = outline_tree.length
            for (let i = 0; i < length; i++) {
                let node = outline_tree[i];
                if (node.children && node.children.length > 0) {
                    nodeValue = getNodeByname(node.children, key, value);
                    if (nodeValue) {
                        return nodeValue;
                    }
                } else {
                    return null;
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
                    return null;
                }
            }
        }
    } else {
        return null;
    }

}

const getAddNode = (outline_tree, add_id) => {
    let nodeValue = null;
    if (outline_tree) {
        nodeValue = outline_tree.find((item) => item.add_id == add_id);
        if (nodeValue) {
            return nodeValue;
        } else {
            for (let i = 0; i < outline_tree.length; i++) {
                let node = outline_tree[i];
                if (node.children && node.children.length > 0) {
                    nodeValue = getAddNode(node.children, add_id);
                    if (nodeValue) {
                        return nodeValue;
                    }
                } else {
                    return null;
                }
            }
        }
    }
    return nodeValue
}


const getTreeAddNodeValue = (outline_tree, add_id) => {
    if (outline_tree) {
        for (let i = 0; i < outline_tree.length; i++) {
            let node = outline_tree[i];
            if (node.add_id == add_id) {
                return node;
            } else {
                if (node.children && node.children.length > 0) {
                    let childNode = getAddNode(node.children, add_id);
                    if (childNode) {
                        return childNode;
                    }
                } else {
                    return null;
                }
            }
        }
    } else {
        return null;
    }

}

// 过滤掉指定的树节点(删除树节点)
const filterTreeNode = (tree, id) => {
    if (!(tree instanceof Array)) {
        return tree
    }
    const length = tree.length
    for (let i = 0; i < length; i++) {
        let el = tree[i]
        if (el.id == id) {
            tree.splice(i, 1)
            break
        } else {
            if (el.children && el.children.length) {
                filterTreeNode(el.children, id)
            }
        }
    }
    return tree
}

const getTreeNodeValueByName = (outline_tree, key, value) => {
    if (outline_tree) {
        let length = outline_tree.length
        for (let i = 0; i < length; i++) {
            let node = outline_tree[i];
            if (node[key] == value) {
                return node;
            } else {
                if (node.children && node.children.length > 0) {
                    let childNode = getNodeByname(node.children, key, value);
                    if (childNode) {
                        return childNode;
                    }
                } else {
                    return null;
                }
            }
        }
    } else {
        return null;
    }
}

const OutlineTree = MyOutlineTree;
//树节点
OutlineTree.TreeNode = TreeNode;
//树方法
OutlineTree.getTreeNodeValue = getTreeNodeValue;
OutlineTree.getTreeAddNodeValue = getTreeAddNodeValue;
OutlineTree.filterTreeNode = filterTreeNode
OutlineTree.getTreeNodeValueByName = getTreeNodeValueByName
export default OutlineTree;
