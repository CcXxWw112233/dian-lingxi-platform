//任务
import React from 'react'
import CreateTaskStyle from './CreateTask.less'
import { Icon, Checkbox, Collapse, Avatar, Button, Menu, Dropdown, Modal } from 'antd'
import QueueAnim from  'rc-queue-anim'
import Cookies from 'js-cookie'
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
    const { itemValue, parentItemValue } = this.props
    const { member_id } = itemValue
    this.props.updateDatas({
      currentBeOperateMemberId: member_id,
    })
    switch (key) {
      case 'discontinue':
        this.discontinueConfirm(member_id)
        break
      case 'remove':
        this.removeConfirm()
        break
      case 'setGroup':
        this.props.updateDatas({
          TreeGroupModalVisiblie: true,
        })
        break
      default:
        //设置角色
        const role_id = key.replace('role_', '')
        const group_id = parentItemValue.id
        this.props.setMemberRole({
          role_id,
          group_id,
          member_id
        })
        break
    }
  }

  //移出
  removeConfirm(member_id) {
    const that = this
    Modal.confirm({
      title: '确认从该分组中移出该成员？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        that.removeMember()
      }
    });
  }
  removeMember() {
    const { itemValue, parentItemValue } = this.props
    const { member_id } = itemValue
    const group_id = parentItemValue.id
    const org_id = Cookies.get('org_id')
    this.props.removeMembersWithGroup({member_id,group_id,org_id})
  }
  //停用
  discontinueConfirm(member_id) {
    const that = this
    Modal.confirm({
      title: '确认停用该成员？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        that.discontinueMember(member_id)
      }
    });
  }
  discontinueMember(member_id) {
    this.props.discontinueMember({member_id})
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
    const { isShowBottDetail, bott_id } = this.state
    const { itemValue, parentItemValue } = this.props
    const { is_default } = parentItemValue
    const { member_id, avatar, name, role_name } = itemValue
    const {datas: { roleList = []}} = this.props.model
    const operateMenu = () => {
      return (
        <Menu onClick={this.handleMenuClick.bind(this)}>
          <Menu.SubMenu title="设置角色" key={'role'}>
            {roleList.map((value, key) => {
              return(
                <Menu.Item key={`role_${value.id}`}  style={{textAlign: 'center',padding:0,margin: 0}}>
                  <div className={CreateTaskStyle.elseProjectMemu}>
                    {value.name}
                  </div>
                </Menu.Item>
              )
            })}
          </Menu.SubMenu>
          <Menu.Item key={'setGroup'}  style={{textAlign: 'center',padding:0,margin: 0}}>
            <div className={CreateTaskStyle.elseProjectMemu}>
              设置分组
            </div>
          </Menu.Item>
          {is_default !== '1' ? (
            <Menu.Item key={'remove'}  style={{textAlign: 'center',padding:0,margin: 0}}>
              <div className={CreateTaskStyle.elseProjectMemu}>
                移出分组
              </div>
            </Menu.Item>
           ) : ('')}
          <Menu.Item key={'discontinue'}  style={{textAlign: 'center',padding:0,margin: 0}}>
            <div className={CreateTaskStyle.elseProjectDangerMenu}>
              停用
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
              <div>{name}</div>
              <div>{role_name}</div>
            </div>
          </div>
          <div className={CreateTaskStyle.item_1_top_right}>
            <Dropdown overlay={operateMenu()}>
              <div><Icon type="ellipsis" theme="outlined" /></div>
            </Dropdown>
            <div className={isShowBottDetail ? CreateTaskStyle.upDown_up: CreateTaskStyle.upDown_down}><Icon  onClick={this.setIsShowBottDetail.bind(this)} type="down" theme="outlined" style={{color: '#595959'}}/></div>
          </div>
        </div>
        <div className={CreateTaskStyle.item_1_middle} style={{display: 'none'}}>
          {[1,2,3,4,5].map((value, key) => {
            return(
              <div key={key}></div>
            )
          })}
        </div>
        <div className={!isShowBottDetail? CreateTaskStyle.item_1_bott_normal:CreateTaskStyle.item_1_bott_show} id={bott_id}
             style={{paddingTop: isShowBottDetail?'10px': 0,paddingBottom: isShowBottDetail?'10px': 0, display: 'none'}}
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
