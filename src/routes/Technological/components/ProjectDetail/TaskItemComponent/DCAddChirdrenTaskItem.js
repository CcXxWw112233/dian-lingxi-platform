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
    return (
      <div   className={DrawerContentStyles.taskItem}>
      <div key={'1'} className={DrawerContentStyles.item_1} onClick={this.itemOneClick.bind(this)}>
        <div className={isCheck? DrawerContentStyles.nomalCheckBoxActive: DrawerContentStyles.nomalCheckBox}>
          <Icon type="check" style={{color: '#FFFFFF',fontSize:12, fontWeight:'bold'}}/>
        </div>
        <div>安康市大家可能速度看是多么安康市大家可能速度看是多么安</div>
      </div>
      </div>
    )
  }
}
