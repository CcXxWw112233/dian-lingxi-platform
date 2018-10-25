import React from 'react';
import indexStyle from './index.less'
import { Link } from 'dva/router'
import { Input, Icon, Menu, Dropdown, Tooltip, Tabs, Card, Modal, Button} from 'antd'
import Cookies from 'js-cookie'
import CreateOrganizationModal from './CreateOrganizationModal'
import {color_4 } from '../../../../globalset/js/styles'
import ShowAddMenberModal from '../OrganizationMember/ShowAddMenberModal'

const TabPane = Tabs.TabPane;
const SubMenu = Menu.SubMenu
export default class HeaderNav extends React.Component{
  constructor(props) {
    super(props)
  }
  state = {
    menuVisible: false,
    createOrganizationVisable: false,
    ShowAddMenberModalVisibile: false,
  };

  //蓝色按钮下拉菜单
  handleMenuClick = (e) => {
    const { key } = e
    this.setState({ menuVisible: false });
    switch(key) {
      case '1':
        break
      case '2':
        this.props.routingJump('/technological/organizationMember')
        break;
      case '3':
        this.props.routingJump('/organization')
        break
      case '4':
        this.setShowAddMenberModalVisibile()
        break;
      case '5':
        break
      case '6':
        this.props.routingJump('/technological/accoutSet')
        break;
      case '7':
        break
      case '8':
        break
      case '9':
        break
      case '10':
        //创建组织的弹窗打开
        this.setCreateOrgnizationOModalVisable()
        break
      //这里是选择组织
      default:
        const { datas: {currentUserOrganizes = []}} = this.props.model
        for(let val of currentUserOrganizes) {
          if(key === val['id']){
            Cookies.set('org_id',val.id,{expires: 30, path: ''})
            sessionStorage.setItem('currentSelectOrganize', JSON.stringify(val))
            this.props.updateDatas({currentSelectOrganize: val})
            break
          }
        }
        break
    }
    this.props.updateDatas({
      naviHeadTabIndex: '4'
    })
  }
  //下拉菜单显示状态改变
  handleVisibleChange = (flag) => {
    this.setState({ menuVisible: flag });
  }
  //tab
  tabItemClick = (key) => {
    let route
    switch (key) {
      case '1':
        route = 'newsDynamic'
        break
      case '2':
        route = 'workbench'
        break
      case '3':
        route = 'project'
        break
      default:
        break
    }
    this.props.updateDatas({
      naviHeadTabIndex: key
    })
    this.props.routingJump(`/technological/${route}`)
  }
  logout() {
    const that = this;
    Modal.confirm({
      title: '确定退出登录？',
      okText: '确认',
      zIndex: 2000,
      onOk: that.props.logout,
      cancelText: '取消',
    });

  }

  //创建或加入组织
  setCreateOrgnizationOModalVisable() {
    this.setState({
      createOrganizationVisable: !this.state.createOrganizationVisable
    })
  }
  //添加组织成员操作
  setShowAddMenberModalVisibile() {
    this.setState({
      ShowAddMenberModalVisibile: !this.state.ShowAddMenberModalVisibile
    })
  }
  addMembers(data) {
    const { users } = data
    const { datas = {} } = this.props.model
    const {  currentSelectOrganize = {} } = datas
    const { id } = currentSelectOrganize
    this.props.inviteJoinOrganization({
      members: users,
      org_id: id
    })
  }
  render() {
    const { datas = {} } = this.props.model
    const { userInfo = {}, currentUserOrganizes = [] , currentSelectOrganize = {} } = datas //currentUserOrganizes currentSelectOrganize组织列表和当前组织
    const { aboutMe, avatar, createTime, email, fullName, id, lastLoginTime, mobile, nickname, phone, qq, status, updateTime, username, wechat,} = Cookies.get('userInfo')? JSON.parse(Cookies.get('userInfo')): {}
    const orgnizationName = currentSelectOrganize.name || '组织'
    const { logo } = currentSelectOrganize
    const userInfoMenu = (
      <Card  className={indexStyle.menuDiv} >
        <div className={indexStyle.triangle} ></div>
        <Menu onClick={this.handleMenuClick.bind(this)} selectable={false} >
          <SubMenu key="sub" title={
            <div style={{width: '100%',height:'100%',padding:'0 16 0 6px', overflow: 'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',fontSize:16, color: '#000' }} >
             {orgnizationName}
            </div>}>
            {currentUserOrganizes.map((value, key) => {
              const { name, id } = value
              return (
                <Menu.Item key={id} style={{padding:0,margin: 0,color: '#595959'}}>
                  <div className={indexStyle.itemDiv} style={{ padding: '0 16px'}}>
                    {name}
                  </div>
                </Menu.Item>
              )
            })}
            <Menu.Item key="10" style={{padding:0,margin: 0,color: '#595959'}}>
              <div className={indexStyle.itemDiv} style={{ padding: '0 16px',color: color_4}}>
                <Icon type="plus-circle" theme="outlined"  style={{margin: 0, fontSize: 16}}/> 创建或加入新组织
              </div>
            </Menu.Item>
          </SubMenu>
          <Menu.Divider key="none_1"/>
          <Menu.Item  key="2" style={{padding:0,margin: 0}}>
              <div className={indexStyle.itemDiv}>
                <span  className={indexStyle.specificalItem}><Icon type="team" /><span className={indexStyle.specificalItemText}>团队/成员</span></span>
              </div>
          </Menu.Item>
          {currentUserOrganizes.length?(
            <Menu.Item key="3" style={{padding:0,margin: 0}}>
              <div className={indexStyle.itemDiv}>
                <span  className={indexStyle.specificalItem}><Icon type="home" /><span className={indexStyle.specificalItemText}>组织管理后台</span></span>
              </div>
            </Menu.Item>
          ):('')}

          <Menu.Item key="4" style={{padding:0,margin: 0}}>
              <div className={indexStyle.itemDiv}>
                <span  className={indexStyle.specificalItem}><Icon type="user-add" /><span className={indexStyle.specificalItemText}>邀请成员加入</span>
                </span>
              </div>
          </Menu.Item>
          <Menu.Item key="5" style={{padding:0,margin: 0}}>
            <Tooltip placement="topLeft" title={'即将上线'}>
              <div className={indexStyle.itemDiv}>
                <span><Icon type="sound" />通知设置</span>
              </div>
            </Tooltip>
          </Menu.Item>
          {/*onClick={this.routeingJump.bind(this,'/technological/accoutSet')}*/}
          <Menu.Item key="6" style={{padding:0,margin: 0}}>
            <div className={indexStyle.itemDiv} >
              <span className={indexStyle.specificalItem}><Icon type="schedule" /><span className={indexStyle.specificalItemText}>账户设置</span></span>
            </div>
          </Menu.Item>
          <Menu.Divider key="none_2"  style={{height: 0,padding:0,margin: 0}}/>
          <Menu.Item key="7" style={{height: 64,padding:0,margin: 0}}>
            <div className={indexStyle.itemDiv_2}>
              <div className={indexStyle.avatar}>
                {avatar ? (
                  <img src={avatar} alt="" />
                ) : (
                  <Icon type="user" style={{fontSize: 28, color: '#ffffff',display: 'inline-block',margin: '0 auto',marginTop:6}}/>
                )}
              </div>
              <div className={indexStyle.description}>
                <Tooltip placement="topRight" title={fullName}>
                   <p>{fullName}</p>
                </Tooltip>
                <Tooltip placement="topLeft" title={email}>
                  <p>{email}</p>
                </Tooltip>
              </div>
              <div style={{marginLeft: 14}}>
                <Icon type="login" style={{fontSize: 18}} onClick={this.logout.bind(this)}/>
              </div>
            </div>
          </Menu.Item>
        </Menu>
      </Card>
    );

    const { datas:{naviHeadTabIndex} } = this.props.model

    return(
      <div>
         <div className={indexStyle.out}>
        <div className={indexStyle.out_left}>
          <Dropdown overlay={userInfoMenu}
                    onVisibleChange={this.handleVisibleChange}
                    visible={this.state.menuVisible}>
            {logo?(
              <img  src={logo}/>
            ):(
              <div className={indexStyle.out_left_left}>{orgnizationName.substring(0,1)}</div>
            )}
          </Dropdown>
          <div className={indexStyle.out_left_right}>
            <span className={naviHeadTabIndex==='1'?indexStyle.tableChoose:''} onClick={this.tabItemClick.bind(this, '1')}>动态</span>
            <span  className={naviHeadTabIndex==='2'?indexStyle.tableChoose:''} onClick={this.tabItemClick.bind(this, '2')}>工作台</span>
            <span className={naviHeadTabIndex==='3'?indexStyle.tableChoose:''} onClick={this.tabItemClick.bind(this, '3')}>项目</span>
          </div>
        </div>
        <div className={indexStyle.out_right}>
          <Input
            placeholder="搜索 项目、任务、文档、联系人、标签"
            style={{height:40, width: 400,fontSize: 16,marginRight: 24}}
            prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)', fontSize: 16 }} />}
          />
          <div className={indexStyle.add}>
            <Icon type="plus" style={{ color: 'rgba(0,0,0,.25)', fontSize: 20,color: '#ffffff', fontWeight: 'bold' }} />
          </div>
        </div>
      </div>
        <CreateOrganizationModal {...this.props} createOrganizationVisable={this.state.createOrganizationVisable} setCreateOrgnizationOModalVisable={this.setCreateOrgnizationOModalVisable.bind(this)}/>
        <ShowAddMenberModal {...this.props} addMembers={this.addMembers.bind(this)}  modalVisible={this.state.ShowAddMenberModalVisibile} setShowAddMenberModalVisibile={this.setShowAddMenberModalVisibile.bind(this)}/>
      </div>
    )
  }
};

//readme:     const { isNeedTimeDown , dispatch, discriptionText, jumpText } = this.props要从父组件传递进来

