//任务
import React from 'react'
import CreateTaskStyle from './CreateTask.less'
import { Icon, Checkbox, Collapse, Avatar } from 'antd'
import QueueAnim from  'rc-queue-anim'

const Panel = Collapse.Panel

export default class ItemTwo extends React.Component {
  state = {
    collapseClose: true, //折叠面板变化回调
  }
  render() {
    const avatar = 'http://qiniu.new-di.com/29e198f63f2b24f3617790f6c8d078bf.jpg?e=1540297862&token=OhRq8qrZN_CtFP_HreTEZh-6KDu4BW2oW876LYzj:kfkZWU2wLmNyL2FNRTAu5P6wNVo='
    return (
      <div  key={'2'} className={CreateTaskStyle.item_2} >
        <div className={CreateTaskStyle.avatar}>
          <Avatar size={40} icon="user" src={avatar}/>
        </div>
        <div  className={CreateTaskStyle.detail}>
           <div>张三</div>
           <div>成员</div>
        </div>
      </div>
    )
  }
}

const customPanelStyle = {
  background: '#f5f5f5',
  borderRadius: 4,
  fontSize:12,
  color: '#8c8c8c',
  border: 0,
  overflow: 'hidden',
};
