import React, { Component } from 'react'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Input, Button, Breadcrumb } from 'antd';
import { connect } from 'dva'

@connect(mapStateToProps)
export default class TempleteSchemeDetail extends Component {

  state = {

  }

  // 点击全部方案返回
  handleBackAllScheme = () => {
    this.props.updateStateDatas && this.props.updateStateDatas({ whetherShowSchemeDetail: false })
  }

  // 渲染其他方案
  renderOthersSchemeNav = () => {
    const { projectSchemeBreadCrumbList = [], current_templete_id, current_templete_name } = this.props
    return (
      <div className={indexStyles.breadcrumb_wrapper}>
        <Breadcrumb separator=">" className={indexStyles.breadcrumb}>
          <Breadcrumb.Item key="0" onClick={this.handleBackAllScheme}>全部方案</Breadcrumb.Item>
          <Breadcrumb.Item key={current_templete_id}>{current_templete_name}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
    )
  }

  render() {
    const { current_templete_id } = this.props
    return (
      <div>
        {/* 头部 */}
        <div>{this.renderOthersSchemeNav()}</div>
        {/* 内容 */}
      </div>
    )
  }
}

function mapStateToProps({
  organizationManager: {
    datas: {

    }
  }
}) {
  return {

  }
}
