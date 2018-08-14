import React from 'react';
import { Input, Icon, Menu, Dropdown, Card} from 'antd'
import indexStyle from './index.less'
import PersonalInfoForm from './PersonalInfoForm.js'
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
      <div className={indexStyle.menuOut}>
        {/*左边菜单*/}
        <div>
          <Menu
            onClick={this.handleClick}
            style={{ width: 222, height: '100%' }}
            defaultSelectedKeys={['1']}
            mode="inline"
          >
            <Menu.Item key="1" style={{ fontSize: 16,color:'#8C8C8C',height:48 }}>
              <div style={{height: '100%',paddingTop:4, boxSizing: 'border-box'}}>
                个人信息
              </div>
            </Menu.Item>
            <Menu.Item key="2" style={{ fontSize: 16,color:'#8c8c8c',height:48  }}>
              <div style={{height: '100%',paddingTop:4, boxSizing: 'border-box'}}>
                账户绑定
              </div>
            </Menu.Item>
            <Menu.Item key="3" style={{ fontSize: 16,color:'#8c8c8c',height:48  }}>
              <div style={{height: '100%',paddingTop:4, boxSizing: 'border-box'}}>
                密码修改
              </div>
            </Menu.Item>
          </Menu>
        </div>
        {/*右边表单*/}
        <div>
          <PersonalInfoForm />
        </div>
      </div>
    )
  }
}
AccountSetMenu.propTypes = {
};
