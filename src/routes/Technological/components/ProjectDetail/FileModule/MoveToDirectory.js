import React from 'react'
import { Input, Button, Modal, Tree } from 'antd'
import indexStyles from './index.less'

const TreeNode = Tree.TreeNode;

const  data = {
  name: '0',
  id: '0.0',
  child_data: [
    {
      name: '1-1',
      id: '1.1',
      child_data: [
        {
          id: '1.1.1',
          name: '1-1-1',
          child_data: []
        }
      ]
    },
    {
      id: '1.2',
      name: '1-2'
    }
  ]
}

export default class MoveToDirectory extends React.Component {

  onCancel = () => {
    this.props.updateDatas({moveToDirectoryVisiblie: false})
  }
  onOk = () => {
    this.props.updateDatas({moveToDirectoryVisiblie: false})
  }
  onSelect = (e) => {
    console.log(e)
  }

  render () {
    const { datas: { moveToDirectoryVisiblie, copyOrMove} } = this.props.model

    const loop = data => data.map((item) => {
      if (item.child_data) {
        return (
          <TreeNode key={item.id} title={item.name}>
            {loop(item.child_data)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={item.name}/>;
    });
    return (
      <div>
        <Modal
          title={`${copyOrMove === '1' ? '复制' : '移动'}文件`}
          visible={moveToDirectoryVisiblie} //
          width={472}
          zIndex={1006}
          destroyOnClose
          okText="确认"
          cancelText="取消"
          onCancel={this.onCancel}
          onOk={this.onOk}
        >
          <div className={indexStyles.MoveToDirectoryOut}>
            <Tree onSelect={this.onSelect}>
              <TreeNode key={data.id} title={data.name}>
                {loop(data.child_data)}
              </TreeNode>
            </Tree>
          </div>
        </Modal>
      </div>
    )
  }
}
