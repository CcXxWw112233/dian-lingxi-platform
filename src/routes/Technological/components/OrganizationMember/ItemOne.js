//任务
import React from 'react'
import CreateTaskStyle from './CreateTask.less'
import { Icon, Checkbox, Collapse, Avatar, Button, Menu, Dropdown } from 'antd'
import QueueAnim from  'rc-queue-anim'

const Panel = Collapse.Panel

export default class ItemOne extends React.Component {
  state = {
    collapseClose: true, //折叠面板变化回调
  }
  handleMenuClick(e) {
    const { key } = e
    console.log(key)
  }
  passMember () {
    console.log('tongguo')
  }
  render() {
    const avatar = 'http://qiniu.new-di.com/29e198f63f2b24f3617790f6c8d078bf.jpg?e=1540297862&token=OhRq8qrZN_CtFP_HreTEZh-6KDu4BW2oW876LYzj:kfkZWU2wLmNyL2FNRTAu5P6wNVo='
    const operateMenu = () => {
      return (
        <Menu onClick={this.handleMenuClick.bind(this)}>
          <Menu.Item key={'1'}  style={{textAlign: 'center',padding:0,margin: 0}}>
            <div className={CreateTaskStyle.elseProjectMemu}>
              设为团队负责人
            </div>
          </Menu.Item>
          <Menu.Item key={'2'}  style={{textAlign: 'center',padding:0,margin: 0}}>
            <div className={CreateTaskStyle.elseProjectMemu}>
              研发
            </div>
          </Menu.Item>
          <Menu.Item key={'3'}  style={{textAlign: 'center',padding:0,margin: 0}}>
            <div className={CreateTaskStyle.elseProjectMemu}>
              人工智能
            </div>
          </Menu.Item>
          <Menu.Item key={'4'}  style={{textAlign: 'center',padding:0,margin: 0}}>
            <div className={CreateTaskStyle.elseProjectMemu}>
              大数据
            </div>
          </Menu.Item>
          <Menu.Item key={'5'}  style={{textAlign: 'center',padding:0,margin: 0}}>
            <div className={CreateTaskStyle.elseProjectDangerMenu}>
              删除
            </div>
          </Menu.Item>
        </Menu>
      );
    }

    return (
      <div  key={'2'} className={CreateTaskStyle.item_1} >
        <div className={CreateTaskStyle.item_1_top}>
          <div className={CreateTaskStyle.item_1_top_left}>
            <div className={CreateTaskStyle.avatar}>
              <Avatar size={40} icon="user" src={avatar}/>
            </div>
            <div  className={CreateTaskStyle.detail}>
              <div>张三</div>
              <div>成员</div>
            </div>
          </div>
          <div className={CreateTaskStyle.item_1_top_right}>
            <Dropdown overlay={operateMenu()}>
              <div><Icon type="ellipsis" theme="outlined" /></div>
            </Dropdown>
            <div><Icon type="down" theme="outlined" /></div>
          </div>
        </div>
        <div className={CreateTaskStyle.item_1_middle}>
          {[1,2,3,4,5].map((value, key) => {
            return(
              <div key={key}></div>
            )
          })}
        </div>
        <div className={CreateTaskStyle.item_1_bott} style={{display: 'block'}}>
          <div className={CreateTaskStyle.item_1_bott_con1}>
             <div className={CreateTaskStyle.item_1_bott_con1_item}>
               <div>职位：</div>
               <div>啊实打实大啊实打实大啊实打实大啊实打实大啊实打实大啊实打实大</div>
             </div>
            <div className={CreateTaskStyle.item_1_bott_con1_item}>
              <div>组织：</div>
              <div>啊实打实大</div>
            </div>
            <div className={CreateTaskStyle.item_1_bott_con1_item}>
              <div>邮箱：</div>
              <div>啊实打实大</div>
            </div>
            <div className={CreateTaskStyle.item_1_bott_con1_item}>
              <div>手机：</div>
              <div>啊实打实大</div>
            </div>
            <div className={CreateTaskStyle.item_1_bott_con1_item}>
              <div>微信：</div>
              <div>啊实打实大</div>
            </div>
          </div>
          <div className={CreateTaskStyle.item_1_bott_con2}>
            <div className={CreateTaskStyle.item_1_bott_con2_taskItem} style={{textDecoration: 'line-through' }}>
              这是一天任务 <i>#项目A</i>
            </div>
            <div className={CreateTaskStyle.item_1_bott_con2_taskItem}>
              这是一天任务 <i>#项目A</i>
            </div>
          </div>
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
