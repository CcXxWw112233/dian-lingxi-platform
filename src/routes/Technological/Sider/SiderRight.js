import React from 'react'
import {  Icon, Layout, Menu, } from 'antd';
import indexStyles from './index.less'

const { Sider } = Layout;

export default class SiderRight extends React.Component {
  state={
    collapsed: true
  }
  setCollapsedLeftMouseOver(collapsed) {
    this.setState({
      collapsed: collapsed
    })
  }
  render() {
    const { collapsed } = this.state

    return (
      <Sider
        collapsible
        className={indexStyles.siderRight} collapsible defaultCollapsed={true} collapsedWidth={56} width={300} theme={'light'}
      >
      </Sider>
    )
  }
}
