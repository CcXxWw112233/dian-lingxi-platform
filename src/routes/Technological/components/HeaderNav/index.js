import React from 'react';
import indexStyle from './index.less'
import { Link } from 'dva/router'
import { Input, Icon, Menu, Dropdown, Tooltip, Tabs, Card, Modal, Button} from 'antd'
import Cookies from 'js-cookie'

const TabPane = Tabs.TabPane;
const SubMenu = Menu.SubMenu
export default class HeaderNav extends React.Component{
  constructor(props) {
    super(props)
  }
  state = {
    menuVisible: false,
  };

  //蓝色按钮下拉菜单
  handleMenuClick = (e) => {
    if (e.key === '6') {
      this.props.routingJump('/technological/accoutSet')
      this.setState({ menuVisible: false });
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
  render() {
    const { datas = {} } = this.props.model
    const { userInfo = {} } = datas
    const {
      orgnization = '组织',
      aboutMe,
      avatar,
      createTime,
      email,
      fullName,
      id,
      lastLoginTime,
      mobile,
      nickname,
      phone,
      qq,
      status,
      updateTime,
      username,
      wechat,
    } = Cookies.get('userInfo')? JSON.parse(Cookies.get('userInfo')): {}
    const menu = (
      //
      <Card  className={indexStyle.menuDiv} >
        <div className={indexStyle.triangle} ></div>
        <Menu onClick={this.handleMenuClick} selectable={false} >
          <SubMenu key="sub4" title={
            <div style={{width: '100%',height:'100%',padding:'0 16 0 6px', overflow: 'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',fontSize:16, color: '#000' }} >
             {orgnization}
            </div>}>
            <Menu.Item key="9" style={{padding:0,margin: 0,color: '#595959'}}>
              <div className={indexStyle.itemDiv} style={{ padding: '0 16px'}}>
                Option 9
              </div>
            </Menu.Item>
          </SubMenu>
          {/*<Menu.Item key="1" style={{padding:0,margin: 0, height: 48,paddingTop:4,boxSizing: 'border-box'}}>*/}
             {/*<div style={{width: '100%',height:'100%',padding:'0 16px', overflow: 'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',fontSize:16, color: '#000' }} >*/}
                {/*{orgnization}*/}
              {/*</div>*/}
          {/*</Menu.Item>*/}
          <Menu.Divider key="none_1"/>
          <Menu.Item  key="2" style={{padding:0,margin: 0}}>
            <Tooltip placement="topLeft" title={'即将上线'}>
              <div className={indexStyle.itemDiv}>
                <span ><Icon type="team" />团队/部门</span>
              </div>
            </Tooltip>
          </Menu.Item>
          <Menu.Item key="3" style={{padding:0,margin: 0}}>
            <Tooltip placement="topLeft" title={'即将上线'}>
              <div className={indexStyle.itemDiv}>
                <span ><Icon type="home" />机构管理后台</span>
              </div>
            </Tooltip>
          </Menu.Item>
          <Menu.Item key="4" style={{padding:0,margin: 0}}>
            <Tooltip placement="topLeft" title={'即将上线'}>
              <div className={indexStyle.itemDiv}>
                <span><Icon type="user-add" />邀请成员加入</span>
              </div>
            </Tooltip>
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
      <div className={indexStyle.out}>
        <div className={indexStyle.out_left}>
          <Dropdown overlay={menu}
                    onVisibleChange={this.handleVisibleChange}
                    visible={this.state.menuVisible}>
            <div className={indexStyle.out_left_left}>迪</div>
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
    )
  }
};

//readme:     const { isNeedTimeDown , dispatch, discriptionText, jumpText } = this.props要从父组件传递进来

