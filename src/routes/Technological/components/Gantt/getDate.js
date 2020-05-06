import base_utils from './base_utils'

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

}

module.exports = _obj
