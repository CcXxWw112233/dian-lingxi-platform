import React, { Component } from 'react';
import { Tree, Icon } from 'antd';
import styles from './index.less';
import globalStyles from '@/globalset/css/globalClassName.less';
const { TreeNode, } = Tree;
export default class OutLineHeadItem extends Component {
    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    };


    renderGanttOutLineTree = (treeData, isRoot) => {
        if (!treeData) {
            return null;
        }
        console.log("treeData", treeData);
        if (isRoot) {
            return (
                <Tree
                    showLine={true}
                    showIcon={true}
                    switcherIcon={<span><Icon type="down" /></span>}
                    // defaultExpandedKeys={['0-0-0']}
                    onSelect={this.onSelect}
                >
                    {
                        treeData.map((item, index) => {
                            if (item.children && item.children.length > 0) {
                                return (
                                    <TreeNode icon={<span className={`${styles.milestoneNode}`}></span>} title={item.name} key={item.id}>
                                        {this.renderGanttOutLineTree(item.children)}
                                        <TreeNode
                                            icon={<span className={`${styles.addTaskNode} ${globalStyles.authTheme}`}  >&#xe8fe;</span>}
                                            switcherIcon={<span></span>}
                                            title={<span className={styles.addTask}>新建任务</span>} key={`addTask_${item.id}`}>
                                        </TreeNode>
                                    </TreeNode>
                                );
                            } else {
                                return (

                                    <TreeNode switcherIcon={<span></span>} icon={<span className={`${styles.milestoneNode}`}></span>} title={item.name} key={item.id}>
                                    </TreeNode>
                                );
                            }


                        })
                    }
                    <TreeNode icon={<span className={`${styles.addMilestoneNode} ${globalStyles.authTheme}`}  >&#xe8fe;</span>} switcherIcon={<span></span>} title={<span className={styles.addMilestone}>新建里程碑</span>} key="addMilestone">

                    </TreeNode>
                </Tree>
            );
        } else {
            return (
                treeData.map((item, index) => {
                    if (item.type == 'task') {
                        if (item.children && item.children.length > 0) {
                            return (
                                <TreeNode icon={<span className={`${styles.taskNode}`}></span>} title={item.name} key={item.id}>
                                    {this.renderGanttOutLineTree(item.children)}
                                    <TreeNode
                                        icon={<span className={`${styles.addTaskNode} ${globalStyles.authTheme}`}  >&#xe8fe;</span>}
                                        switcherIcon={<span></span>}
                                        title={<span className={styles.addTask}>新建任务</span>} key={`addTask_${item.id}`}>
                                    </TreeNode>
                                </TreeNode>
                            );
                        } else {
                            return (
                                <TreeNode switcherIcon={<span></span>} icon={<span className={`${styles.taskNode}`}></span>} title={item.name} key={item.id}>

                                </TreeNode>
                            );
                        }

                    } else {
                        return (
                            <TreeNode icon={<span className={`${styles.milestoneNode}`}></span>} title={item.name} key={item.id}>
                                {this.renderGanttOutLineTree(item.children)}
                                <TreeNode
                                    icon={<span className={`${styles.addTaskNode} ${globalStyles.authTheme}`}  >&#xe8fe;</span>}
                                    switcherIcon={<span></span>}
                                    title={<span className={styles.addTask}>新建任务</span>} key={`addTask_${item.id}`}>
                                </TreeNode>
                            </TreeNode>
                        );
                    }

                })


            );
        }


    }

    render() {
        const data = [
            {
                id: 100, "name": '前期调研', type: 'milestone', open: true, parentId: 0,
                children: [
                    {
                        id: 110, "name": '现场勘探调查', type: 'task', open: true, parentId: 100,
                        children: [
                            { id: 111, "name": '交通勘探', type: 'task', open: true, parentId: 110 },
                            { id: 112, "name": '人文勘探', type: 'task', open: true, parentId: 110 },
                        ]
                    },
                    {
                        id: 120, "name": '座谈会', type: 'task', open: true, parentId: 100,
                        children: [
                            { id: 121, "name": '第1次座谈会', type: 'task', open: true, parentId: 120 },
                            { id: 122, "name": '第2次座谈会', type: 'task', open: true, parentId: 120 },
                        ]
                    },
                    {
                        id: 130, "name": '问卷调查', type: 'task', open: true, parentId: 100,
                        children: [
                            { id: 131, "name": '第1次问卷调查', type: 'task', open: true, parentId: 130 },
                            { id: 132, "name": '第2次问卷调查会', type: 'task', open: true, parentId: 130 },
                        ]
                    },
                    {
                        id: 140, "name": '走访访谈', type: 'task', open: true, parentId: 100
                    },
                    {
                        id: 150, "name": '文献资料整理', type: 'task', open: true, parentId: 100
                    }
                ]
            },
            {
                id: 101, "name": '方案设计', type: 'milestone', open: true, parentId: 0
            },
            {
                id: 102, "name": '方案评估', type: 'milestone', open: true, parentId: 0
            },
            {
                id: 103, "name": '成果编制', type: 'milestone', open: true, parentId: 0
            },
            {
                id: 104, "name": '报审报批交付', type: 'milestone', open: true, parentId: 0
            }
        ]
        return (
            <div className={styles.outline_wrapper}>
                <div className="el-tree " className={style.el_tree}>
                    <div className="el-tree-node expanded">
                        <div className="el-tree-node__content" style={{paddingLeft: '0px'}}>
                            <span className="el-tree-node__expand-icon expanded"></span>
                            <span className="el-tree-node__label">一级 1</span>
                        </div>
                        <div className="collapse-transition" data-old-padding-top="0px" data-old-padding-bottom="0px" data-old-overflow="hidden" style={{overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block'}}>
                            <div className="el-tree-node__children">
                                <div className="el-tree-node expanded">
                                    <div className="el-tree-node__content" style={{paddingLeft: '16px'}}>
                                        <span className="el-tree-node__expand-icon expanded"></span>
                                        <span className="el-tree-node__label">二级 1-1</span>
                                    </div>
                                    <div className="collapse-transition" data-old-padding-top="0px" data-old-padding-bottom="0px" data-old-overflow="hidden" style={{overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block'}}>
                                        <div className="el-tree-node__children">
                                            <div className="el-tree-node">
                                                <div className="el-tree-node__content" style={{paddingLeft: '32px'}}>
                                                    <span className="el-tree-node__expand-icon is-leaf"></span>
                                                    <span className="el-tree-node__label">三级 1-1-1</span>
                                                </div>
                                                <div className="collapse-transition" data-old-padding-top="" data-old-padding-bottom="" data-old-overflow="hidden" style={{overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', display: 'block'}}>
                                                    <div className="el-tree-node__children"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }

}
