import React from 'react';
import indexStyle from './index.less'
import { Link } from 'dva/router'
import { Input, Icon, Menu, Dropdown, } from 'antd'

export default class HeaderNav extends React.Component{
  constructor(props) {
    super(props)
  }
  menuItemClick(route) {
    // this.props.setChirldrenRoute ? this.props.setChirldrenRoute(route) :''
    this.props.routingJump(route)
  }
  render() {
    const menu = (
      <div style={{marginTop:8, width: 256, backgroundColor: '#ffffff'}}>
        <Menu  >
          <Menu.Item>
            <span style={{fontSize:16, color: '#000'}}>合创迪安(深圳)有限公司</span>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item onClick={this.menuItemClick.bind(this,'/technological/login')}>
              logoin
          </Menu.Item>
          <Menu.Item onClick={this.menuItemClick.bind(this,'/technological/register')}>
              register
          </Menu.Item>
          <Menu.Item>
           1st menu item
          </Menu.Item>
          <Menu.Item>
           2nd menu item
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item>
           3rd menu item
          </Menu.Item>
        </Menu>
      </div>
    );

    return(
      <div className={indexStyle.out}>
        <div className={indexStyle.out_left}>
          <Dropdown overlay={menu}>
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

