import React from 'react';
import { Input, Icon, Menu, Dropdown, Card} from 'antd'

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default class AccountSetMenu extends React.Component {
  constructor(props) {
    super(props)
  }
  handleClick = (e) => {
    console.log('click ', e);
  }
  render() {
    return (
      <Menu
        onClick={this.handleClick}
        style={{ width: 222 }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
      >
        <Menu.Item key="1" style={{ fontSize: 16,color:'#8C8C8C',height:48 }}>
          <div style={{height: '100%'}}>
            个人信息
          </div>
        </Menu.Item>
        <Menu.Item key="2" style={{ fontSize: 16,color:'#8c8c8c' }}>账户绑定</Menu.Item>
        <Menu.Item key="3" style={{ fontSize: 16,color:'#8c8c8c' }}>密码修改</Menu.Item>
      </Menu>
    )
  }
}
AccountSetMenu.propTypes = {
};
