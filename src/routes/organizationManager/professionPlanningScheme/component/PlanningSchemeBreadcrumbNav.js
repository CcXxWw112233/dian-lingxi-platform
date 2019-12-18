import React, { Component } from 'react'
import { Breadcrumb } from 'antd'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { connect } from 'dva'
import { Input, Button } from 'antd'

@connect(mapStateToProps)
export default class PlanningSchemeBreadcrumbNav extends Component {

  state = {
    inputValue: '', // 输入的文本框的名称
  }

  // 点击全部方案
  handleBackAllPlan = () => {
    this.props.dispatch({
      type: 'organizationManager/updateDatas',
      payload: {
        isAddNewPlan: false
      }
    })
    this.props.updateStateDatas && this.props.updateStateDatas({ whetherShowPlanDetail: false })
  }

  // 文本框输入变化
  handleChangeVal = (e) => {
    this.setState({
      inputValue: e.target.value
    })
  }

  renderAddNewPlan = () => {
    const { inputValue } = this.state
    return (
      <div>
        <div className={indexStyles.plan_back} onClick={this.handleBackAllPlan}>
          <span className={globalStyles.authTheme}>&#xe7ec; 全部方案</span>
        </div>
        {/* 输入方案名称 */}
        <div>
          <div style={{width: '100%', marginBottom: '12px', height: '38px'}}><Input value={inputValue} onChange={this.handleChangeVal} autoFocus={true} placeholder="请输入方案名称" style={{width: '100%', padding: '8px 12px', height: '38px'}}/></div>
          <div style={{textAlign: 'right'}}><Button disabled={!(inputValue != '')} type="primary">确定</Button></div>
        </div>
      </div>
    )
  }

  renderNormalPlan = () => {
    return (
      <div className={indexStyles.breadcrumb_wrapper}>
        <Breadcrumb separator=">" className={indexStyles.breadcrumb}>
          <Breadcrumb.Item key="1">全部方案</Breadcrumb.Item>
          <Breadcrumb.Item key="2">城市规划方案</Breadcrumb.Item>
        </Breadcrumb>
      </div>
    )
  }

  render() {
    const { isAddNewPlan } = this.props
    return (
      <div>
        {
          isAddNewPlan ? (
            this.renderAddNewPlan()
          ) : (
            this.renderNormalPlan()
          )
        }
      </div>
    )
  }
}

// 面包屑路径
PlanningSchemeBreadcrumbNav.defaultProps = {
  breadcrumbList: [], // 面包屑路径列表
}

function mapStateToProps({
  organizationManager: {
    datas: {
      isAddNewPlan = false
    }
  }
}) {
  return {
    isAddNewPlan
  }
}
