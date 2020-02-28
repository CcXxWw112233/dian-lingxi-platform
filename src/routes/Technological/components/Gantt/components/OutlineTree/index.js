import React, { Component } from 'react'
import styles from './index.less';
import { Input } from 'antd';
import globalStyles from '@/globalset/css/globalClassName.less';

class TreeNode extends Component {
    constructor(props) {
        console.log("TreeNode", props);
        super(props);
        this.state = {
            isTitleHover: false,
            isTitleEdit: false,
            open: true,
            hover: false,
            ...props
        }
    }

    onChangeExpand = (e) => {
        e.stopPropagation();
        const open = !this.state.open;
        this.setState({
            open
        });
        this.props.onExpand(this.state.id, open);
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
        const { id, hover } = this.state;
        this.props.onHover({
            id,
            hover: !hover
        });
    }

    onMouseLeave = () => {
        const { id, hover } = this.state;
        this.props.onHover({
            id,
            hover: !hover
        });
    }


    onPressEnter = () => {
        this.setState({
            isTitleHover: false,
            isTitleEdit: false
        });
        let action;
        if (this.state.placeholder) {
            action = 'add_' + this.state.type;
        } else {
            action = 'edit_' + this.state.type;
        }

        this.props.onDataProcess &&
            this.props.onDataProcess({
                action,
                param: { ...this.state }
            });
    }
    onChangeTitle = (e) => {
        this.setState({
            title: e.target.value
        });
    }



    render() {
        const { isTitleHover, isTitleEdit, id, key, leve = 0, open = true, title, type = 'milestone', icon, placeholder, label } = this.state;
        const { onDataProcess, onExpand,onHover} = this.props;

        // console.log("openopenopenopen" + key, open);
        if (this.state.children) {

            let className = `${styles.outline_tree_node} ${styles[`leve_${leve}`]} ${isLeaf ? (open ? styles.expanded : '') : ''} `;
            let isLeaf = false;
            return (
                <div className={className} key={key}>
                    <div className={`${styles.outline_tree_node_content}`} style={{ paddingLeft: (leve * 23) + 'px' }}>
                        <span className={`${styles.outline_tree_line_node_dot} ${type == 'milestone' ? styles.milestoneNode : styles.taskNode}`}></span>
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
                                React.Children.map(this.state.children, (child, i) => {
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
                    <div className={`${styles.outline_tree_node_content}`} style={{ paddingLeft: (leve * 23) + 'px' }}>
                        {
                            icon ?
                                icon
                                :
                                <span className={`${styles.outline_tree_line_node_dot} ${type == 'milestone' ? styles.milestoneNode : styles.taskNode}`}></span>
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


// class index extends Component {
//     render() {
//         return (
//             <div className={styles.outline_tree}>
//                 <div className={`${styles.outline_tree_node} ${styles.leve_0} ${styles.expanded}`}>
//                     <div className={`${styles.outline_tree_node_content}`} style={{ paddingLeft: '0px' }}>
//                         <span className={`${styles.outline_tree_line_node_dot} ${styles.milestoneNode}`}></span>
//                         <span className={`${styles.outline_tree_node_expand_icon} ${styles.expanded}`}></span>
//                         <span className={styles.outline_tree_node_label}>一级 1</span>
//                     </div>
//                     <div className={styles.collapse_transition} data-old-padding-top="0px" data-old-padding-bottom="0px" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block' }}>
//                         <div className={styles.outline_tree_node_children}>
//                             <div className={`${styles.outline_tree_node} ${styles.leve_1} ${styles.expanded}`}>
//                                 <div className={styles.outline_tree_node_content} style={{ paddingLeft: '23px' }}>
//                                     <span className={`${styles.outline_tree_line_node_dot} ${styles.taskNode}`}></span>
//                                     <span className={`${styles.outline_tree_node_expand_icon} ${styles.expanded}`}></span>
//                                     <span className={styles.outline_tree_node_label}>二级 1-1</span>
//                                 </div>
//                                 <div className={styles.collapse_transition} data-old-padding-top="0px" data-old-padding-bottom="0px" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block' }}>
//                                     <div className={styles.outline_tree_node_children}>
//                                         <div className={`${styles.outline_tree_node} ${styles.leve_2}`}>
//                                             <div className={`${styles.outline_tree_node_content} ${styles.is_leaf}`} style={{ paddingLeft: '46px' }}>
//                                                 <span className={`${styles.outline_tree_line_node_dot} ${styles.taskNode}`}></span>
//                                                 {/* <span className={`${styles.outline_tree_node_expand_icon} ${styles.is_leaf}`}></span> */}
//                                                 <span className={styles.outline_tree_node_label}>三级 1-1-1</span>
//                                             </div>
//                                             <div className={styles.collapse_transition} data-old-padding-top="" data-old-padding-bottom="" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block' }}>
//                                                 <div className={styles.outline_tree_node_children}></div>
//                                             </div>
//                                         </div>
//                                         <div className={`${styles.outline_tree_node} ${styles.leve_2}`}>
//                                             <div className={`${styles.outline_tree_node_content} ${styles.is_leaf}`} style={{ paddingLeft: '46px' }}>
//                                                 <span className={`${styles.outline_tree_line_node_dot} ${styles.taskNode}`}></span>
//                                                 {/* <span className={`${styles.outline_tree_node_expand_icon} ${styles.is_leaf}`}></span> */}
//                                                 <span className={styles.outline_tree_node_label}>三级 1-1-1</span>
//                                             </div>
//                                             <div className={styles.collapse_transition} data-old-padding-top="" data-old-padding-bottom="" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block' }}>
//                                                 <div className={styles.outline_tree_node_children}></div>
//                                             </div>
//                                         </div>
//                                         <div className={`${styles.outline_tree_node} ${styles.leve_2}`}>
//                                             <div className={`${styles.outline_tree_node_content} ${styles.is_leaf}`} style={{ paddingLeft: '46px' }}>
//                                                 <span className={`${styles.outline_tree_line_node_dot} ${styles.taskNode}`}></span>
//                                                 {/* <span className={`${styles.outline_tree_node_expand_icon} ${styles.is_leaf}`}></span> */}
//                                                 <span className={styles.outline_tree_node_label}>新建任务</span>
//                                             </div>
//                                             <div className={styles.collapse_transition} data-old-padding-top="" data-old-padding-bottom="" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block' }}>
//                                                 <div className={styles.outline_tree_node_children}></div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                 </div>
//                             </div>

//                             <div className={`${styles.outline_tree_node} ${styles.leve_1} ${styles.expanded}`}>
//                                 <div className={styles.outline_tree_node_content} style={{ paddingLeft: '23px' }}>
//                                     <span className={`${styles.outline_tree_line_node_dot} ${styles.taskNode}`}></span>
//                                     <span className={`${styles.outline_tree_node_expand_icon} ${styles.expanded}`}></span>
//                                     <span className={styles.outline_tree_node_label}>二级 1-1</span>
//                                 </div>
//                                 <div className={styles.collapse_transition} data-old-padding-top="0px" data-old-padding-bottom="0px" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block' }}>
//                                     <div className={styles.outline_tree_node_children}>
//                                         <div className={`${styles.outline_tree_node}`}>
//                                             <div className={`${styles.outline_tree_node_content} ${styles.is_leaf}`} style={{ paddingLeft: '46px' }}>
//                                                 <span className={`${styles.outline_tree_line_node_dot} ${styles.taskNode}`}></span>
//                                                 {/* <span className={`${styles.outline_tree_node_expand_icon} ${styles.is_leaf}`}></span> */}
//                                                 <span className={styles.outline_tree_node_label}>三级 1-1-1</span>
//                                             </div>
//                                             <div className={styles.collapse_transition} data-old-padding-top="" data-old-padding-bottom="" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block' }}>
//                                                 <div className={styles.outline_tree_node_children}></div>
//                                             </div>
//                                         </div>
//                                         <div className={`${styles.outline_tree_node}`}>
//                                             <div className={`${styles.outline_tree_node_content} ${styles.is_leaf}`} style={{ paddingLeft: '46px' }}>
//                                                 <span className={`${styles.outline_tree_line_node_dot} ${styles.taskNode}`}></span>
//                                                 {/* <span className={`${styles.outline_tree_node_expand_icon} ${styles.is_leaf}`}></span> */}
//                                                 <span className={styles.outline_tree_node_label}>三级 1-1-1</span>
//                                             </div>
//                                             <div className={styles.collapse_transition} data-old-padding-top="" data-old-padding-bottom="" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block' }}>
//                                                 <div className={styles.outline_tree_node_children}></div>
//                                             </div>
//                                         </div>
//                                         <div className={`${styles.outline_tree_node}`}>
//                                             <div className={`${styles.outline_tree_node_content} ${styles.is_leaf}`} style={{ paddingLeft: '46px' }}>
//                                                 <span className={`${styles.outline_tree_line_node_dot} ${styles.taskNode}`}></span>
//                                                 {/* <span className={`${styles.outline_tree_node_expand_icon} ${styles.is_leaf}`}></span> */}
//                                                 <span className={styles.outline_tree_node_label}>新建任务</span>
//                                             </div>
//                                             <div className={styles.collapse_transition} data-old-padding-top="" data-old-padding-bottom="" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block' }}>
//                                                 <div className={styles.outline_tree_node_children}></div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                 </div>
//                             </div>

//                             <div className={`${styles.outline_tree_node} ${styles.leve_1} ${styles.expanded}`}>
//                                 <div className={styles.outline_tree_node_content} style={{ paddingLeft: '23px' }}>
//                                     <span className={`${styles.outline_tree_line_node_dot} ${styles.taskNode}`}></span>
//                                     <span className={`${styles.outline_tree_node_expand_icon} ${styles.expanded}`}></span>
//                                     <span className={styles.outline_tree_node_label}>二级 1-1</span>
//                                 </div>
//                                 <div className={styles.collapse_transition} data-old-padding-top="0px" data-old-padding-bottom="0px" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block' }}>
//                                     <div className={styles.outline_tree_node_children}>
//                                         <div className={`${styles.outline_tree_node}`}>
//                                             <div className={`${styles.outline_tree_node_content} ${styles.is_leaf}`} style={{ paddingLeft: '46px' }}>
//                                                 <span className={`${styles.outline_tree_line_node_dot} ${styles.taskNode}`}></span>
//                                                 {/* <span className={`${styles.outline_tree_node_expand_icon} ${styles.is_leaf}`}></span> */}
//                                                 <span className={styles.outline_tree_node_label}>三级 1-1-1</span>
//                                             </div>
//                                             <div className={styles.collapse_transition} data-old-padding-top="" data-old-padding-bottom="" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block' }}>
//                                                 <div className={styles.outline_tree_node_children}></div>
//                                             </div>
//                                         </div>
//                                         <div className={`${styles.outline_tree_node}`}>
//                                             <div className={`${styles.outline_tree_node_content} ${styles.is_leaf}`} style={{ paddingLeft: '46px' }}>
//                                                 <span className={`${styles.outline_tree_line_node_dot} ${styles.taskNode}`}></span>
//                                                 {/* <span className={`${styles.outline_tree_node_expand_icon} ${styles.is_leaf}`}></span> */}
//                                                 <span className={styles.outline_tree_node_label}>三级 1-1-1</span>
//                                             </div>
//                                             <div className={styles.collapse_transition} data-old-padding-top="" data-old-padding-bottom="" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block' }}>
//                                                 <div className={styles.outline_tree_node_children}></div>
//                                             </div>
//                                         </div>
//                                         <div className={`${styles.outline_tree_node}`}>
//                                             <div className={`${styles.outline_tree_node_content} ${styles.is_leaf}`} style={{ paddingLeft: '46px' }}>
//                                                 <span className={`${styles.outline_tree_line_node_dot} ${styles.taskNode}`}></span>
//                                                 {/* <span className={`${styles.outline_tree_node_expand_icon} ${styles.is_leaf}`}></span> */}
//                                                 <span className={styles.outline_tree_node_label}>新建任务</span>
//                                             </div>
//                                             <div className={styles.collapse_transition} data-old-padding-top="" data-old-padding-bottom="" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block' }}>
//                                                 <div className={styles.outline_tree_node_children}></div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                 </div>
//                             </div>

//                         </div>
//                     </div>
//                 </div>
//                 <div className={`${styles.outline_tree_node} ${styles.leve_0}`}>
//                     <div className={`${styles.outline_tree_node_content}`} style={{ paddingLeft: '0px' }}>
//                         <span className={`${styles.outline_tree_line_node_dot} ${styles.milestoneNode}`}></span>
//                         {/* <span className={`${styles.outline_tree_node_expand_icon}`}></span> */}
//                         <span className={styles.outline_tree_node_label}>一级 1</span>
//                     </div>
//                 </div>

//             </div>
//         )
//     }
// }

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