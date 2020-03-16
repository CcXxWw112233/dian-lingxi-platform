import React, { Component } from 'react'
import { connect } from 'dva'

@connect(mapStateToProps)
export default class DifferenceDeadlineType extends Component {

  // 显示不同类型的时间 时、天、月
  renderDiffDeadlineTimeType = () => {
    const { itemKey, itemValue } = this.props
    const { deadline_time_type, deadline_value } = itemValue
    let letters = ''
    switch (deadline_time_type) {
      case 'hour': // 天
        if (deadline_value < 1) { // 表示在1小时内
          letters = `剩余${deadline_value}分钟`
        }
        break;
      case 'day':
        if (deadline_value < 1) {
          letters = `剩余${deadline_value}小时`
        }
        break
      default:
        break;
    }
  }

  render() {
    const { itemKey, itemValue } = this.props
    return (
      <div>
        
      </div>
    )
  }
}

// 不同期限类型
DifferenceDeadlineType.defaultProps = {
  
}

function mapStateToProps({ publicProcessDetailModal: { processPageFlagStep } }) {
  return { processPageFlagStep }
}