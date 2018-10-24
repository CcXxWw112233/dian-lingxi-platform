import React from 'react'
import indexStyle from './index.less'
import { Icon, Menu, Dropdown, Tooltip } from 'antd'

export default class Header extends React.Component {
  render() {
    const menu = () => (
      <Menu>
        <Menu.Item key={'1'}>
          全部成员
        </Menu.Item>
        <Menu.Item key={'2'} disabled>
          {/*<Tooltip placement="top" title={'即将上线'}>*/}
            管理层
          {/*</Tooltip>*/}
        </Menu.Item>
        <Menu.Item key={'3'} disabled>
          {/*<Tooltip placement="top" title={'即将上线'}>*/}
          停用的成员
          {/*</Tooltip>*/}
        </Menu.Item>
      </Menu>
    );
    const menu_2 = (
      <Menu>
        <Menu.Item key={'1'}>
          按项目排序
        </Menu.Item>
        <Menu.Item key={'2'} disabled>
          <Tooltip placement="top" title={'即将上线'}>
            按起止时间排序
          </Tooltip>
        </Menu.Item>
        <Menu.Item key={'3'} disabled>
          <Tooltip placement="top" title={'即将上线'}>
            按状态排序
          </Tooltip>
        </Menu.Item>
        <Menu.Item key={'4'} disabled>
          <Tooltip placement="top" title={'即将上线'}>
            手动排序
          </Tooltip>
        </Menu.Item>
      </Menu>
    );
    return (
      <div className={indexStyle.headerOut}>

        <div className={indexStyle.left}>
          <div>全部成员 · 218</div>
          <Dropdown overlay={menu()}>
             <div><Icon type="down"  style={{fontSize:14,color:'#595959'}}/></div>
          </Dropdown>
        </div>

        <div className={indexStyle.right}>
          <div style={{marginRight: 12}}>添加成员</div>
          <div>批量导入成员</div>
          <Icon type="appstore-o" style={{fontSize:14,marginTop:18,marginLeft:16}}/>
        </div>
      </div>
    )
  }
}
