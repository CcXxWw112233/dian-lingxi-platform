import React, { Component } from 'react'
import { connect } from 'dva'

@connect(mapStateToProps)
export default class DifferenceDeadlineType extends Component {

  // 获取当前月份的天数
  getDaysOfEveryMonth = () =>{//返回天数
    var baseMonthsDay = [31,28,31,30,31,30,31,31,30,31,30,31];//各月天数
    var thisYear = new Date().getFullYear();//今年
    var thisMonth = new Date().getMonth();//今月
    var thisMonthDays = [];//这个月有多少天,用于返回echarts用
    //判断是闰年吗？闰年2月29天
     const isLeapYear = (fullYear) => {
      return (fullYear % 4 == 0 && (fullYear % 100 != 0 || fullYear % 400 == 0));
    }
  
    const getThisMonthDays = (days) =>{//传天数，返天数数组
       var arr = [];
       for(var i=1;i <= days;i++){
         arr.push(i);
      }
      return arr;
    }
  
    if(isLeapYear(thisYear) && thisMonth == 1){//闰年2月29天
      thisMonthDays = getThisMonthDays(baseMonthsDay[thisMonth] + 1);
    }else{
      thisMonthDays = getThisMonthDays(baseMonthsDay[thisMonth]);
    }
    return thisMonthDays.length;
  }

  // 是否限制时间
  whetherLimitDeadlineTime = (type) => {
    if (type == '1') { // 表示未限制时间
      return this.renderNotRestrictionsTime()
    } else if (type == '2') {
      return this.renderRestrictionsTime()
    }
  }

  renderNotRestrictionsTime = () => {
    let description = ''
    description = '未限制时间'
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
        hour = parseInt(((surplus_time % (24 * time_ceil)) )/ time_ceil)
        if (hour < 1) {
          description = `剩余${day}天`
        } else {
          description = `剩余${day}天${hour}小时`
        }
        // 天/时
      } else if (surplus_time > month_day_total * 24 * time_ceil) {
         month = parseInt(surplus_time / (month_day_total * 24 * time_ceil))
         hour = parseInt((surplus_time % (month_day_total * 24 * time_ceil) / (24 * time_ceil) ))
         description = `剩余${month}月${hour}小时`
      } else {

      }
    }

    return description
  }

  render() {
    const { itemKey, itemValue } = this.props
    const { deadline_type } = itemValue
    return (
      <span>
        {this.whetherLimitDeadlineTime(deadline_type)}
      </span>
    )
  }
}

// 不同期限类型
DifferenceDeadlineType.defaultProps = {

}

function mapStateToProps({ publicProcessDetailModal: { processPageFlagStep } }) {
  return { processPageFlagStep }
}