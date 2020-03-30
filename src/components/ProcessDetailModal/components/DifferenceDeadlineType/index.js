import React, { Component } from 'react'
import { connect } from 'dva'
import { timeToTimestamp, timestampToTimeNormal } from '../../../../utils/util';
import globalStyles from '@/globalset/css/globalClassName.less'
import { currentNounPlanFilterName } from '../../../../utils/businessFunction';
import { FLOWS } from '../../../../globalset/js/constant';

@connect(mapStateToProps)
export default class DifferenceDeadlineType extends Component {

  // 获取当前月份的天数
  getDaysOfEveryMonth = () => {//返回天数
    var baseMonthsDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];//各月天数
    var thisYear = new Date().getFullYear();//今年
    var thisMonth = new Date().getMonth();//今月
    var thisMonthDays = [];//这个月有多少天,用于返回echarts用
    //判断是闰年吗？闰年2月29天
    const isLeapYear = (fullYear) => {
      return (fullYear % 4 == 0 && (fullYear % 100 != 0 || fullYear % 400 == 0));
    }

    const getThisMonthDays = (days) => {//传天数，返天数数组
      var arr = [];
      for (var i = 1; i <= days; i++) {
        arr.push(i);
      }
      return arr;
    }

    if (isLeapYear(thisYear) && thisMonth == 1) {//闰年2月29天
      thisMonthDays = getThisMonthDays(baseMonthsDay[thisMonth] + 1);
    } else {
      thisMonthDays = getThisMonthDays(baseMonthsDay[thisMonth]);
    }
    return thisMonthDays.length;
  }

  // 未限制时间
  renderNotRestrictionsTime = () => {
    let description = ''
    description = '未限制时间'
    return description
  }

  // 渲染未开始的流程
  renderNotBeginningProcess = () => {
    const { itemValue } = this.props
    const { plan_start_time } = itemValue
    let start_time = timestampToTimeNormal(plan_start_time, '/', true)
    let description = start_time
    return description
  }

  // 显示不同类型的时间 时、天、月
  renderRestrictionsTime = () => {
    const { itemKey, itemValue } = this.props
    const { deadline_time_type, deadline_value, deadline_type, last_complete_time } = itemValue
    let total_time = '' //总时间
    let surplus_time = '' //剩余时间戳
    let now = parseInt(new Date().getTime() / 1000)
    let time_ceil = 60 * 60 //单位(3600秒)
    const take_time = now - Number(last_complete_time) //花费时间
    switch (deadline_time_type) {
      case 'hour': // 天
        total_time = deadline_value * time_ceil
        break;
      case 'day':
        total_time = deadline_value * 24 * time_ceil
        break
      case 'month':
        total_time = 30 * deadline_value * 24 * time_ceil
        break
      default:
        break;
    }
    surplus_time = total_time - take_time //86400

    let description = ''
    let month_day_total = this.getDaysOfEveryMonth() //当前月份总天数

    let month = ''
    let day = ''
    let hour = ''
    let min = ''

    if (surplus_time <= 0) {
      description = '已逾期'
    } else {
      if (surplus_time <= time_ceil) { //
        description = `剩余${parseInt(surplus_time / 60)}分钟`
        // 分
      } else if (surplus_time > time_ceil && surplus_time <= 24 * time_ceil) {
        hour = parseInt(surplus_time / time_ceil)
        min = parseInt((surplus_time % time_ceil) / 60)
        if (min < 1) {
          description = `剩余${hour}小时`
        } else {
          description = `剩余${hour}小时${min}分钟`
        }
        // 时/分
      } else if (surplus_time > (24 * time_ceil) && surplus_time <= (month_day_total * 24 * time_ceil)) {
        day = parseInt(surplus_time / (24 * time_ceil))
        hour = parseInt(((surplus_time % (24 * time_ceil))) / time_ceil)
        if (hour < 1) {
          description = `剩余${day}天`
        } else {
          description = `剩余${day}天${hour}小时`
        }
        // 天/时
      } else if (surplus_time > month_day_total * 24 * time_ceil) {
        month = parseInt(surplus_time / (month_day_total * 24 * time_ceil))
        hour = parseInt((surplus_time % (month_day_total * 24 * time_ceil) / (24 * time_ceil)))
        description = `剩余${month}月${hour}小时`
      } else {

      }
    }

    return description
  }

  // 渲染时、天、月
  renderTimeType = (type) => {
    let description = ''
    switch (type) {
      case 'hour':
        description = '小时'
        break;
      case 'day':
        description = '天'
        break
      case 'month':
        description = '月'
        break
      default:
        break;
    }
    return description
  }


  // 渲染流程实例列表内容
  renderFlowInstanceItemContent = () => {
    const { itemValue } = this.props
    const { status, deadline_type } = itemValue
    let container = (<span></span>)
    switch (status) {
      case '1':
        if (deadline_type == '1') {
          container = <span>当前步骤完成期限: <span style={{color:'rgba(24,144,255,1)',marginLeft: '5px'}}>{this.renderNotRestrictionsTime()}</span></span>
          break
        } else if (deadline_type == '2') {
          container = <span>当前步骤完成期限: <span style={{color:'rgba(24,144,255,1)',marginLeft: '5px'}}>{this.renderRestrictionsTime()}</span></span>
          break;
        }
      case '2':
        container = <span>{currentNounPlanFilterName(FLOWS)}状态: <span style={{color: '#F5222D', marginLeft: '5px'}}>已中止</span></span>
        break
      case '3': // 表示已完成
        container = <span>{currentNounPlanFilterName(FLOWS)}状态: <span style={{color:'rgba(24,144,255,1)',marginLeft: '5px'}}>已完成</span></span>
        break
      case '0': // 表示未开始
        container = <span>{currentNounPlanFilterName(FLOWS)}开始时间: <span style={{color:'rgba(24,144,255,1)',marginLeft: '5px'}}>{this.renderNotBeginningProcess()}</span></span>
        break
      default:
        break;
    }
    return container
  }

  // 渲染步骤详情中的内容
  renderNodesStepItemContent = () => {
    const { itemValue } = this.props
    const { status, deadline_type, deadline_value, deadline_time_type } = itemValue
    let container = (<span></span>)
    switch (status) {
      case '1':
        if (deadline_type == '1') {
          return container = <span><span className={globalStyles.authTheme}>&#xe686; 完成期限: </span> <span>{this.renderNotRestrictionsTime()}</span></span>
        } else if (deadline_type == '2') {
          return container = <span><span className={globalStyles.authTheme}>&#xe686; 完成期限: </span><span>{this.renderRestrictionsTime()}</span></span>
        }
        break
      case '2': // 表示已完成
        container = <span>已完成</span>
        break
      case '0': // 表示未开始
        if (deadline_type == '1') {
          container = <span><span className={globalStyles.authTheme}>&#xe686; 完成期限: </span> {this.renderNotRestrictionsTime()}</span>
        } else if (deadline_type == '2') {
          container = <span><span className={globalStyles.authTheme}>&#xe686; 完成期限: </span> 步骤开始后{`${deadline_value}${this.renderTimeType(deadline_time_type)}内`}</span>
        }
        break
      default:
        break;
    }
    return container
  }

  // 根据不同的Type渲染不同的时间文案内容
  renderAccordingToDiffTypeContent = () => {
    const { type } = this.props
    switch (type) {
      case 'flowInstanceItem': // 表示流程实例列表
        return this.renderFlowInstanceItemContent()
      case 'nodesStepItem': // 表示步骤中节点详情
        return this.renderNodesStepItemContent()
      default:
        break;
    }
  }

  render() {
    return (
      <span>
        {this.renderAccordingToDiffTypeContent()}
      </span>
    )
  }
}

// 不同期限类型
DifferenceDeadlineType.defaultProps = {
  type: '', // 需要一个类型来区分是流程实例列表 还是步骤节点详情 flowInstanceItem | nodesStepItem ....等等
}

function mapStateToProps({ publicProcessDetailModal: { processPageFlagStep } }) {
  return { processPageFlagStep }
}