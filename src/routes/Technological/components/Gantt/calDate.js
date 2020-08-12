import { timeToTimestamp } from "../../../../utils/util"


//时间戳转换为日期
function timestampToTime(timestamp, flag) {
  let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '/';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
  let D = date.getDate() + ' ';
  let h = date.getHours() + ':';
  let m = date.getMinutes() + ':';
  let s = date.getSeconds();
  return flag ? Y + M + D + h + m + s : Y + M + D;
}
//计算周的数据
function setWeekData(timestamp) {
  let weekData = [] // 周的数据
  let weekData2 = []
  let now = timestamp ? new Date(timestamp) : new Date()
  let nowTime = now.getTime();
  let day = now.getDay();
  let oneDayLong = 24 * 60 * 60 * 1000;
  for (let i = 0; i < 50; i++) {
    const MondayTime = nowTime - (day - 1 + 7 * i) * oneDayLong;
    const SundayTime = nowTime + (7 - day - 7 * i) * oneDayLong;
    const MonDayTimeTranslate = timestampToTime(MondayTime)
    const SundayTimeTranslate = timestampToTime(SundayTime)
    const MondayMonth = MonDayTimeTranslate.substring(5, 7)
    const SundayMonth = SundayTimeTranslate.substring(5, 7)
    const MonDayDate = MonDayTimeTranslate.substring(8)
    const SunDayDate = SundayTimeTranslate.substring(8)
    const MonthText = (Number(MonDayDate) < Number(SunDayDate)) ? Number(MondayMonth).toString() : (Number(MondayMonth) + '/' + Number(SundayMonth))
    const DayText = (MonDayDate + '-' + SunDayDate).replace(/\s/gim, '')

    const date_0 = new Date(MonDayTimeTranslate)
    const year_0 = date_0.getFullYear()
    const month_0 = date_0.getMonth() + 1
    const date_no_0 = date_0.getDate()

    const date_1 = new Date(SundayTimeTranslate)
    const year_1 = date_1.getFullYear()
    const month_1 = date_1.getMonth() + 1
    const date_no_1 = date_1.getDate()

    const obj = {
      year: year_1,
      month: month_1,
      Mon: MonDayTimeTranslate,
      Sun: SundayTimeTranslate,
      timestamp: timeToTimestamp(MonDayTimeTranslate + ' ' + '0:0:0'),
      timestampEnd: timeToTimestamp(SundayTimeTranslate + ' ' + '23:59:59'),
      monthText: MonthText,
      date_no: `${month_0 != month_1 ? month_0 + '/' : ''}${date_no_0}-${date_no_1}`,// `${month_0}/${date_no_0}-${month_1}/${date_no_1}`,
      description: `${year_1}年${month_1}月`
    }
    weekData.push(obj)
  }
  for (let i = 0; i < 50; i++) {
    const MondayTime = nowTime - (day - 1 - 7 * i) * oneDayLong;
    const SundayTime = nowTime + (7 - day + 7 * i) * oneDayLong;
    const MonDayTimeTranslate = timestampToTime(MondayTime)
    const SundayTimeTranslate = timestampToTime(SundayTime)
    const MondayMonth = MonDayTimeTranslate.substring(5, 7)
    const SundayMonth = SundayTimeTranslate.substring(5, 7)
    const MonDayDate = MonDayTimeTranslate.substring(8)
    const SunDayDate = SundayTimeTranslate.substring(8)
    const MonthText = (Number(MonDayDate) < Number(SunDayDate)) ? Number(MondayMonth).toString() : (Number(MondayMonth) + '/' + Number(SundayMonth))
    const DayText = (MonDayDate + '-' + SunDayDate).replace(/\s/gim, '')

    const date_0 = new Date(MonDayTimeTranslate)
    const year_0 = date_0.getFullYear()
    const month_0 = date_0.getMonth() + 1
    const date_no_0 = date_0.getDate()

    const date_1 = new Date(SundayTimeTranslate)
    const year_1 = date_1.getFullYear()
    const month_1 = date_1.getMonth() + 1
    const date_no_1 = date_1.getDate()

    const obj = {
      year: year_1,
      month: month_1,
      Mon: MonDayTimeTranslate,
      Sun: SundayTimeTranslate,
      timestamp: timeToTimestamp(MonDayTimeTranslate + ' ' + '0:0:0'),
      timestampEnd: timeToTimestamp(SundayTimeTranslate + ' ' + '23:59:59'),
      monthText: MonthText,
      date_no: `${month_0 != month_1 ? month_0 + '/' : ''}${date_no_0}-${date_no_1}`,//`${month_0}/${date_no_0}-${month_1}/${date_no_1}`,
      description: `${year_1}年${month_1}月`
    }
    weekData2.push(obj)
  }
  return [].concat(weekData.reverse().slice(0, 49), weekData2)
}

function handleWeekData(timestamp) {
  const arr = setWeekData(timestamp)
  let title_arr = arr.map(item => item.description)
  // console.log('sssssssssssgold_arr0', title_arr)

  title_arr = Array.from(new Set(title_arr)) //得到不重的多组
  // console.log('sssssssssssgold_arr1', title_arr)

  let gold_arr = []
  for (let val of title_arr) {
    const obj = {
      date_top: val,
      date_inner: []
    }
    for (let val2 of arr) {
      if (val == val2.description) {
        obj.date_inner.push(val2)
      }
    }
    gold_arr.push(obj)
  }
  // console.log('sssssssssssgold_arr', gold_arr)
  return gold_arr
}

export const weekDataArray = (timestamp) => setWeekData(timestamp)
export const getWeekGoldData = (timestamp) => handleWeekData(timestamp)
console.log('weekDataArray', weekDataArray())
console.log('weekDataArray', getWeekGoldData())