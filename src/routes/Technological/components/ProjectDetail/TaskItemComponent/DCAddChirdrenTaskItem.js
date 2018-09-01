import React from 'react'
import DrawerContentStyles from './DrawerContent.less'
import { Icon, Input, Button, DatePicker, Dropdown, Menu } from 'antd'
const TextArea = Input.TextArea

export default class DCAddChirdrenTaskItem extends React.Component{

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
    const { chirldTaskItemValue } = this.props
    const { card_id, card_name, due_time, is_check = false } = chirldTaskItemValue
    return (
      <div   className={DrawerContentStyles.taskItem}>
      <div key={'1'} className={DrawerContentStyles.item_1} >
        <div className={isCheck? DrawerContentStyles.nomalCheckBoxActive: DrawerContentStyles.nomalCheckBox} onClick={this.itemOneClick.bind(this)}>
          <Icon type="check" style={{color: '#FFFFFF',fontSize:12, fontWeight:'bold'}}/>
        </div>
        <div>{card_name}<span style={{color: '#d5d5d5'}}>{due_time}</span></div>
      </div>
      </div>
    )
  }
}
