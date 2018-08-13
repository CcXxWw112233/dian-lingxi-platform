import React from 'react';
import indexStyle from './index.less'
import { Link } from 'dva/router'
import { Input, Icon, Menu, Dropdown, Tooltip, Avatar, Card} from 'antd'

export default class HeaderNav extends React.Component{
  constructor(props) {
    super(props)
  }
  state = {
    menuVisible: false,
  };

  handleMenuClick = (e) => {
    console.log(e.key === '6')
    if (e.key === '6') {
      this.setState({ menuVisible: false });
    }
  }

  handleVisibleChange = (flag) => {
    this.setState({ menuVisible: flag });
  }
  menuItemClick(route) {
    this.props.routingJump(route)
  }

  render() {
    const menu = (
      <Card className={indexStyle.menuDiv}  selectable={false}>
        <div className={indexStyle.triangle}></div>
        <Menu onClick={this.handleMenuClick} >
          <Menu.Item key="1" style={{padding:0,margin: 0, height: 48,paddingTop:4,boxSizing: 'border-box'}}>
            <Tooltip placement="top" title={'合创迪安(深圳)有限公爱啥啥大伤口就会司'}>
              <div style={{width: '100%',height:'100%',padding:'0 16px', overflow: 'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',fontSize:16, color: '#000' }} >
                 合创迪安(asdasdasdasdasdasdasdad深圳
              </div>
            </Tooltip>
          </Menu.Item>
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
          {/*onClick={this.menuItemClick.bind(this,'/technological/accoutSet')}*/}
          <Menu.Item key="6" style={{padding:0,margin: 0}}>
            <div className={indexStyle.itemDiv} >
              <span className={indexStyle.specificalItem}><Icon type="schedule" /><span className={indexStyle.specificalItemText}>账户设置</span></span>
            </div>
          </Menu.Item>
          <Menu.Divider key="none_2"  style={{height: 64,padding:0,margin: 0}}/>
          <Menu.Item key="7" style={{height: 64,padding:0,margin: 0}}>
            <div className={indexStyle.itemDiv_2}>
              <div className={indexStyle.avatar}>
                <Icon type="user" style={{fontSize: 28, color: '#ffffff',display: 'inline-block',margin: '0 auto',marginTop:6}}/>
              </div>
              <div className={indexStyle.description}>
                <Tooltip placement="topRight" title={'comeonbeibiasdaasdasdasdasasdadasd'}>
                   <p>comeonbeibiasdaasdasdasdasasdadasd</p>
                </Tooltip>
                <Tooltip placement="topLeft" title={'110poskn@213.com'}>
                  <p>110poskn@213.com</p>
                </Tooltip>
              </div>
              <div style={{marginLeft: 14}}>
                <Icon type="login" style={{fontSize: 18}}/>
              </div>
            </div>
          </Menu.Item>
        </Menu>
      </Card>
    );

    return(
      <div className={indexStyle.out}>
        <div className={indexStyle.out_left}>
          <Dropdown overlay={menu}
                    onVisibleChange={this.handleVisibleChange}
                    visible={this.state.menuVisible}>
            <div className={indexStyle.out_left_left}>迪</div>
          </Dropdown>
          <div className={indexStyle.out_left_right}>
            <span>动态</span>
            <span>工作台</span>
            <span>项目</span>
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

