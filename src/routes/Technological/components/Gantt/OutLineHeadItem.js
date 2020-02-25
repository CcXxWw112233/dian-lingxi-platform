import React, { Component } from 'react';
import { Tree, Icon } from 'antd';
import styles from './index.less';
const { TreeNode } = Tree;
export default class OutLineHeadItem extends Component {
    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    };
    render() {
        return (
            <div className={styles.out_line_wrapper}>
                <Tree
                    showLine
                    switcherIcon={<Icon type="down" />}
                    defaultExpandedKeys={['0-0-0']}
                    onSelect={this.onSelect}
                    blockNode
                >
                    <TreeNode title="前期调研" key="0-0">
                        <TreeNode title="现场勘探调查" key="0-0-0">
                            <TreeNode title="交通勘探" key="0-0-0-0" />
                            <TreeNode title="人文勘探" key="0-0-0-1" />
                            <TreeNode title={<span className={styles.addTask}>新建子任务</span>} key="0-0-0-2" />
                        </TreeNode>
                        <TreeNode title="座谈会" key="0-0-1">
                            <TreeNode title="第一次座谈会" key="0-0-1-0" />
                            <TreeNode title={<span className={styles.addTask}>新建子任务</span>} key="0-0-1-1" />
                        </TreeNode>
                        <TreeNode title="问卷调查" key="0-0-2">
                            <TreeNode title="第一次问卷调查" key="0-0-2-0" />
                            <TreeNode title={<span className={styles.addTask}>新建子任务</span>} key="0-0-2-1" />
                        </TreeNode>
                        <TreeNode title="走访访谈" key="0-0-3">
                        </TreeNode>
                        <TreeNode title="文献资料整理" key="0-0-4">
                        </TreeNode>
                        <TreeNode title={<span className={styles.addTask}>新建任务</span>} key="0-0-5">
                        </TreeNode>
                    </TreeNode>
                    <TreeNode title="方案设计" key="0-1">

                    </TreeNode>
                    <TreeNode title="方案设计" key="0-2">

                    </TreeNode>
                    <TreeNode title="成果编制" key="0-3">

                    </TreeNode>
                    <TreeNode title="报审报批交付" key="0-4">

                    </TreeNode>
                    <TreeNode title={<span className={styles.addMilestone}>新建里程碑</span>} key="0-5">

                    </TreeNode>
                </Tree>
            </div>
        );
    }

}
