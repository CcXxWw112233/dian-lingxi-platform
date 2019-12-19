import React, { Component } from 'react'
import { Breadcrumb } from 'antd'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { connect } from 'dva'

@connect(mapStateToProps)
export default class PlanningSchemeBreadcrumbNav extends Component {

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

  renderAddNewPlan = () => {
    return (
      <div>
        <div className={indexStyles.plan_back} onClick={this.handleBackAllPlan}>
          <span className={globalStyles.authTheme}>&#xe7ec; 全部方案</span>
        </div>
        
      </div>
    )
  }

  renderNormalPlan = () => {
    return (
      <div className={indexStyles.breadcrumb_wrapper}>
        <Breadcrumb separator=">" className={indexStyles.breadcrumb}>
          <Breadcrumb.Item key="1" onClick={this.handleBackAllPlan}>全部方案</Breadcrumb.Item>
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
