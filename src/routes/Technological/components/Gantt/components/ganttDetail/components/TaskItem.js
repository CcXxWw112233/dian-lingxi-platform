import React from 'react'
import taskItemStyles from './taskItem.less'
import { Icon, Input, Button, DatePicker, Dropdown, Menu, Avatar, Tooltip, Popconfirm, } from 'antd'
import { timestampToTimeNormal, timeToTimestamp } from '../../../../../../../utils/util'
import globalStyles from '../../../../../../../globalset/css/globalClassName.less'
const TextArea = Input.TextArea

export default class DCAddChirdrenTaskItem extends React.Component{

  state = {
    isCheck: false,
    localChildTaskName: '',
    isInEditTaskName: false,
  }
  deleteConfirm = () => {}
  render() {
    const { chirldTaskItemValue = {}, chirldDataIndex } = this.props
    const { card_id, card_name, due_time, is_realize = '0' ,executors = []} = chirldTaskItemValue
    const data = []//任务执行人列表
    const { localChildTaskName, isInEditTaskName} = this.state

    let executor = {//任务执行人信息
      user_id: '',
      user_name: '',
      avatar: '',
    }
    return (
      <div className={`${taskItemStyles.taskItem}`}>
        <div className={`${taskItemStyles.item_1} ${taskItemStyles.pub_hover}`} >

          {/*完成*/}
          <div className={is_realize !== '1' ? taskItemStyles.nomalCheckBoxActive: taskItemStyles.nomalCheckBox}>
            <Icon type="check" style={{color: '#FFFFFF',fontSize: 12, fontWeight: 'bold'}}/>
          </div>

          {/*名称*/}
          <div style={{wordWrap: 'break-word', paddingTop:2}} >
            {'这是名称这是名称这是名称这是名称这是名称这是名称'}
          </div>
          {/*日期*/}
          <div style={{color: '#d5d5d5'}}>2019/2/3 12：22</div>
          <Avatar size={16} src={executor.avatar} style={{fontSize: 14,margin: '0 12px 0 12px'}}>
            {executor.name || '佚' }
          </Avatar>

          {/*cuozuo*/}
          <Popconfirm onConfirm={this.deleteConfirm.bind(this, {card_id, chirldDataIndex})} title={'删除该子任务？'}>
            <div className={`${globalStyles.authTheme} ${taskItemStyles.deletedIcon}`} style={{fontSize: 16}}>&#xe70f;</div>
          </Popconfirm>
        </div>
      </div>
    )
  }
}
