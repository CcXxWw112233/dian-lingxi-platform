import React, { Component } from 'react'

import { Drawer } from 'antd'
import { connect } from 'dva'
import OrganizationMember from '../../../../../Technological/components/OrganizationMember'
import Organization from '../../../../../organizationManager/index'
import AccountSet from '../../../../../Technological/components/AccountSet'

export default class SimpleDrawer extends Component {
  state = {
    visible: true
  }

  onClose = e => {
    this.props.closeDrawer()
  }

  renderSimpleDrawerContent = key => {
    let simpleDrawerContent = <></>
    switch (key) {
      case '24': // 团队成员
        simpleDrawerContent = <OrganizationMember />
        break
      case '23': // 组织管理后台
        simpleDrawerContent = <Organization />
        break
      case '20':
        simpleDrawerContent = <AccountSet />
        break
      default:
        break
    }
    return simpleDrawerContent
  }

  render() {
    const drawerHeight = document.body.scrollHeight
    const {
      simpleDrawerContent = null,
      simpleDrawerContentKey,
      drawerTitle = '',
      style,
      visible
    } = this.props
    return (
      <Drawer
        visible={visible}
        title={drawerTitle}
        placement="right"
        closable={true}
        zIndex={1010}
        maskStyle={{
          opacity: 1
        }}
        width={'80%'}
        onClose={this.onClose}
        keyboard={true}
        style={{
          background: 'rgb(245, 245, 245)',
          height: drawerHeight - 55 + 'px'
        }}
        getContainer={() =>
          document.getElementById('technologicalLayoutWrapper')
        }
      >
        {this.renderSimpleDrawerContent(simpleDrawerContentKey)}
      </Drawer>
    )
  }
}
