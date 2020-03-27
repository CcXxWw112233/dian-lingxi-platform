import React, { Component } from 'react'
import { connect } from 'dva'

@connect(mapStateToProps)
export default class DifferenceDeadlineType extends Component {

  // 是否限制时间
  whetherLimitDeadlineTime = (type) => {
    if (type == '1') { // 表示未限制时间
      this.renderNotRestrictionsTime()
    } else if (type == '2') {
      this.renderRestrictionsTime()
    }
  }

  renderNotRestrictionsTime = () => {
    let containerText = ''
    containerText = '未限制时间'
    return containerText
  }

  // 显示不同类型的时间 时、天、月
  renderRestrictionsTime = () => {
    const { itemKey, itemValue } = this.props
    const { deadline_time_type, deadline_value, dealine_type } = itemValue
    let letters = ''
    switch (deadline_time_type) {
      case 'hour': // 天
        if (deadline_value <= 1) { // 表示在1小时内
          letters = `剩余${deadline_value * 60}分钟`
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