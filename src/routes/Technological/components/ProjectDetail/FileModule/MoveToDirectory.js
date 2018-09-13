import React from 'react'
import { Input, Button, Modal, Tree, message } from 'antd'
import indexStyles from './index.less'

const TreeNode = Tree.TreeNode;


export default class MoveToDirectory extends React.Component {

  state={
    selectFolderId: '',
  }

  onCancel = () => {
    this.props.updateDatas({moveToDirectoryVisiblie: false})
  }
  onOk = () => {
    if(!this.state.selectFolderId) {
      message.warn('请选择一个目标文件夹')
      return false
    }
    this.props.updateDatas({moveToDirectoryVisiblie: false})
    const { datas: { fileList, selectedRowKeys, copyOrMove } } = this.props.model
    let chooseArray = []
    for(let i=0; i < selectedRowKeys.length; i++ ){
      chooseArray.push(fileList[selectedRowKeys[i]].file_id)
    }
    const file_ids = chooseArray.join(',')
    if(copyOrMove === '0'){ //移动0 复制1
      this.props.fileMove({
        file_ids,
        folder_id: this.state.selectFolderId
      })
    }else {
      this.props.fileCopy({
        file_ids,
        folder_id: this.state.selectFolderId
      })
    }

  }
  onSelect = (e) => {
    this.setState({
      selectFolderId: e[0]
    })
  }

  render () {
    const { datas: { moveToDirectoryVisiblie, copyOrMove, treeFolderData = {}} } = this.props.model

    const loop = data => {
      if(!data || !data.length){
        return
      }
      return data.map((item) => {
        if (item.child_data) {
          return (
            <TreeNode key={item.folder_id} title={item.folder_name}>
              {loop(item.child_data)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.folder_id} title={item.folder_name}/>;
      });
    }
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
              <TreeNode key={treeFolderData.folder_id} title={treeFolderData.folder_name}>
                {loop(treeFolderData.child_data)}
              </TreeNode>
            </Tree>
          </div>
        </Modal>
      </div>
    )
  }
}
