import React, { Component } from 'react'
import { Popover, Button, Tree } from 'antd'
import indexStyles from './index.less'
import globalsetStyles from '@/globalset/css/globalClassName.less'

const { TreeNode } = Tree;

export default class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  handleVisibleChange = visible => {
    this.setState({
      visible: visible,
    });
  }

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.title} key={item.key} {...item} />;
    });

  renderSelectedTree = () => {
    const treeData = [
      {
        title: '0-0',
        key: '0-0',
        children: [
          {
            title: '0-0-0',
            key: '0-0-0',
          },
          {
            title: '0-0-1',
            key: '0-0-1',
          },
          {
            title: '0-0-2',
            key: '0-0-2',
          },
        ],
      },
      {
        title: '0-1',
        key: '0-1',
        children: [
          { title: '0-1-0-0', key: '0-1-0-0' },
          { title: '0-1-0-1', key: '0-1-0-1' },
          { title: '0-1-0-2', key: '0-1-0-2' },
        ],
      },
      {
        title: '0-2',
        key: '0-2',
      },
    ];
    return (
      <div className={`${indexStyles.treeWrapper} ${globalsetStyles.global_vertical_scrollbar}`}>
        <Tree
          checkable
        >
          {this.renderTreeNodes(treeData)}
        </Tree>
      </div>
    )
  }

  renderButton = () => {
    return (
      <div className={indexStyles.fileds_button}>
        <Button>重置</Button>
        <Button>确定</Button>
      </div>
    )
  }

  renderContent = () => {
    return (
      <div>
        <div>{this.renderSelectedTree()}</div>
        <div>{this.renderButton()}</div>
      </div>
    )
  }

  render() {
    const { children, placement, getPopupContainer } = this.props
    return (
      <div>
        <Popover
          getPopupContainer={getPopupContainer ? () => getPopupContainer : triggerNode => triggerNode.parentNode}
          placement={placement ? placement : 'bottom'}
          title={<div className={indexStyles.popover_title}>添加字段</div>}
          trigger="click"
          visible={this.state.visible}
          onVisibleChange={this.handleVisibleChange}
          content={this.renderContent()}
        >
          {children}
        </Popover>
      </div>
    )
  }
}

Index.defaultProps = {

}
