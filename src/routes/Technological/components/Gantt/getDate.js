import base_utils from './base_utils'
import { weekDataArray, getWeekGoldData } from './calDate'

const _obj = {
  getMonthDate: (timestamp) => { //获取月视图数据
    return base_utils.getAroundDate(timestamp)
  },
  getNextMonthDatePush: (timestamp) => { //获取传入时间戳，获取下一个月的数据，用于日期累加（月视图）
    return base_utils.getNextMonthDate(timestamp)
  },
  getLastMonthDateShift: (timestamp) => { //获取传入时间戳，获取上一个月的数据，用于日期累加（月视图）
    return base_utils.getLastMonthDate(timestamp)
  },
  getDateInfo: (timestring) => base_utils.getNeedDate(timestring), //获取传入日期的详细信息

  // 年视图所需要数据
  getYearDate: (timestamp) => {
    return base_utils.getYearDateData(timestamp)
  },
  getWeekDate: (timestamp) => {
    return getWeekGoldData(timestamp)
  },
  // 获取目标数据
  getGoldDateData: ({ timestamp, gantt_view_mode }) => {
    if ('year' == gantt_view_mode) {
      return _obj.getYearDate(timestamp)
    } else if ('month' == gantt_view_mode) {
      return _obj.getMonthDate(timestamp)
    } else if ('week' == gantt_view_mode) {
      return _obj.getWeekDate(timestamp)
    } else {
      return _obj.getMonthDate(timestamp)
    }
  }
}
module.exports = _obj
