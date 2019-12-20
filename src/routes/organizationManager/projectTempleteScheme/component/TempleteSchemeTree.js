import React, { Component } from 'react'
import { Tree, Menu, Tooltip } from 'antd'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
const { TreeNode } = Tree;

export default class TempleteSchemeTree extends Component {

  state = {
    planningData: [
      { id: 'parent_1', name: '前期调研', type: 'lcb', parent_id: '0', child_data: [{ id: 'child_1', name: '规划', parent_id: 'parent_1', type: 'task', child_data: [{ id: 'child_1-1', name: '上位政策解读', parent_id: 'child_1', child_data: [], type: 'task' }] }, { id: 'child_2', name: '市政', parent_id: 'parent_1', child_data: [], type: 'task' }] },
      { id: 'parent_2', name: '初次方案', type: 'lcb', parent_id: '0', child_data: [] },
      { id: 'parent_3', name: '沟通讨论', type: 'lcb', parent_id: '0', child_data: [] },
      { id: 'parent_4', name: '深化方案', type: 'lcb', parent_id: '0', child_data: [{ id: 'child_4-1', name: '规划', parent_id: 'parent_4', type: 'task', child_data: [{ id: 'child_4-1-1', name: '上位政策解读', parent_id: 'child_4-1', child_data: [], type: 'task' }] }] },
    ],
  }

  onSelect = (selectedKeys, e) => {
    // console.log(selectedKeys, e, 'sssssssssss_eee')
    this.setState({
      selectedKeys
    })
  }

  handleOperator = (key, e) => {
    const cond = {
      add_sibiling: (e) => this.handleAddSibiling(e),
      add_children: (e) => this.handleAddChildren(e),
      rename: (e) => this.handleRename(e),
      delete_item: (e) => this.handleDeleteItem(e)
    }
    cond[key](e);
  }

  // 添加同级 S
  handleAddSibiling = (e) => {
    // console.log(e, 'sssssssss_eeeeeeee')
    e && e.stopPropagation()
  }
  // 添加同级 E

  // 添加子级 S
  handleAddChildren = (e) => {
    e && e.stopPropagation()
  }
  // 添加子级 E

  // 重命名 S
  handleRename = (e) => {
    e && e.stopPropagation()
  }
  // 重命名 E

  // 删除 S
  handleDeleteItem = (e) => {
    e && e.stopPropagation()
  }
  // 删除 E

  renderOperatorIconList = () => {
    const operatorIconList = [
      {
        toolTipText: '添加同级',
        key: 'add_sibiling',
        icon: <span>&#xe6f1;</span>,
        onClick: (e) => this.handleOperator('add_sibiling',e)
      },
      {
        toolTipText: '添加子级',
        key: 'add_children',
        icon: <span>&#xe6f2;</span>,
        onClick: (e) => this.handleOperator('add_children',e)
      },
      {
        toolTipText: '重命名',
        key: 'rename',
        icon: <span>&#xe602;</span>,
        onClick: (e) => this.handleOperator('rename',e)
      },
      {
        toolTipText: '删除',
        key: 'delete_item',
        icon: <span>&#xe7c3;</span>,
        onClick: (e) => this.handleOperator('delete_item',e)
      },
    ]
    return operatorIconList
  }

  // 渲染树状列表的title
  renderPlanTreeTitle = ({ type, name, id }) => {
    let icon = ''
    if (type == 'lcb') {
      icon = <span className={globalStyles.authTheme} style={{ color: '#FAAD14', fontSize: '18px', marginRight: '6px' }}>&#xe6ef;</span>
    } else {
      icon = <span className={globalStyles.authTheme} style={{ color: '#18B2FF', fontSize: '18px', marginRight: '6px' }}>&#xe6f0;</span>
    }
    let operatorIconList = this.renderOperatorIconList()
    return (
      <div className={indexStyles.show_icon} style={{ display: 'flex', alignItems: 'center' }}>
        {icon}
        <span>{name}</span>
        <div className={indexStyles.icon_list}>
          {
            operatorIconList.map(item => (
              <Tooltip placement="top" title={item.toolTipText}>
                <span onClick={item.onClick} key={item.key} className={`${globalStyles.authTheme} ${indexStyles.icon_item} ${item.key == 'delete_item' && indexStyles.delete_item}`}>{item.icon}</span>
              </Tooltip>
            ))
          }
        </div>
      </div>
    )
  }

  renderPlanTreeNode = (data) => {
    return data && data.map(item => {
      let { type, name, id } = item
      if (item.child_data && item.child_data.length > 0) {
        return (
          <TreeNode title={this.renderPlanTreeTitle({ type, name, id })} key={item.id} dataRef={item} >
            {this.renderPlanTreeNode(item.child_data)}
          </TreeNode>
        );
      } else {
        return <TreeNode title={this.renderPlanTreeTitle({ type, name })} key={item.id} dataRef={item} />;
      }

    });
  }

  render() {
    const { planningData = [], expandedKeys = [], selectedKeys = [] } = this.state
    return (
      <div className={indexStyles.treeNodeWrapper}>
        <Tree
          blockNode={true}
          onSelect={this.onSelect}
        >
          {this.renderPlanTreeNode(planningData)}
        </Tree>
      </div>
    )
  }
}
