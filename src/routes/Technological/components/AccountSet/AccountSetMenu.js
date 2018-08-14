import React from 'react';
import { Input, Icon, Menu, Dropdown, Card} from 'antd'
import indexStyle from './index.less'
import PersonalInfoForm from './PersonalInfoForm.js'
import ChangePasswordForm from './ChangePasswordForm.js'
import BindAccountForm from './BindAccountForm.js'

export default class AccountSetMenu extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    SelectedKeys : '1', //菜单所选项
  }
  //选择菜单
  handleMenuClick = (e) => {
    this.setState({
      SelectedKeys: e.key
    })
  }
  //返回所选菜单对应内容
  filterFormComponet() {
    let Dom
    switch (this.state.SelectedKeys) {
      case '1':
        Dom =  <PersonalInfoForm/>
        break
      case '2':
        Dom = <BindAccountForm/>
        break
      case '3':
        Dom = <ChangePasswordForm />
        break
      default:
        return ''
    }
    return Dom
  }
  render() {
    const { SelectedKeys } = this.state
    return (
      <div className={indexStyle.menuOut}>
        {/*左边菜单*/}
        <div>
          <Menu
            onClick={this.handleMenuClick}
            style={{ width: 222, height: '100%' }}
            defaultSelectedKeys={[SelectedKeys]}
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
          {this.filterFormComponet()}
          {/*<PersonalInfoForm />*/}
        </div>
      </div>
    )
  }
}
AccountSetMenu.propTypes = {
};
