//是否同一周。以周一开始
export const  isSameWeek = (oldTimestamp,nowTimestamp) => {
  var oneDayTime = 1000 * 60 * 60 * 24;
  var old_count = parseInt(oldTimestamp / oneDayTime);
  var now_other = parseInt(nowTimestamp / oneDayTime);
  return parseInt((old_count + 3) / 7) == parseInt((now_other + 3) / 7);
}

export const timestampToTime = (timestamp, flag) => {
  let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '年';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
  let D = date.getDate() < 10 ? '0' + date.getDate() + '日 ' : date.getDate() + '日 ';
  let h = date.getHours() < 10 ? '0' +  date.getHours() + ':' : date.getHours() + ':';
  let m = date.getMinutes() < 10 ? '0' +  date.getMinutes()  : date.getMinutes() ;
  return flag ? Y + M + D + h + m  : Y + M + D;
}

//动态消息列表时间处理
export const newsDynamicHandleTime = (timeStamp) => {
  if(!timeStamp) {
    return false
  }
  const  now = new Date();
  const day = new Date(timeStamp).getDay() !== 0 ? new Date(timeStamp).getDay() : 7 ;
  const nowTime = now.getTime();

  const oneDayLong = 24 * 60 * 60 * 1000;
  const MondayTime = nowTime - (now.getDay() - 1 ) * oneDayLong;

  const differMonday = Math.floor((MondayTime - timeStamp)/ (24 * 3600 * 1000)) //与本周一相差的天数1,2,3,4,5,6,7
  const NowdifferOld = Math.floor((nowTime - timeStamp)/ (24 * 3600 * 1000)) //与本周一相差的天数1,2,3,4,5,6,7

  let DateDescription
  if(isSameWeek(timeStamp,nowTime)) {
    if(NowdifferOld === 0) {
      DateDescription = '今天'
    }else{
      switch (day) {
        case 1:
          DateDescription = '周一'
          break
        case 2:
          DateDescription = '周二'
          break
        case 3:
          DateDescription = '周三'
          break
        case 4:
          DateDescription = '周四'
          break
        case 5:
          DateDescription = '周五'
          break
        case 6:
          DateDescription = '周六'
          break
        case 7:
          DateDescription = '周日'
          break
        default:
          DateDescription = timestampToTime(timeStamp)
          break
      }
    }
  }else{
    if(NowdifferOld === 0) {
      DateDescription = '今天'
    }else{
      switch (differMonday) {
        case 1:
          DateDescription = '上周日'
          break
        case 2:
          DateDescription = '上周六'
          break
        case 3:
          DateDescription = '上周五'
          break
        case 4:
          DateDescription = '上周四'
          break
        case 5:
          DateDescription = '上周三'
          break
        case 6:
          DateDescription = '上周二'
          break
        case 7:
          DateDescription = '上周一'
          break
        default:
          DateDescription = timestampToTime(timeStamp)
          break
      }
    }
  }
  return DateDescription
}

export const getUrlQueryString = (href,name) => {
  const reg = new RegExp(name +"=([^&]*)");
  const r = href.match(reg)//window.location.href.match(reg);
  if(r!=null)return  unescape(r[1]); return null;
}
