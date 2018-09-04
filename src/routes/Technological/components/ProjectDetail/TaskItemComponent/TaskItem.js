//分组列表
import React from 'react'
import CreateTaskStyle from '../CreateTask.less'
import { Icon, Checkbox, Collapse, Input, message } from 'antd'
import QueueAnim from  'rc-queue-anim'
import ItemOne from  './ItemOne'
import ItemTwo from  './ItemTwo'
import {MESSAGE_DURATION_TIME} from "../../../../../globalset/js/constant";

const Panel = Collapse.Panel

export default class TaskItem extends React.Component {

  state = {
    isAddEdit: false
  }
  gotoAddItem() {
    this.setState({
      isAddEdit:true,
    })
  }
  addItem(data,e) {
    const name =  e.target.value
    if(name){
      const obj = Object.assign(data,{name})
      this.props.addTask(obj)
    }
    this.setState({
      isAddEdit:false,
    })
  }
  render() {
    const { isAddEdit } = this.state
    const { taskItemValue = {} } = this.props
    const { projectDetailInfoData = {} } = this.props.model.datas
    const { board_id } = projectDetailInfoData
    const { list_name, list_id, card_data = [] } = taskItemValue
    return (
      <div className={CreateTaskStyle.taskItem}>
        <div className={CreateTaskStyle.title}>
          {list_name}<Icon type="right" className={[CreateTaskStyle.nextIcon]}/>
        </div>
        <QueueAnim >
          {card_data.map((value,key) => {
            return(
              <ItemTwo itemValue={value} {...this.props}
                       taskGroupListIndex_index={key}
                       key={key} {...this.props} />
            )
          })}
          {!isAddEdit ? (
            <div  key={'add'} className={CreateTaskStyle.addItem} onClick={this.gotoAddItem.bind(this)}>
              <Icon type="plus-circle-o" />
            </div>
          ) : (
            <div  key={'add'} className={CreateTaskStyle.addItem} >
              <Input  onPressEnter={this.addItem.bind(this,{board_id, list_id})} onBlur={this.addItem.bind(this,{board_id, list_id})} autoFocus={true}/>
            </div>
          )}
        </QueueAnim>
      </div>
    )
  }
}
