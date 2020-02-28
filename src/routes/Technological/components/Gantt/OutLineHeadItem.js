import React, { Component } from 'react';
import { connect, } from 'dva';
import { Icon } from 'antd';
import styles from './index.less';
import globalStyles from '@/globalset/css/globalClassName.less';
import OutlineTree from './components/OutlineTree';
const { TreeNode } = OutlineTree;

let demoData = [
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
@connect(mapStateToProps)
export default class OutLineHeadItem extends Component {
    state = {
        treeData: demoData
    }
    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    };

    onHover = (id, hover) => {
        console.log("大纲:onHover", id, hover);

    }

    onExpand = (id, open) => {
        console.log("大纲:onExpand", id, open);

    }
    onDataProcess = ({ action, param }) => {
        console.log("大纲:onDataProcess", action, param);
    }
    renderGanttOutLineTree = (outline_tree, isRoot) => {
        if (!outline_tree) {
            return null;
        }
        //console.log("outline_tree", outline_tree);
        return (
            outline_tree.map((item, index) => {
                if (item.children && item.children.length > 0) {
                    return (
                        <TreeNode key={item.id} nodeValue={item}>
                            {this.renderGanttOutLineTree(item.children)}
                            <TreeNode
                                type={'2'}
                                placeholder={'新建任务'}
                                icon={<span className={`${styles.addTaskNode} ${globalStyles.authTheme}`}  >&#xe8fe;</span>}
                                label={<span className={styles.addTask}>新建任务</span>} key={`addTask_${item.id}`}>
                            </TreeNode>
                        </TreeNode>
                    );
                } else {
                    return (<TreeNode key={item.id} key={item.id} nodeValue={item}></TreeNode>);
                }


            })
        );
    }



    render() {
        const { treeData } = this.state;
        const { outline_tree } = this.props;
        console.log("outline_tree", outline_tree);
        return (
            <div className={styles.outline_wrapper}>

                <OutlineTree
                    showLine={true}
                    showIcon={true}
                    switcherIcon={<span><Icon type="down" /></span>}
                    // defaultExpandedKeys={['0-0-0']}
                    onSelect={this.onSelect}
                    onDataProcess={this.onDataProcess}
                    onExpand={this.onExpand}
                    onHover={this.onHover}

                >
                    {this.renderGanttOutLineTree(outline_tree, true)}
                    <TreeNode
                        type={'1'}
                        placeholder={'新建里程碑'}
                        icon={<span className={`${styles.addMilestoneNode} ${globalStyles.authTheme}`}  >&#xe8fe;</span>}
                        label={<span className={styles.addMilestone}>新建里程碑</span>} key="addMilestone">
                    </TreeNode>

                </OutlineTree>

                <div className={styles.outlineFooter}>
                    <span className={`${styles.actionIcon} ${globalStyles.authTheme}`}>&#xe7ae;</span>
                    <span className={`${styles.actionIcon} ${globalStyles.authTheme}`}>&#xe66f;</span>

                </div>
            </div>
        );
    }

}

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({
    gantt: { datas: { gantt_board_id, group_view_type, outline_tree } },
    technological: { datas: { currentUserOrganizes = [], is_show_org_name, is_all_org, userBoardPermissions } },
    projectDetail: { datas: { projectDetailInfoData = {} } }
}) {
    return { currentUserOrganizes, is_show_org_name, is_all_org, gantt_board_id, group_view_type, projectDetailInfoData, userBoardPermissions, outline_tree }
}

