import React from 'react'
import indexstyles from '../../index.less'
import { Icon } from 'antd'
import Cookies from 'js-cookie'

export default class TaskItem extends React.Component {
  itemOneClick(e) {
    // e.stopPropagation();
    // const { itemValue, taskGroupListIndex, taskGroupListIndex_index } = this.props
    // const {  datas:{ taskGroupList } } = this.props.model
    // const { card_id, is_realize = '0' } = itemValue
    const {  datas:{ todoList=[] } } = this.props.model
    const { itemValue = {}, itemKey } = this.props
    const { is_realize, board_id, board_name, name, id } = itemValue
    console.log(itemKey)
    const obj = {
      card_id: id,
      is_realize: is_realize === '1' ? '0' : '1'
    }
    todoList[itemKey]['is_realize'] = is_realize === '1' ? '0' : '1'
    this.props.updateDatas({todoList})
    this.props.completeTask(obj)
  }
  gotoBoardDetail(board_id) {
    Cookies.set('board_id', board_id,{expires: 30, path: ''})
    this.props.routingJump('/technological/projectDetail')
  }
  render() {
    const { itemValue = {} } = this.props
    const { is_realize, board_id, board_name, name } = itemValue
    return (
      <div className={indexstyles.taskItem}>
        <div className={is_realize === '1' ? indexstyles.nomalCheckBoxActive: indexstyles.nomalCheckBox} onClick={this.itemOneClick.bind(this)}>
          <Icon type="check" style={{color: '#FFFFFF',fontSize:12, fontWeight:'bold'}}/>
        </div>
        <div><span style={{textDecoration:is_realize === '1'? 'line-through': 'none'}}>{name}</span><span style={{marginLeft: 6,color: '#8c8c8c', cursor: 'pointer',}} onClick={this.gotoBoardDetail.bind(this, board_id)}>#{board_name}</span></div>
      </div>
    )
  }
}
