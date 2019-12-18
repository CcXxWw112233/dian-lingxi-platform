import React, { Component } from 'react'
import { Tree } from 'antd';

const { TreeNode } = Tree;

export default class test extends Component {
  state = {
    expandedKeys: [
      { icon: '父图标1', name: '前期调研', child_data: [{ icon: '子图标1', name: '规划' }, { icon: '子图标2', name: '市政' }, { icon: '子图标3', name: '市政' }] },
      { icon: '父图标2', name: '初次方案', child_data: [{ icon: '子图标2-1', name: '市政' }] },
      { icon: '父图标3', name: '沟通讨论', child_data: [{ icon: '子图标3-1', name: '交通' }] },
      { icon: '父图标4', name: '深化方案', child_data: [] },
    ],
  };

  renderPlanTreeNode = (data) => {
    return data && data.map(item => {
      if (item.child_data && item.child_data.length > 0) {
        return (
          <TreeNode title={item.name} key={item.icon} dataRef={item} >
            {this.renderPlanTreeNode(item.child_data)}
          </TreeNode>
        );
      } else {
        return <TreeNode title={item.name} key={item.icon} dataRef={item} />;
      }

    });
  }

  render() {
    const { expandedKeys = [] } = this.state
    return (
      <div>
        <Tree
          className="draggable-tree"
          defaultExpandedKeys={this.state.expandedKeys}
        >
        {this.renderPlanTreeNode(expandedKeys)}
      </Tree>
      </div>
    )
  }
}
