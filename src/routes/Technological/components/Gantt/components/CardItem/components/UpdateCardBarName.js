import { Input, message } from 'antd'
import React from 'react'
import styles from './UpdateCardBarName.less'
import ReactDOM from 'react-dom'
import { updateTaskVTwo } from '../../../../../../../services/technological/task'
import { GANTTMODEL } from '../../../../../../../models/technological/workbench/gantt/gantt'

/** 更新任务条名称的组件 */
export default class UpdateCardBarName extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /** 名称 */
      cardbarname: props.data?.name || ''
    }
  }
  componentDidMount() {
    this.node = ReactDOM.findDOMNode(this)
  }

  /** 保存名称 */
  saveName = () => {
    console.log(this.state.cardbarname)
    const { cardbarname } = this.state
    const { handleOverEdit } = this.props
    if (!cardbarname || cardbarname === this.props.data.name) {
      handleOverEdit && handleOverEdit({ name: this.props.data.name })
    } else {
      updateTaskVTwo({
        card_name: cardbarname,
        name: cardbarname,
        card_id: this.props.data.id
      })
        .then(res => {
          if (res.code === '0') {
            message.success('更新成功')
            handleOverEdit && handleOverEdit({ name: cardbarname })
            this.props.dispatch({
              type: GANTTMODEL.namespace + '/' + GANTTMODEL.updateListGroup,
              payload: {
                datas: [
                  {
                    ...this.props.data,
                    name: cardbarname
                  }
                ]
              }
            })
            return res
          }
          return Promise.reject(res)
        })
        .catch(err => {
          message.warn(err.message)
          return Promise.reject(err)
        })
    }
  }

  /** 键盘敲击
   * @param {React.KeyboardEvent} e 键盘事件
   */
  handlePress = e => {
    e.stopPropagation()
    const escCode = 'Escape'
    if (escCode === e.key) {
      // this.saveName()
      e.target?.blur()
    }
  }

  render() {
    /** 是否点击了可以修改名称 */
    const show = this.props.isOpenEditName
    const { children, parentNode = this.node } = this.props
    if (show) {
      return ReactDOM.createPortal(
        <div className={styles.updateNameContainer}>
          <Input
            onKeyDown={this.handlePress}
            placeholder="输入名称"
            onClick={e => e.target?.focus()}
            onBlur={this.saveName}
            size="small"
            autoFocus
            defaultValue={this.props.data.name}
            onChange={e =>
              this.setState({ cardbarname: e.target.value.trim() })
            }
            value={this.state.cardbarname}
            style={{ width: '100%', height: '100%' }}
            onPressEnter={e => e.target?.blur()}
          />
        </div>,
        parentNode
      )
    } else return children
  }
}
