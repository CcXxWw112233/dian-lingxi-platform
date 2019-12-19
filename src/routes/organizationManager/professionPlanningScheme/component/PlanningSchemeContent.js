import React, { Component } from 'react'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Input, Button } from 'antd';
import { connect } from 'dva'
import PlanningSchemeItem from './PlanningSchemeItem'

@connect(mapStateToProps)
export default class PlanningSchemeContent extends Component {

  state = {
    is_create_lcb: false, // 是否是第一次添加里程碑
    is_selected_item: false, // 代表是否有里程碑创建
    inputValue: ''
  }

  // 创建第一个里程碑
  handleCreateFirstList = () => {
    // console.log('进来了', 'ssssssssssss')
    this.setState({
      is_create_lcb: true,
      is_selected_item: true
    })
  }

   // 文本框输入变化
   handleChangeVal = (e) => {
    this.setState({
      inputValue: e.target.value
    })
  }

  // 渲染新建方案
  renderAddNewPlanScheme = () => {
    const { inputValue } = this.state
    return (
      <div>
        <div style={{ width: '100%', marginBottom: '12px', height: '38px' }}><Input value={inputValue} onChange={this.handleChangeVal} autoFocus={true} placeholder="请输入方案名称" style={{ width: '100%', padding: '8px 12px', height: '38px' }} /></div>
        <div style={{ textAlign: 'right' }}><Button disabled={!(inputValue != '')} type="primary">确定</Button></div>
      </div>
    )
  }

  // 渲染其他计划方案
  renderOthersPlanScheme = () => {
    const { is_create_lcb, is_selected_item } = this.state
    return (
      <div className={indexStyles.planningSchemeItemWrapper}>
        {/* 顶部工具栏 */}
        <div className={indexStyles.planningSchemeItem_top}>
          <div>
            <span className={`${globalStyles.authTheme} ${is_selected_item && indexStyles.pub_hover}`}>&#xe6f1; 添加同级</span>
            <span style={{ marginLeft: '18px' }} className={`${globalStyles.authTheme} ${is_selected_item && indexStyles.pub_hover}`}>&#xe6f2; 添加子级</span>
          </div>
          <div>
            <span className={`${globalStyles.authTheme} ${is_selected_item && indexStyles.pub_hover}`}>&#xe7c3; 删除</span>
          </div>
        </div>

        {/* 创建里程碑方案 */}
        <div className={indexStyles.planningSchemeItem_bottom} style={{ border: is_selected_item && '2px solid rgba(24,144,255,1)', borderRadius: is_selected_item && '4px' }} onClick={this.handleCreateFirstList}>
          {
            !is_create_lcb ? (
              <div style={{ color: '#1890FF', textAlign: 'center', cursor: 'pointer' }} className={globalStyles.authTheme}>&#xe6e9; 添加项目第一阶段里程碑</div>
            ) : (
                <div><span style={{ color: '#FAAD14', marginRight: '8px' }} className={globalStyles.authTheme}>&#xe6ef;</span>第一阶段里程碑</div>
              )
          }
        </div>
        <PlanningSchemeItem />
      </div>
    )
  }

  render() {
    const { isAddNewPlan } = this.props
    return (
      <>
        {
          isAddNewPlan ? (this.renderAddNewPlanScheme()) : (this.renderOthersPlanScheme())
        }
      </>
    )
  }
}

// 这是一个每一个方案的组件
PlanningSchemeContent.defaultProps = {

}

function mapStateToProps({
  organizationManager: {
    datas: {
      isAddNewPlan
    }
  }
}) {
  return {
    isAddNewPlan
  }
}