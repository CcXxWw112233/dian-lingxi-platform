import { Dropdown, Menu, message, Popconfirm } from 'antd'
import React from 'react'
import { MESSAGE_DURATION_TIME, NOT_HAS_PERMISION_COMFIRN } from '../../../../../../../globalset/js/constant'
import { PROJECTDETAILMODEL } from '../../../../../../../models/technological/projectDetail/projectDetailTask'
import { deleteTask } from '../../../../../../../services/technological/task'
import DEvent, { CARDREMOVE } from '../../../../../../../utils/event'
import styles from './MoreOperation.less'
const lx_utils = undefined

export default class MoreOperation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  /** 删除任务 */
  removeTask = () => {
    this.setState({
      visible: false
    })
    this.props.dispatch({
      type: 'publicTaskDetailModal/deleteTaskVTwo',
      payload: {
        id: this.props.data.id,
        calback: () => {
          DEvent.firEvent(CARDREMOVE, { card_id: this.props.data.id })
          // 删除卡片也需要调用圈子关闭联动
          setTimeout(
            () =>
              lx_utils && lx_utils.setCommentData(this.props.data.id || null),
            200
          )
        }
      }
    })
  }

  /** 检测禁用是方法还是bool */
  checkDisabled = () => {
    const { disabled } = this.props
    if (disabled instanceof Function) {
      return disabled.call(this, this.props.valueKey)
    }
    return disabled
  }

  /** 菜单点击事件 */
  menuclick = ({ key }) => {
    if (key === 'remove') {
      if (this.checkDisabled()) {
        this.setState({
          visible: false
        })
        message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
        return
      }
    }
    this.setState({
      visible: true
    })
  }

  render() {
    const { visible } = this.state
    const menu = (
      <Menu onClick={this.menuclick}>
        <Menu.Item key="remove">
          <Popconfirm
            title="确定需要删除此任务吗？"
            onConfirm={this.removeTask}
            onCancel={() => this.setState({ visible: false })}
          >
            <div onClick={e => e.stopPropagation()}>
              <span className={styles.removeItem}>&#xe720;</span>{' '}
              <span>删除</span>
            </div>
          </Popconfirm>
        </Menu.Item>
      </Menu>
    )
    return (
      <Dropdown
        overlay={menu}
        visible={visible}
        onVisibleChange={visible => this.setState({ visible })}
        trigger={['click']}
        overlayClassName={styles.moreDropdown}
      >
        {this.props.children}
      </Dropdown>
    )
  }
}
