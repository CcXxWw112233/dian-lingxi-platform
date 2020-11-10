import React, { Component, lazy, Suspense } from 'react'
import { Drawer, Spin } from 'antd'
const OrganizationMember = lazy(() =>
  import('../../../../../Technological/components/OrganizationMember')
)
const Organization = lazy(() =>
  import('../../../../../organizationManager/index')
)
const AccountSet = lazy(() =>
  import('../../../../../Technological/components/AccountSet')
)

export default class SimpleDrawer extends Component {
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
        <Suspense
          fallback={
            <div
              style={{
                background: 'rgba(245, 245, 245, 1)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Spin></Spin>
            </div>
          }
        >
          {this.renderSimpleDrawerContent(simpleDrawerContentKey)}
        </Suspense>
      </Drawer>
    )
  }
}
