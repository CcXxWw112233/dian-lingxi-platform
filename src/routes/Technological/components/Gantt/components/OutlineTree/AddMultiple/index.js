import React, { Component } from 'react'
import { Menu, Modal, Button } from 'antd'
import globalStyles from '@/globalset/css/globalClassName.less'
import TreeNode from '../TreeNode.js'

export default class AddMultipleIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      add_mutiple_visible: false
    }
  }
  handleSelected = ({ key }) => {
    console.log('sssssaaa', key)
    const { setInputAddType, setAddMultipleVisible } = this.props
    setInputAddType(key)
    setAddMultipleVisible(true)
  }
  renderMenu = () => {
    const { input_add_type } = this.props
    return (
      <div className={`${globalStyles.global_card}`}>
        <Menu
          onClick={this.handleSelected}
          defaultSelectedKeys={[input_add_type]}
        >
          <Menu.Item key={'1'}>新建里程碑</Menu.Item>
          <Menu.Item key={'2'}>新建任务</Menu.Item>
        </Menu>
      </div>
    )
  }

  render() {
    return <>{this.renderMenu()}</>
  }
}
