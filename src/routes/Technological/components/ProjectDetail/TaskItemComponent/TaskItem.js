import React from 'react'
import CreateTaskStyle from '../CreateTask.less'
import { Icon, Checkbox, Collapse } from 'antd'
import QueueAnim from  'rc-queue-anim'
import ItemOne from  './ItemOne'
import ItemTwo from  './ItemTwo'

const Panel = Collapse.Panel

export default class TaskItem extends React.Component {

  addItem() {
    // console.log(this)
    this.props.setDrawerVisibleOpen()
  }
  render() {
    return (
      <div className={CreateTaskStyle.taskItem}>
        <div className={CreateTaskStyle.title}>
          任务看板形态<Icon type="right" className={[CreateTaskStyle.nextIcon]}/>
        </div>
        <QueueAnim >
          <ItemOne key={'1'}/>
          <ItemTwo key={'2'}/>

          <div  key={'add'} className={CreateTaskStyle.addItem} onClick={this.addItem.bind(this)}>
            <Icon type="plus-circle-o" />
          </div>
        </QueueAnim>
      </div>
    )
  }
}
