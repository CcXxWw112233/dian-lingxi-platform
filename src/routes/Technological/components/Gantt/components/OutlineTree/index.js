import React, { Component } from 'react'
import styles from './index.less';
import { Input } from 'antd';
import globalStyles from '@/globalset/css/globalClassName.less';
import ManhourSet from './ManhourSet.js';
import { Popover } from 'antd';

class TreeNode extends Component {
    constructor(props) {
        //console.log("TreeNode", props);
        super(props);
        this.state = {
            isTitleHover: false,
            isTitleEdit: false,
            nodeValue: {
                is_expand: true,
                hover: false,
                ...props.nodeValue
            }
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
            isTitleEdit: false
        });
    }

    toggleTitleEdit = (e) => {
        // console.log("toggleTitleEdit", e);
        this.setState({
            isTitleEdit: !this.state.isTitleEdit
        });
    }

    onMouseEnter = () => {
        const { nodeValue = {} } = this.state;
        const { id } = nodeValue;
        if (id) {
            this.props.onHover(id, true);
        }
    }

    onMouseLeave = () => {
        const { nodeValue = {} } = this.state;
        const { id } = nodeValue;
        if (id) {
            this.props.onHover(id, false);
        }

    }


    onPressEnter = () => {
        this.setState({
            isTitleHover: false,
            isTitleEdit: false
        });
        const { nodeValue = {} } = this.state;

        let action;

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
    }
    onChangeTitle = (e) => {
        const { nodeValue = {} } = this.state;
        this.setState({
            nodeValue: { ...nodeValue, name: e.target.value }
        });
    }

    onManHourChange = (value) => {
        const { nodeValue = {} } = this.state;
        this.setState({
            nodeValue: { ...nodeValue, time_span: value }
        });
        
        if (this.props.onDataProcess) {
            this.props.onDataProcess({
                action,
                param: { ...nodeValue, parentId: this.props.parentId }
            });
        }
    }

    render() {
        const { isTitleHover, isTitleEdit, nodeValue = {} } = this.state;
        const { id, name: title, tree_type, is_expand, time_span } = nodeValue;
        const { onDataProcess, onExpand, onHover, key, leve = 0, icon, placeholder, label, hoverItem = {} } = this.props;
        let type;
        if (tree_type) {
            type = tree_type;
        } else {
            type = this.props.type;
        }

        if (this.props.children && this.props.children.length > 0) {

            let className = `${styles.outline_tree_node} ${styles[`leve_${leve}`]} ${isLeaf ? (is_expand ? styles.expanded : '') : ''} `;
            let isLeaf = false;
            return (
                <div className={className} key={key}>
                    <div className={`${styles.outline_tree_node_content} ${hoverItem.id && hoverItem.id == id ? styles.hover : ''}`} style={{ paddingLeft: (leve * 23) + 'px' }} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                        <span className={`${styles.outline_tree_line_node_dot} ${type == '1' ? styles.milestoneNode : styles.taskNode}`}></span>
                        {
                            !isLeaf &&
                            <span className={`${styles.outline_tree_node_expand_icon} ${is_expand ? styles.expanded : ''}`} onClick={this.onChangeExpand}></span>
                        }
                        <span className={`${styles.outline_tree_node_label} ${isTitleHover ? styles.hoverTitle : ''}`}>
                            {/*<span><span>确定</span><span>取消</span></span> */}
                            <span className={`${styles.title}`} onMouseEnter={this.onMouseEnterTitle} onMouseLeave={this.onMouseLeaveTitle}>
                                {
                                    isTitleHover || isTitleEdit ?
                                        <Input value={title}
                                            style={{ width: '100%' }}
                                            onChange={this.onChangeTitle}
                                            placeholder={placeholder ? placeholder :'请填写任务名称'}
                                            className={`${isTitleEdit ? styles.titleInputFocus : styles.titleInputHover}`}
                                            onFocus={this.toggleTitleEdit}
                                            onBlur={this.toggleTitleEdit}
                                            addonAfter={isTitleEdit ? null : null}
                                            onPressEnter={this.onPressEnter} />
                                        :
                                        (placeholder ? label : (title?title:'未填写任务名称'))
                                }
                            </span>

                            <span className={`${styles.editIcon} ${globalStyles.authTheme}`}>&#xe7b2;</span>

                            <Popover placement="bottom" content={<ManhourSet onChange={this.onManHourSet} />} title={<div style={{ textAlign: 'center', height: '36px', lineHeight: '36px', fontWeight: '600' }}>花费时间</div>} trigger="click">
                                <span className={`${styles.editIcon} ${globalStyles.authTheme}`}>&#xe6d9;</span>
                            </Popover>
                        </span>

                    </div>
                    <div className={styles.collapse_transition} data-old-padding-top="0px" data-old-padding-bottom="0px" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: is_expand ? 'block' : 'none' }}>
                        <div className={styles.outline_tree_node_children}>
                            {
                                React.Children.map(this.props.children, (child, i) => {
                                    // console.log("child.props", child.props);
                                    //child.props['leve'] = leve + 1;
                                    if (child && child.props && child.props.children && child.props.children.length > 0) {
                                        return (
                                            <TreeNode {...child.props} leve={leve + 1} isLeaf={false} onDataProcess={onDataProcess} onExpand={onExpand} onHover={onHover} parentId={id} hoverItem={hoverItem}>
                                                {child.props.children}
                                            </TreeNode>
                                        );
                                    } else {
                                        return (
                                            <TreeNode {...child.props} leve={leve + 1} isLeaf={true} onDataProcess={onDataProcess} onExpand={onExpand} onHover={onHover} parentId={id} hoverItem={hoverItem} />
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
                <div className={className} key={key}>
                    <div className={`${styles.outline_tree_node_content} ${hoverItem.id && hoverItem.id == id ? styles.hover : ''}`} style={{ paddingLeft: (leve * 23) + 'px' }} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                        {
                            icon ?
                                icon
                                :
                                <span className={`${styles.outline_tree_line_node_dot} ${type == '1' ? styles.milestoneNode : styles.taskNode}`}></span>
                        }
                        {
                            !isLeaf &&
                            <span className={`${styles.outline_tree_node_expand_icon} ${is_expand ? styles.expanded : ''}`}></span>
                        }
                        <span className={`${styles.outline_tree_node_label} ${isTitleHover ? styles.hoverTitle : ''}`}>
                            {/*<span><span>确定</span><span>取消</span></span> */}
                            <span className={`${styles.title}`} onMouseEnter={this.onMouseEnterTitle} onMouseLeave={this.onMouseLeaveTitle}>
                                {
                                    isTitleHover || isTitleEdit ?
                                        <span className={`${styles.title}`}>
                                            <Input value={title}
                                                style={{ width: '100%' }}
                                                onChange={this.onChangeTitle}
                                                placeholder={placeholder ? placeholder :'请填写任务名称'}
                                                className={`${isTitleEdit ? styles.titleInputFocus : styles.titleInputHover}`}
                                                onFocus={this.toggleTitleEdit}
                                                onBlur={this.toggleTitleEdit}
                                                addonAfter={isTitleEdit ? null : null}
                                                onPressEnter={this.onPressEnter} />
                                        </span>
                                        :
                                        (placeholder ? label : (title?title:'未填写任务名称'))
                                }
                            </span>
                            {
                                tree_type &&
                                <>
                                    <span className={`${styles.editIcon} ${globalStyles.authTheme}`}>&#xe7b2;</span>
                                    {
                                        time_span ?
                                            <span className={`${styles.editIcon}`}>{time_span}天</span>
                                            :
                                            <span className={`${styles.editIcon} ${globalStyles.authTheme}`}>&#xe6d9;</span>
                                    }

                                </>
                            }

                        </span>
                    </div>
                </div>
            );
        }
    }
}

class MyOutlineTree extends Component {
    render() {
        const { onDataProcess, onExpand, onHover, hoverItem } = this.props;

        return (
            <div className={styles.outline_tree}>
                {
                    React.Children.map(this.props.children, (child, i) => {
                        return (
                            <TreeNode {...child.props} onDataProcess={onDataProcess} onExpand={onExpand} onHover={onHover} hoverItem={hoverItem}>
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



const OutlineTree = MyOutlineTree;
//树节点
OutlineTree.TreeNode = TreeNode;
//树方法
OutlineTree.getTreeNodeValue = getTreeNodeValue;

export default OutlineTree;