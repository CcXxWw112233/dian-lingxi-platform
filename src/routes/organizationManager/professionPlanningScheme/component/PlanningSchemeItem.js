import React, { Component } from 'react'
import { Tree } from 'antd'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
const { TreeNode } = Tree;

export default class PlanningSchemeItem extends Component {

  state = {
    planningData: [
      { id: 'parent_1', name: '前期调研', type: 'lcb', parent_id: '0', child_data: [{ id: 'child_1', name: '规划', parent_id: 'parent_1', type: 'task', child_data: [{ id: 'child_1-1', name: '上位政策解读', parent_id: 'child_1', child_data: [], type: 'task' }] }, { id: 'child_2', name: '市政', parent_id: 'parent_1', child_data: [], type: 'task' }] },
      { id: 'parent_2', name: '初次方案', type: 'lcb', parent_id: '0', child_data: [] },
      { id: 'parent_3', name: '沟通讨论', type: 'lcb', parent_id: '0', child_data: [] },
      { id: 'parent_4', name: '深化方案', type: 'lcb', parent_id: '0', child_data: [{ id: 'child_4-1', name: '规划', parent_id: 'parent_4', type: 'task', child_data: [{ id: 'child_4-1-1', name: '上位政策解读', parent_id: 'child_4-1', child_data: [], type: 'task' }] }] },
    ],
    expandedKeys: [],
    // autoExpandParent: true,
    selectedKeys: []
  }

  onSelect = (selectedKeys, obj) => {
    let { expandedKeys } = this.state
    let selectedKey = this.state.selectedKeys
    let newExpandedKeys = [...expandedKeys]
    //选中的状态
    if (obj.selected) {
      //判断是否已经展开，未展开就添加到 expandedKeys 中
      //已经展开就不用管
      let index = newExpandedKeys.indexOf(selectedKeys[0])
      if (index === -1) {
        newExpandedKeys.push(selectedKeys[0])
        this.setState({
          expandedKeys: newExpandedKeys,
          selectedKeys: selectedKeys
        })
      } else {
        let index = newExpandedKeys.indexOf(selectedKeys[0])
        // this.setState({
        //   selectedKeys: selectedKeys
        // })
        //过渡掉子类元素
        if (index !== -1) {
          //过渡掉子类元素
          newExpandedKeys = newExpandedKeys.filter((ele) => {
            return !ele.includes(selectedKeys[0])
          })
          this.setState({
            expandedKeys: newExpandedKeys,
            selectedKeys: []
          })
        } else {
          this.setState({
            selectedKeys: []
          })
        }
      }

      // 没有 children 代表当前已没有下一级目录
      if (obj.event && obj.selectedNodes.length === 1 && !obj.selectedNodes[0].props.children) {
        //do something
      }
    } else {
      //selectedKey 是上次选中的元素 在 expandedKeys 肯定是存在的 
      //找到下标后需要过滤掉子类目录 例如上次选中的元素为 /a ,
      //子类 /a/a_1 已经展开就需要从 expandedKeys 中移除这个元素
      let index = newExpandedKeys.indexOf(selectedKey[0])
      if (index !== -1) {
        //过渡掉子类元素
        newExpandedKeys = newExpandedKeys.filter((ele) => {
          return !ele.includes(selectedKey[0])
        })
        this.setState({
          expandedKeys: newExpandedKeys,
          selectedKeys: []
        })
      } else {
        this.setState({
          selectedKeys: []
        })
      }
    }
  }

  //展开的回调
  onExpend = (expandedKey, obj) => {
    let { expandedKeys } = this.state
    //展开的状态
    if (obj.expanded) {
      this.setState({
        expandedKeys: expandedKey,
        selectedKeys: []
      })
    } else {
      //expandedKey 返回的是当前已经展开的元素 expandedKeys 是上次展开的元素
      //比较两个数组中缺少的元素得出当前被收起的是哪个元素
      let removeArray = this.diffArray(expandedKey, expandedKeys)
      //收起的时候需要把里面展开的元素一并移除，不然会造成收起动作无效
      expandedKeys = expandedKeys.filter((ele) => {
        return !ele.includes(removeArray[0])
      })
      this.setState({
        expandedKeys: expandedKeys,
        selectedKeys: []
      })
    }
  }

  //比较出2个数组中不一样的元素
  diffArray = (arr1, arr2) => {
    let arr3 = [];
    for (let i = 0; i < arr1.length; i++) {
      if (arr2.indexOf(arr1[i]) === -1)
        arr3.push(arr1[i]);
    }
    for (let j = 0; j < arr2.length; j++) {
      if (arr1.indexOf(arr2[j]) === -1)
        arr3.push(arr2[j]);
    }
    return arr3;
  }

  // 渲染树状列表的title
  renderPlanTreeTitle = ({ type, name }) => {
    let icon = ''
    if (type == 'lcb') {
      icon = <span className={globalStyles.authTheme} style={{ color: '#FAAD14', fontSize: '18px', marginRight: '6px' }}>&#xe6ef;</span>
    } else {
      icon = <span className={globalStyles.authTheme} style={{ color: '#18B2FF', fontSize: '18px', marginRight: '6px' }}>&#xe6f0;</span>
    }
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {icon}
        <span>{name}</span>
      </div>
    )
  }

  renderPlanTreeNode = (data) => {
    return data && data.map(item => {
      let { type, name } = item
      if (item.child_data && item.child_data.length > 0) {
        return (
          <TreeNode title={this.renderPlanTreeTitle({ type, name })} key={item.id} dataRef={item} >
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
          onExpand={this.onExpend}
          expandedKeys={expandedKeys}
          // autoExpandParent={this.state.autoExpandParent}
          onSelect={this.onSelect}
          selectedKeys={selectedKeys}
        >
          {this.renderPlanTreeNode(planningData)}
        </Tree>
      </div>
    )
  }
}
