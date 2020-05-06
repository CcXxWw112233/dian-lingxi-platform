import base_utils from './base_utils'

const _obj = {
  getMonthDate: (timestamp) => {
    return base_utils.getAroundDate(timestamp)
  },
  getNextMonthDatePush: (timestamp) => { //日期累加
    return base_utils.getNextMonthDate(timestamp)
  },
  getLastMonthDateShift: (timestamp) => {
    return base_utils.getLastMonthDate(timestamp)
  },
  getDateInfo: base_utils.getNeedDate
}

module.exports = _obj

// isToday: (timestamp) => {
//   return new Date(timestamp).toDateString() === new Date().toDateString()
// },

// isSamDay: (timestamp, timestamp2) => {
//   if (!!!timestamp || !!!timestamp2) {
//     return false
//   }
//   const new_time_a = timestamp.toString().length < 13 ? Number(timestamp) * 1000 : Number(timestamp)
//   const new_time_b = timestamp2.toString().length < 13 ? Number(timestamp2) * 1000 : Number(timestamp2)
//   return new Date(new_time_a).toDateString() == new Date(new_time_b).toDateString()
// },