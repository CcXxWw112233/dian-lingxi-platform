import React, { Component } from 'react'
import styles from './index.less';


const TreeNode = (props) => {
    const { key, leve = 0, isOpen = true, isLeaf = true, title, type = 'milestone' } = props;
    if (props.children) {
        console.log(props.children.length);
        let className = `${styles.outline_tree_node} ${styles[`leve_${leve}`]} ${isLeaf ? (isOpen ? styles.expanded : '') : ''} `;

        return (
            <div className={className} key={key}>
                <div className={`${styles.outline_tree_node_content}`} style={{ paddingLeft: (leve * 23) + 'px' }}>
                    <span className={`${styles.outline_tree_line_node_dot} ${type == 'milestone' ? styles.milestoneNode : ''}`}></span>
                    {
                        !isLeaf &&
                        <span className={`${styles.outline_tree_node_expand_icon} ${isOpen ? styles.expanded : ''}`}></span>
                    }
                    <span className={styles.outline_tree_node_label}>{title}</span>
                </div>
                <div className={styles.collapse_transition} data-old-padding-top="0px" data-old-padding-bottom="0px" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block' }}>
                    <div className={styles.outline_tree_node_children}>
                        {
                            props.children.map((item) => {
                                return (item);
                            })
                        }

                    </div>
                </div>
            </div>
        );

    } else {
        let className = `${styles.outline_tree_node} ${styles[`leve_${leve}`]} ${isLeaf ? (isOpen ? styles.expanded : '') : ''} `;

        return (
            <div className={className} key={key}>
                <div className={`${styles.outline_tree_node_content}`} style={{ paddingLeft: (leve * 23) + 'px' }}>
                    <span className={`${styles.outline_tree_line_node_dot} ${type == 'milestone' ? styles.milestoneNode : ''}`}></span>
                    {
                        !isLeaf &&
                        <span className={`${styles.outline_tree_node_expand_icon} ${isOpen ? styles.expanded : ''}`}></span>
                    }
                    <span className={styles.outline_tree_node_label}>{title}</span>
                </div>
            </div>
        );
    }

}


class index extends Component {
    render() {
        return (
            <div className={styles.outline_tree}>
                <div className={`${styles.outline_tree_node} ${styles.leve_0} ${styles.expanded}`}>
                    <div className={`${styles.outline_tree_node_content}`} style={{ paddingLeft: '0px' }}>
                        <span className={`${styles.outline_tree_line_node_dot} ${styles.milestoneNode}`}></span>
                        <span className={`${styles.outline_tree_node_expand_icon} ${styles.expanded}`}></span>
                        <span className={styles.outline_tree_node_label}>一级 1</span>
                    </div>
                    <div className={styles.collapse_transition} data-old-padding-top="0px" data-old-padding-bottom="0px" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block' }}>
                        <div className={styles.outline_tree_node_children}>
                            <div className={`${styles.outline_tree_node} ${styles.leve_1} ${styles.expanded}`}>
                                <div className={styles.outline_tree_node_content} style={{ paddingLeft: '23px' }}>
                                    <span className={`${styles.outline_tree_line_node_dot} ${styles.taskNode}`}></span>
                                    <span className={`${styles.outline_tree_node_expand_icon} ${styles.expanded}`}></span>
                                    <span className={styles.outline_tree_node_label}>二级 1-1</span>
                                </div>
                                <div className={styles.collapse_transition} data-old-padding-top="0px" data-old-padding-bottom="0px" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block' }}>
                                    <div className={styles.outline_tree_node_children}>
                                        <div className={`${styles.outline_tree_node} ${styles.leve_2}`}>
                                            <div className={`${styles.outline_tree_node_content} ${styles.is_leaf}`} style={{ paddingLeft: '46px' }}>
                                                <span className={`${styles.outline_tree_line_node_dot} ${styles.taskNode}`}></span>
                                                {/* <span className={`${styles.outline_tree_node_expand_icon} ${styles.is_leaf}`}></span> */}
                                                <span className={styles.outline_tree_node_label}>三级 1-1-1</span>
                                            </div>
                                            <div className={styles.collapse_transition} data-old-padding-top="" data-old-padding-bottom="" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block' }}>
                                                <div className={styles.outline_tree_node_children}></div>
                                            </div>
                                        </div>
                                        <div className={`${styles.outline_tree_node} ${styles.leve_2}`}>
                                            <div className={`${styles.outline_tree_node_content} ${styles.is_leaf}`} style={{ paddingLeft: '46px' }}>
                                                <span className={`${styles.outline_tree_line_node_dot} ${styles.taskNode}`}></span>
                                                {/* <span className={`${styles.outline_tree_node_expand_icon} ${styles.is_leaf}`}></span> */}
                                                <span className={styles.outline_tree_node_label}>三级 1-1-1</span>
                                            </div>
                                            <div className={styles.collapse_transition} data-old-padding-top="" data-old-padding-bottom="" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block' }}>
                                                <div className={styles.outline_tree_node_children}></div>
                                            </div>
                                        </div>
                                        <div className={`${styles.outline_tree_node} ${styles.leve_2}`}>
                                            <div className={`${styles.outline_tree_node_content} ${styles.is_leaf}`} style={{ paddingLeft: '46px' }}>
                                                <span className={`${styles.outline_tree_line_node_dot} ${styles.taskNode}`}></span>
                                                {/* <span className={`${styles.outline_tree_node_expand_icon} ${styles.is_leaf}`}></span> */}
                                                <span className={styles.outline_tree_node_label}>新建任务</span>
                                            </div>
                                            <div className={styles.collapse_transition} data-old-padding-top="" data-old-padding-bottom="" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block' }}>
                                                <div className={styles.outline_tree_node_children}></div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className={`${styles.outline_tree_node} ${styles.leve_1} ${styles.expanded}`}>
                                <div className={styles.outline_tree_node_content} style={{ paddingLeft: '23px' }}>
                                    <span className={`${styles.outline_tree_line_node_dot} ${styles.taskNode}`}></span>
                                    <span className={`${styles.outline_tree_node_expand_icon} ${styles.expanded}`}></span>
                                    <span className={styles.outline_tree_node_label}>二级 1-1</span>
                                </div>
                                <div className={styles.collapse_transition} data-old-padding-top="0px" data-old-padding-bottom="0px" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block' }}>
                                    <div className={styles.outline_tree_node_children}>
                                        <div className={`${styles.outline_tree_node}`}>
                                            <div className={`${styles.outline_tree_node_content} ${styles.is_leaf}`} style={{ paddingLeft: '46px' }}>
                                                <span className={`${styles.outline_tree_line_node_dot} ${styles.taskNode}`}></span>
                                                {/* <span className={`${styles.outline_tree_node_expand_icon} ${styles.is_leaf}`}></span> */}
                                                <span className={styles.outline_tree_node_label}>三级 1-1-1</span>
                                            </div>
                                            <div className={styles.collapse_transition} data-old-padding-top="" data-old-padding-bottom="" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block' }}>
                                                <div className={styles.outline_tree_node_children}></div>
                                            </div>
                                        </div>
                                        <div className={`${styles.outline_tree_node}`}>
                                            <div className={`${styles.outline_tree_node_content} ${styles.is_leaf}`} style={{ paddingLeft: '46px' }}>
                                                <span className={`${styles.outline_tree_line_node_dot} ${styles.taskNode}`}></span>
                                                {/* <span className={`${styles.outline_tree_node_expand_icon} ${styles.is_leaf}`}></span> */}
                                                <span className={styles.outline_tree_node_label}>三级 1-1-1</span>
                                            </div>
                                            <div className={styles.collapse_transition} data-old-padding-top="" data-old-padding-bottom="" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block' }}>
                                                <div className={styles.outline_tree_node_children}></div>
                                            </div>
                                        </div>
                                        <div className={`${styles.outline_tree_node}`}>
                                            <div className={`${styles.outline_tree_node_content} ${styles.is_leaf}`} style={{ paddingLeft: '46px' }}>
                                                <span className={`${styles.outline_tree_line_node_dot} ${styles.taskNode}`}></span>
                                                {/* <span className={`${styles.outline_tree_node_expand_icon} ${styles.is_leaf}`}></span> */}
                                                <span className={styles.outline_tree_node_label}>新建任务</span>
                                            </div>
                                            <div className={styles.collapse_transition} data-old-padding-top="" data-old-padding-bottom="" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block' }}>
                                                <div className={styles.outline_tree_node_children}></div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className={`${styles.outline_tree_node} ${styles.leve_1} ${styles.expanded}`}>
                                <div className={styles.outline_tree_node_content} style={{ paddingLeft: '23px' }}>
                                    <span className={`${styles.outline_tree_line_node_dot} ${styles.taskNode}`}></span>
                                    <span className={`${styles.outline_tree_node_expand_icon} ${styles.expanded}`}></span>
                                    <span className={styles.outline_tree_node_label}>二级 1-1</span>
                                </div>
                                <div className={styles.collapse_transition} data-old-padding-top="0px" data-old-padding-bottom="0px" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block' }}>
                                    <div className={styles.outline_tree_node_children}>
                                        <div className={`${styles.outline_tree_node}`}>
                                            <div className={`${styles.outline_tree_node_content} ${styles.is_leaf}`} style={{ paddingLeft: '46px' }}>
                                                <span className={`${styles.outline_tree_line_node_dot} ${styles.taskNode}`}></span>
                                                {/* <span className={`${styles.outline_tree_node_expand_icon} ${styles.is_leaf}`}></span> */}
                                                <span className={styles.outline_tree_node_label}>三级 1-1-1</span>
                                            </div>
                                            <div className={styles.collapse_transition} data-old-padding-top="" data-old-padding-bottom="" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block' }}>
                                                <div className={styles.outline_tree_node_children}></div>
                                            </div>
                                        </div>
                                        <div className={`${styles.outline_tree_node}`}>
                                            <div className={`${styles.outline_tree_node_content} ${styles.is_leaf}`} style={{ paddingLeft: '46px' }}>
                                                <span className={`${styles.outline_tree_line_node_dot} ${styles.taskNode}`}></span>
                                                {/* <span className={`${styles.outline_tree_node_expand_icon} ${styles.is_leaf}`}></span> */}
                                                <span className={styles.outline_tree_node_label}>三级 1-1-1</span>
                                            </div>
                                            <div className={styles.collapse_transition} data-old-padding-top="" data-old-padding-bottom="" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block' }}>
                                                <div className={styles.outline_tree_node_children}></div>
                                            </div>
                                        </div>
                                        <div className={`${styles.outline_tree_node}`}>
                                            <div className={`${styles.outline_tree_node_content} ${styles.is_leaf}`} style={{ paddingLeft: '46px' }}>
                                                <span className={`${styles.outline_tree_line_node_dot} ${styles.taskNode}`}></span>
                                                {/* <span className={`${styles.outline_tree_node_expand_icon} ${styles.is_leaf}`}></span> */}
                                                <span className={styles.outline_tree_node_label}>新建任务</span>
                                            </div>
                                            <div className={styles.collapse_transition} data-old-padding-top="" data-old-padding-bottom="" data-old-overflow="hidden" style={{ overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block' }}>
                                                <div className={styles.outline_tree_node_children}></div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className={`${styles.outline_tree_node} ${styles.leve_0}`}>
                    <div className={`${styles.outline_tree_node_content}`} style={{ paddingLeft: '0px' }}>
                        <span className={`${styles.outline_tree_line_node_dot} ${styles.milestoneNode}`}></span>
                        {/* <span className={`${styles.outline_tree_node_expand_icon}`}></span> */}
                        <span className={styles.outline_tree_node_label}>一级 1</span>
                    </div>
                </div>

            </div>
        )
    }
}

class MyOutlineTree extends Component {
    render() {
        return (
            <div className={styles.outline_tree}>
                {this.props.children}
            </div>
        );
    }
}


const OutlineTree = MyOutlineTree;
OutlineTree.TreeNode = TreeNode;
export default OutlineTree;