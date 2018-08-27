import React from 'react'
import CreateTaskStyle from './CreateTask.less'
import TaskItem from './TaskItemComponent/TaskItem'
import CreateItem from './TaskItemComponent/CreateItem'
import DrawerContent from './TaskItemComponent/DrawerContent'

import { Drawer } from 'antd'

export default class CreateTask extends React.Component {

  state = {
    drawerVisible: false,
  }
  setDrawerVisibleOpen() {
    this.setState({
      drawerVisible: true,
    })
  }
  setDrawerVisibleClose() {
    this.setState({
      drawerVisible: false,
    })
  }

  render() {
    const { datas:{ taskItemList } } = this.props.model

    return (
      <div className={CreateTaskStyle.outerMost} id={'outerMost'}>
        {taskItemList.map((value, key) => {
          return (
            <TaskItem key={key} setDrawerVisibleOpen={this.setDrawerVisibleOpen.bind(this)}></TaskItem>
          )
        })}
        <CreateItem  {...this.props} ></CreateItem>
        <Drawer
          placement="right"
          closable={false}
          onClose={this.setDrawerVisibleClose.bind(this)}
          visible={this.state.drawerVisible}
          width={520}
          maskStyle={{top: 64}}
          style={{marginTop: 64,}}
        >
          <DrawerContent />
        </Drawer>
      </div>
    )
  }
}
