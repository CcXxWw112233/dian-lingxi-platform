import React from 'react'
import { Input, Button, Modal, Tree, message } from 'antd'
import indexStyles from './index.less'
import { connect } from 'dva'
const TreeNode = Tree.TreeNode
@connect(mapStateToProps)
export default class TreeGroupModal extends React.Component {
  state = {
    groups: ''
  }

  onCancel = () => {
    this.props.updateDatas({ TreeGroupModalVisiblie: false })
  }

  onOk = () => {
    const {
      currentBeOperateMemberId,
      batch_setting,
      batch_setting_ids
    } = this.props
    this.props.updateDatas({ TreeGroupModalVisiblie: false })
    let params = {
      groups: this.state.groups
    }
    if (batch_setting) {
      if (!batch_setting_ids.length) {
        message.warn('未选择人员')
        return
      }
      params.member_ids = batch_setting_ids
    } else {
      params.member_id = currentBeOperateMemberId
    }
    this.props.setMemberWitchGroup(params)
  }

  onCheck = e => {
    this.setState({
      groups: e.join(',')
    })
  }
  render() {
    const { TreeGroupModalVisiblie, groupTreeList = [] } = this.props
    const loop = data => {
      if (!data || !data.length) {
        return
      }
      return data.map(item => {
        if (item.child_data) {
          return (
            <TreeNode key={item.id} title={item.name}>
              {loop(item.child_data)}
            </TreeNode>
          )
        }
        return <TreeNode key={item.id} title={item.name} />
      })
    }
    return (
      <div>
        <Modal
          title={`选择分组`}
          visible={TreeGroupModalVisiblie} //moveToDirectoryVisiblie
          width={472}
          zIndex={1020}
          destroyOnClose
          maskClosable={false}
          okText="确认"
          cancelText="取消"
          onCancel={this.onCancel}
          onOk={this.onOk}
          okButtonProps={{
            disabled: groupTreeList && groupTreeList.length ? false : true
          }}
          getContainer={() =>
            document.getElementById('organizationMemberContainer') ||
            document.body
          }
        >
          <div className={indexStyles.MoveToDirectoryOut}>
            {groupTreeList && groupTreeList.length ? (
              <Tree checkable multiple onCheck={this.onCheck.bind(this)}>
                {loop(groupTreeList)}
              </Tree>
            ) : (
              <div>暂无分组</div>
            )}
          </div>
        </Modal>
      </div>
    )
  }
}

function mapStateToProps({
  organizationMember: {
    datas: {
      batch_setting,
      batch_setting_ids,
      TreeGroupModalVisiblie,
      groupTreeList = [],
      currentBeOperateMemberId
    }
  }
}) {
  return {
    batch_setting,
    batch_setting_ids,
    TreeGroupModalVisiblie,
    groupTreeList,
    currentBeOperateMemberId
  }
}
