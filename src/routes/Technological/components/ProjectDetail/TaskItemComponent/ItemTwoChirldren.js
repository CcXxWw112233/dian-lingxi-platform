//子任务
import React from 'react'
import CreateTaskStyle from '../CreateTask.less'
import { Icon, Checkbox, Collapse } from 'antd'
import QueueAnim from  'rc-queue-anim'
const Panel = Collapse.Panel

export default class ItemTwoChirldren extends React.Component {
  state = {
    isCheck: false
  }
  itemOneClick() {
    this.setState({
      isCheck: !this.state.isCheck
    })
  }
  render() {
    const { isCheck } = this.state
    return (
      <div key={'1'} className={CreateTaskStyle.item_2_chirld} onClick={this.itemOneClick.bind(this)}>
        <div className={isCheck? CreateTaskStyle.nomalCheckBoxActive: CreateTaskStyle.nomalCheckBox}>
          <Icon type="check" style={{color:isCheck ? '#FFFFFF': '#F5F5F5',fontSize:12, fontWeight:'bold'}}/>
        </div>
        <div>安康市大家可能速度看是多么安康市大家可能速度看是多么安</div>
      </div>
    )
  }
}

