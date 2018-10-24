//任务
import React from 'react'
import CreateTaskStyle from './CreateTask.less'
import { Icon, Checkbox, Collapse, Avatar, Button, Menu, Dropdown, Modal } from 'antd'
import QueueAnim from  'rc-queue-anim'

const Panel = Collapse.Panel

export default class ItemOne extends React.Component {
  state = {
    isShowBottDetail: false, //
    bott_id: null
  }
  componentWillMount() {
    const { itemKey } = this.props
    this.setState({
      bott_id: `bott_${itemKey * 100 + 1}`
    })
  }
  handleMenuClick(e) {
    const { key } = e
    console.log(key)
  }
  //删除
  deleteConfirm(parentKey ) {
    const that = this
    Modal.confirm({
      title: '确认删除？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        that.deleteGroupItem(parentKey)
      }
    });
  }
  deleteMember(parentKey) {
  }

  //设置转动出现详情
  setIsShowBottDetail() {
    const { bott_id } = this.state
    const element = document.getElementById(bott_id)
    this.setState({
      isShowBottDetail: !this.state.isShowBottDetail
    },function () {
      this.funTransitionHeight(element, 500,  this.state.isShowBottDetail)
    })
  }
  funTransitionHeight = (element, time, type) => { // time, 数值，可缺省
    if (typeof window.getComputedStyle == "undefined") return;
    const height = window.getComputedStyle(element).height;
    element.style.transition = "none";    // 本行2015-05-20新增，mac Safari下，貌似auto也会触发transition, 故要none下~
    element.style.height = "auto";
    const targetHeight = window.getComputedStyle(element).height;
    element.style.height = height;
    element.offsetWidth;
    if (time) element.style.transition = "height "+ time +"ms";
    element.style.height = type ? targetHeight : 0;
  };

  render() {
    const { isShowBottDetail } = this.state
    const { bott_id } = this.state
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
      <div  className={CreateTaskStyle.item_1} >
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
            <div className={isShowBottDetail ? CreateTaskStyle.upDown_up: CreateTaskStyle.upDown_down}><Icon  onClick={this.setIsShowBottDetail.bind(this)} type="down" theme="outlined" style={{color: '#595959'}}/></div>
          </div>
        </div>
        <div className={CreateTaskStyle.item_1_middle}>
          {[1,2,3,4,5].map((value, key) => {
            return(
              <div key={key}></div>
            )
          })}
        </div>
        <div className={!isShowBottDetail? CreateTaskStyle.item_1_bott_normal:CreateTaskStyle.item_1_bott_show} id={bott_id}
             style={{paddingTop: isShowBottDetail?'10px': 0,paddingBottom: isShowBottDetail?'10px': 0}}
        >
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
