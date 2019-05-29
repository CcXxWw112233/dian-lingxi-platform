import React, { Component } from 'react'
import { Checkbox } from 'antd'
import indexStyles from './index.less'

export default class CopyCheck extends Component{
  state = {
    parentChecked: false
  }
  parentCheckedChange = (e) => {
    const { code, board_id } = this.props //Tasks Flows Files
    const checked = e.target.checked
    this.setState({
      parentChecked: checked
    })
    const obj = {
      flows: {
        is_copy_flow_template: checked
      }
    }
    if('Flows' == code) {
      this.props.setCopyValue && this.props.setCopyValue(obj)
    }
  }
  renderCopyType = () => {
    const { code } = this.props //Tasks Flows Files
    const { parentChecked } = this.state
    let parentDescription = ''
    let childrenDescription = ''
    switch (code) {
      case 'Tasks':
        parentDescription = '复制原项目的任务列表'
        childrenDescription = '复制原项目的任务'
        break;
      case 'Flows':
        parentDescription = '复制原项目的流程模版'
        childrenDescription = ''
        break;
      case 'Files':
        parentDescription = '复制原项目的文件夹'
        childrenDescription = '复制文件'
        break;
      default:
        break
    }

    const container = (
      <div>
        <div className={indexStyles.checkParent}>
          <Checkbox checked={parentChecked} onChange={this.parentCheckedChange}>
            {parentDescription}
          </Checkbox>
        </div>
        {/*<div className={indexStyles.checkChildren}>*/}
          {/*<Checkbox >*/}
            {/*{childrenDescription}*/}
          {/*</Checkbox>*/}
        {/*</div>*/}
      </div>
    )
    return container
  }
  render() {
    return (
      <div className={indexStyles.copyCheckOut}>
        {this.renderCopyType()}
      </div>
    )
  }
}
