import React from 'react'
import indexstyles from '../index.less'
import { Icon } from 'antd'

export default class TaskItem extends React.Component {
  itemOneClick(e) {
    // e.stopPropagation();
    // const { itemValue, taskGroupListIndex, taskGroupListIndex_index } = this.props
    // const {  datas:{ taskGroupList } } = this.props.model
    // const { card_id, is_realize = '0' } = itemValue
    // const obj = {
    //   card_id,
    //   is_realize: is_realize === '1' ? '0' : '1'
    // }
    // taskGroupList[taskGroupListIndex]['card_data'][taskGroupListIndex_index]['is_realize'] = is_realize === '1' ? '0' : '1'
    // this.props.updateDatas({taskGroupList})
    // this.props.completeTask(obj)
  }
  render() {
    const { itemValue = {} } = this.props
    const { is_realize } = itemValue
    return (
      <div className={indexstyles.taskItem}>
        <div className={is_realize === '1' ? indexstyles.nomalCheckBoxActive: indexstyles.nomalCheckBox} onClick={this.itemOneClick.bind(this)}>
          <Icon type="check" style={{color: '#FFFFFF',fontSize:12, fontWeight:'bold'}}/>
        </div>
        <div>42as3d21a32sfd13adf42as3d21a32sf<span style={{marginLeft: 6,color: '#8c8c8c', cursor: 'pointer'}}>#项目A</span></div>
      </div>
    )
  }
}
