import React from 'react'
import { Modal, Tree, Icon, } from 'antd'
import globalStyles from '@/globalset/css/globalClassName.less'
import styles from './index.less'

const TreeNode = Tree.TreeNode;

export default class ArchiveSelect extends React.Component {

  constructor(props) {
    super(props)
    const { board_id, board_name } = this.props
    const treeData = {
      id: board_id,
      name: board_name,
      child_data: [
        {
          id: '0',
          name: '0',
          child_data: [
            {
              id: '0-1',
              name: '0-1',
            },
            {
              id: '0-2',
              name: '0-2',
            },
          ]
        },
        {
          id: '1',
          name: '1',
          child_data: [
            {
              id: '1-1',
              name: '1-1',
            },
            {
              id: '1-2',
              name: '1-2',
            },
          ]
        }
      ]
    }

    this.state = {
      treeData
    }
  }
  static defaultProps = {
    visble: false,
    board_id: '',
    board_name: '',
    setVisible: function () { },
    onOk: function () {

    }
  }
  state = {
    selectFolderId: '',
  }

  onCancel = () => {
    this.props.setVisible()
  }


  onOk = () => {
    const { board_id } = this.props
    const params = {
      board_id
    }
    this.props.onOk(params)
  }
  onCheck = (checkedKeys, info) => {
    // debugger
    console.log('onCheck', checkedKeys, info);
  }

  loop = data => {
    if (!data || !data.length) {
      return ''
    }
    return data.map((item) => {
      if (item.child_data) {
        return (
          <TreeNode
            icon={<i className={globalStyles.authTheme}>&#xe6f0;</i>}
            key={item.id}
            title={item.name}>
            {this.loop(item.child_data)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={item.name} />;
    });
  }

  render() {
    const { treeData = {} } = this.state
    const { visble, board_id } = this.props
    return (
      <div >
        <Modal
          title={`选择存入档案的文件`}
          visible={visble} //
          width={560}
          zIndex={1020}
          destroyOnClose
          okText="确认"
          cancelText="取消"
          onCancel={this.onCancel}
          onOk={this.onOk}
        >
          <div style={{ maxHeight: 460, overflowY: 'auto' }} className={styles.main}>
            <Tree
              onCheck={this.onCheck}
              defaultExpandedKeys={[board_id]}
              checkable>
              <TreeNode
                icon={<Icon type="caret-down" style={{ fontSize: 20, color: 'rgba(0,0,0,.45)' }} />}
                key={treeData.id}
                title={treeData.name}>
                {this.loop(treeData.child_data)}
              </TreeNode>
            </Tree>
          </div>
        </Modal>
      </div >
    )
  }
}
