import React, { Component } from 'react';
import { connect, } from 'dva';
import { Icon } from 'antd';
import styles from './index.less';
import globalStyles from '@/globalset/css/globalClassName.less';
import OutlineTree from './components/OutlineTree';
const { TreeNode } = OutlineTree;
@connect(mapStateToProps)
export default class OutLineHeadItem extends Component {

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
        console.log('selected', selectedKeys, info);
    };

    onHover = (id, hover) => {
        console.log("大纲:onHover", id, hover);
        const { dispatch, outline_tree } = this.props;
        let nodeValue = {};
        if (hover) {
            nodeValue = OutlineTree.getTreeNodeValue(outline_tree, id) || {};
        }

        this.updateOutLineTreeData(outline_tree);
        dispatch({
            type: 'gantt/updateDatas',
            payload: {
                outline_hover_obj: nodeValue
            }
        });
    }

    onExpand = (id, open) => {
        console.log("大纲:onExpand", id, open);
        const { dispatch, outline_tree } = this.props;
        let nodeValue = OutlineTree.getTreeNodeValue(outline_tree, id);
        if (nodeValue) {
            nodeValue.open = open;
            this.updateOutLineTreeData(outline_tree);
        } else {
            console.error("OutlineTree.getTreeNodeValue:未查询到节点");
        }

    }
    onDataProcess = ({ action, param }) => {
        console.log("大纲:onDataProcess", action, param);
        const { dispatch, outline_tree } = this.props;
        switch (action) {
            case 'add_milestone':
                {

                }
                break;
            case 'edit_milestone':
                {

                }
                break;
            case 'add_task':
                {

                }
                break;
            case 'edit_2task':
                {

                }
                break;
            default:
                ;

        }
        let nodeValue = OutlineTree.getTreeNodeValue(outline_tree, id);
        if (nodeValue) {
            nodeValue.open = open;
            this.updateOutLineTreeData(outline_tree);
        } else {
            console.error("OutlineTree.getTreeNodeValue:未查询到节点");
        }

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
    gantt: { datas: { gantt_board_id, group_view_type, outline_tree, outline_hover_obj } },
    technological: { datas: { currentUserOrganizes = [], is_show_org_name, is_all_org, userBoardPermissions } },
    projectDetail: { datas: { projectDetailInfoData = {} } }
}) {
    return { currentUserOrganizes, is_show_org_name, is_all_org, gantt_board_id, group_view_type, projectDetailInfoData, userBoardPermissions, outline_tree }
}

