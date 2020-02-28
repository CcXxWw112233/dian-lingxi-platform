import React, { Component } from 'react'
import styles from './index.less';
import { Input } from 'antd';
import globalStyles from '@/globalset/css/globalClassName.less';

class TreeNode extends Component {
    constructor(props) {
        //console.log("TreeNode", props);
        super(props);
        this.state = {
            isTitleHover: false,
            isTitleEdit: false,
            nodeValue: {
                open: true,
                hover: false,
                ...props.nodeValue
            }
        }
    }

    onChangeExpand = (e) => {
        e.stopPropagation();
        const { nodeValue = {} } = this.state;
        let { id, open } = nodeValue;
        open = !open;
        this.setState({
            nodeValue: { ...nodeValue, open }
        });
        this.props.onExpand(id, open);
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
        if (this.state.placeholder) {
            action = 'add_' + this.props.type;
        } else {
            action = 'edit_' + nodeValue.tree_type == '1' ? 'milestone' : 'task';
        }

        this.props.onDataProcess &&
            this.props.onDataProcess({
                action,
                param: { ...nodeValue }
            });
    }
    onChangeTitle = (e) => {
        this.setState({
            title: e.target.value
        });
    }



    render() {
        const { isTitleHover, isTitleEdit, nodeValue = {} } = this.state;
        const { id, name: title, tree_type } = nodeValue;
        const { onDataProcess, onExpand, onHover, key, leve = 0, open = true, icon, placeholder, label } = this.props;
        let type;
        if (tree_type) {
            type = tree_type;
        } else {
            type = this.props.type;
        }

        console.log("openopenopenopen", this.props.children);
        if (this.props.children && this.props.children.length > 0) {

            let className = `${styles.outline_tree_node} ${styles[`leve_${leve}`]} ${isLeaf ? (open ? styles.expanded : '') : ''} `;
            let isLeaf = false;
            return (
                <div className={className} key={key}>
                    <div className={`${styles.outline_tree_node_content}`} style={{ paddingLeft: (leve * 23) + 'px' }}>
                        <span className={`${styles.outline_tree_line_node_dot} ${type == '1' ? styles.milestoneNode : styles.taskNode}`}></span>
                        {
                            !isLeaf &&
                            <span className={`${styles.outline_tree_node_expand_icon} ${open ? styles.expanded : ''}`} onClick={this.onChangeExpand}></span>
                        }
                        <span className={`${styles.outline_tree_node_label} ${isTitleHover ? styles.hoverTitle : ''}`}>
                            {/*<span><span>确定</span><span>取消</span></span> */}
                            <span className={`${styles.title}`} onMouseEnter={this.onMouseEnterTitle} onMouseLeave={this.onMouseLeaveTitle}>
                                {
                                    isTitleHover || isTitleEdit ?
                                        <Input value={title}
                                            style={{ width: '100%' }}
                                            onChange={this.onChangeTitle}
                                            className={`${isTitleEdit ? styles.titleInputFocus : styles.titleInputHover}`}
                                            onFocus={this.toggleTitleEdit}
                                            onBlur={this.toggleTitleEdit}
                                            addonAfter={isTitleEdit ? null : null}
                                            onPressEnter={this.onPressEnter} />
                                        :
                                        title
                                }
                            </span>
                            <span className={`${styles.editIcon} ${globalStyles.authTheme}`}>&#xe7b2;</span>
                            <span className={`${styles.editIcon} ${globalStyles.authTheme}`}>&#xe6d9;</span>

                        </span>

                    </div>
                    <div className={styles.collapse_transition} data-old-padding-top="0px" data-old-padding-bottom="0px" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: open ? 'block' : 'none' }}>
                        <div className={styles.outline_tree_node_children}>
                            {
                                React.Children.map(this.props.children, (child, i) => {
                                    // console.log("child.props", child.props);
                                    //child.props['leve'] = leve + 1;
                                    if (child.props.children && child.props.children.length > 0) {
                                        return (
                                            <TreeNode {...child.props} leve={leve + 1} isLeaf={false} onDataProcess={onDataProcess} onExpand={onExpand} onHover={onHover} parentId={id}>
                                                {child.props.children}
                                            </TreeNode>
                                        );
                                    } else {
                                        return (
                                            <TreeNode {...child.props} leve={leve + 1} isLeaf={true} onDataProcess={onDataProcess} onExpand={onExpand} onHover={onHover} parentId={id} />
                                        );
                                    }
                                })
                            }

                        </div>
                    </div>
                </div>
            );

        } else {
            let className = `${styles.outline_tree_node} ${styles[`leve_${leve}`]} ${isLeaf ? (open ? styles.expanded : '') : ''} `;
            let isLeaf = true;
            return (
                <div className={className} key={key}>
                    <div className={`${styles.outline_tree_node_content}`} style={{ paddingLeft: (leve * 23) + 'px' }} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                        {
                            icon ?
                                icon
                                :
                                <span className={`${styles.outline_tree_line_node_dot} ${type == '1' ? styles.milestoneNode : styles.taskNode}`}></span>
                        }

                        {
                            !isLeaf &&
                            <span className={`${styles.outline_tree_node_expand_icon} ${open ? styles.expanded : ''}`}></span>
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
                                                placeholder={placeholder ? placeholder : ''}
                                                className={`${isTitleEdit ? styles.titleInputFocus : styles.titleInputHover}`}
                                                onFocus={this.toggleTitleEdit}
                                                onBlur={this.toggleTitleEdit}
                                                addonAfter={isTitleEdit ? null : null}
                                                onPressEnter={this.onPressEnter} />
                                        </span>
                                        :
                                        (placeholder ? label : title)
                                }
                            </span>
                            <span className={`${styles.editIcon} ${globalStyles.authTheme}`}>&#xe7b2;</span>
                            <span className={`${styles.editIcon} ${globalStyles.authTheme}`}>&#xe6d9;</span>
                        </span>

                    </div>
                </div>
            );
        }
    }
}

class MyOutlineTree extends Component {
    render() {
        const { onDataProcess, onExpand, onHover } = this.props;
        return (
            <div className={styles.outline_tree}>
                {
                    React.Children.map(this.props.children, (child, i) => {
                        return (
                            <TreeNode {...child.props} onDataProcess={onDataProcess} onExpand={onExpand} onHover={onHover}>
                                {child.props.children}
                            </TreeNode>
                        );
                    })
                }
            </div>
        );
    }
}


const OutlineTree = MyOutlineTree;
OutlineTree.TreeNode = TreeNode;
export default OutlineTree;