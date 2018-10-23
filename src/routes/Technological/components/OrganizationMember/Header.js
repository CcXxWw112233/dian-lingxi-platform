import React from 'react'
import indexStyle from './index.less'
import { Icon, Menu, Dropdown, Tooltip } from 'antd'

export default class Header extends React.Component {
  render() {
    const menu = (
      <Menu>
        <Menu.Item key={'1'}>
          全部项目
        </Menu.Item>
        <Menu.Item key={'2'} disabled>
          <Tooltip placement="top" title={'即将上线'}>
            已归档项目
          </Tooltip>
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
          <div>专家</div>
          <div>投资人</div>
          <div>设计师</div>
        </div>

        <div className={indexStyle.right}>
          <div style={{marginRight: 12}}>按项目排序 <Icon type="down"  style={{fontSize:14,color:'#595959'}}/></div>
          <div>全部项目 <Icon type="down"  style={{fontSize:14,color:'#595959'}}/></div>
          <Icon type="appstore-o" style={{fontSize:14,marginTop:18,marginLeft:16}}/>
        </div>
      </div>
    )
  }
}
