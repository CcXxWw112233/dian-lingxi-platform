import React from 'react'
import indexStyle from './index.less'
import { Icon, Menu, Dropdown, Tooltip,Button } from 'antd'

export default class Header extends React.Component {
  //团队展示发布编辑
  editTeamShowPreview() {
    const that = this
    this.props.updateDatas({
      editTeamShowPreview: true
    })
    setTimeout(function () { //延迟获取
      const html = document.getElementById('editTeamShow').innerHTML
      console.log(html)
    },200)
  }
  editTeamShowSave() {
    this.props.updateDatas({
      editTeamShowSave: true
    })
    setTimeout(function () { //延迟获取
      const html = document.getElementById('editTeamShow').innerHTML
      console.log(html)
    },200)
  }
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
          按参与关系排序
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
      <div className={indexStyle.out}>
        <div className={indexStyle.left}>
        </div>
        <div className={indexStyle.right}>
          <div style={{display: 'flex',alignItems: 'center', }}>
            <Button  style={{height: 24,}} onClick={this.editTeamShowPreview.bind(this)}>预览</Button>
            <Button type={'primary'}  style={{height: 24,marginLeft:14}} onClick={this.editTeamShowSave.bind(this)}>保存</Button>
          </div>
        </div>
      </div>
    )
  }
}
