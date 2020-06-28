

let newDate = new Date()
let currentYear = newDate.getFullYear()
let lastYear = currentYear - 1
let currentMonth = newDate.getMonth() + 1
let currentDate = newDate.getDate()


//获取某年某月总共几天
function getDaysInOneMonth(year, month) {
  month = parseInt(month, 10);
  let d = new Date(year, month, 0);
  return d.getDate();
}
//时间戳转换为日期
function timestampToTime(timestamp, flag) {
  let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let D = date.getDate() + ' ';
  let h = date.getHours() + ':';
  let m = date.getMinutes() + ':';
  let s = date.getSeconds();
  return flag ? Y + M + D + h + m + s : Y + M + D;
}
//日期转换为时间戳
function timeToTimestamp(dateString) { // 示例 '2014-04-23 18:55:49'
  const date = new Date(dateString)
  return date.getTime()
}
//给dateData赋值
function setDateData() {
  let dateData = { // 日期数据
    [lastYear]: {},
    [currentYear]: {}
  }
  let dateDataArray = []
  let monthDataArray = []

  //获取上一年的每个月份的天数
  for (let i = 1; i < 13; i++) {
    dateData[lastYear][i] = []
    let dayTotal = getDaysInOneMonth(lastYear, i)
    for (let j = 1; j < dayTotal + 1; j++) {
      dateData[lastYear][i].push(j)
    }
  }
  // console.log('dateData1', dateData)
  //获取截至今天（含）之前今年的月份的天数
  // for (let i = 1; i < currentMonth + 1; i++) {
  //   dateData[currentYear][i] = []
  //   let dayTotal
  //
  //   dayTotal = (i === currentMonth) ? currentDate : getDaysInOneMonth(currentYear, i)
  //   for (let j = 1; j < dayTotal + 1; j++) {
  //     dateData[currentYear][i].push(j)
  //   }
  // }
  // console.log('dateData2', dateData)

  for (let i in dateData) {
    for (let j in dateData[i]) {
      let obj = {
        year: i,
        month: j,
        startTimeStamp: timeToTimestamp(i + '-' + j + '-1' + ' ' + '0:0:0'),
        endTimeStamp: timeToTimestamp(i + '-' + j + '-' + getDaysInOneMonth(i, j) + ' ' + '23:59:59'),
        chirldrenText: j + '月',
        parentText: i
      }
      monthDataArray.push(obj)
      for (let k = 0; k < dateData[i][j].length; k++) {
        let obj = {
          year: i,
          month: j,
          date: dateData[i][j][k],
          startTimeStamp: timeToTimestamp(i + '-' + j + '-' + dateData[i][j][k] + ' ' + '0:0:0'),
          endTimeStamp: timeToTimestamp(i + '-' + j + '-' + dateData[i][j][k] + ' ' + '23:59:59'),
          chirldrenText: dateData[i][j][k],
          parentText: j + '月'
        }
        dateDataArray.push(obj)
      }
    }
  }

  return {
    dateDataArray,
    monthDataArray
  }
}
//mmp
function mmp(calDay) {
  let last = new Date(calDay)
  let timestamp = Date.parse(new Date(last));
  timestamp = timestamp / 1000;
  let d = new Date(parseInt(timestamp) * 1000)//
  // let ddate = timeToTimestamp(timestampToTime(d) + '0:0:0')
  let ddate = timestampToTime(d)
  return ddate
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
    const MonDayTimeTranslate = mmp(MondayTime)
    const SundayTimeTranslate = mmp(SundayTime)
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
      date_no: `${month_0}/${date_no_0}-${month_1}/${date_no_1}`,
      description: `${year_1}年${month_1}月`
    }
    weekData.push(obj)
  }
  // return weekData.reverse()

  for (let i = 0; i < 50; i++) {
    const MondayTime = nowTime - (day - 1 - 7 * i) * oneDayLong;
    const SundayTime = nowTime + (7 - day + 7 * i) * oneDayLong;
    const MonDayTimeTranslate = mmp(MondayTime)
    const SundayTimeTranslate = mmp(SundayTime)
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
      date_no: `${month_0}/${date_no_0}-${month_1}/${date_no_1}`,
      description: `${year_1}年${month_1}月`
    }
    weekData2.push(obj)
  }
  return [].concat(weekData.reverse().slice(0, 48), weekData2)
  //计算本周
  // let MondayTime = nowTime - (day - 1) * oneDayLong;
  // let SundayTime = nowTime + (7 - day) * oneDayLong;
  //
  // let monday = new Date(MondayTime);
  // let sunday = new Date(SundayTime);
  //
  // //当前时间时间戳与日期转换
  // let timestamp = Date.parse(new Date());
  // timestamp = timestamp / 1000;
  // let a = new Date(parseInt(timestamp) * 1000)
  //
  // //本周一时间戳与日期转换
  // let stringTime2 = monday;
  // let timestamp2 = Date.parse(new Date(stringTime2));
  // timestamp2 = timestamp2 / 1000;
  // let b = new Date(parseInt(timestamp2) * 1000)//
  //
  // //本周日时间戳与日期转换
  // let stringTime3 = sunday;
  // let timestamp3 = Date.parse(new Date(stringTime3));
  // timestamp3 = timestamp3 / 1000;
  // let c = new Date(parseInt(timestamp3) * 1000)//.
  //
  // let adate = timeToTimestamp(timestampToTime(a) + '0:0:0')
  // let bdate = timeToTimestamp(timestampToTime(b)+ '0:0:1')
  // let cdate = timeToTimestamp(timestampToTime(c) + '0:0:1')
  // return{
  //   adate,
  //   bdate,
  //   cdate
  // }
}

function handleWeekData(timestamp) {
  const arr = setWeekData(timestamp)
  let title_arr = arr.map(item => item.description)
  title_arr = Array.from(new Set(title_arr)) //得到不重的多组
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
  return gold_arr
}

export const monthDataArray = setDateData().monthDataArray
export const dateDataArray = setDateData().dateDataArray
export const weekDataArray = (timestamp) => setWeekData(timestamp)
export const getWeekGoldData = (timestamp) => handleWeekData()
// console.log('weekDataArray', handleWeekData())