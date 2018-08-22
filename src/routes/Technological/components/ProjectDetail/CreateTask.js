import React from 'react'
import CreateTaskStyle from './CreateTask.less'
import TaskItem from './TaskItemComponent/TaskItem'
import CreateItem from './TaskItemComponent/CreateItem'

export default class CreateTask extends React.Component {
  render() {
    const { datas:{ taskItemList } } = this.props.model

    return (
      <div className={CreateTaskStyle.outerMost}>
        {taskItemList.map((value, key) => {
          return (
            <TaskItem key={key}></TaskItem>
          )
        })}
        <CreateItem  {...this.props}></CreateItem>
      </div>
    )
  }
}
