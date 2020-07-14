// 针对坐标轴换行处理
export const  newline = (option, number, axis) => {
  let labelItem
  /* 此处注意json是数组还是对象 */
  if (option[axis] instanceof Array) {
    labelItem = option[axis][0]
  } else {
    labelItem = option[axis]
  }
  labelItem['axisLabel'] = {
    interval: 0,
    formatter: function (params) {
      var newParamsName = "";
      var paramsNameNumber = params.length;
      var provideNumber = number;
      var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
      if (paramsNameNumber > provideNumber) {
        for (var p = 0; p < rowNumber; p++) {
          var tempStr = "";
          var start = p * provideNumber;
          var end = start + provideNumber;
          if (p == rowNumber - 1) {
            tempStr = params.substring(start, paramsNameNumber);
          } else {
            tempStr = params.substring(start, end) + "\n";
          }
          newParamsName += tempStr;
        }
      } else {
        newParamsName = params;
      }
      return newParamsName
    }
  }
  return option;
}

export const  arrayNonRepeatfy = (arr) => {
  let temp_arr = []
  let temp_id = []
  for (let i = 0; i < arr.length; i++) {
    if (!temp_id.includes(arr[i])) {//includes 检测数组是否有某个值
      temp_arr.push(arr[i]);
      temp_id.push(arr[i])
    }
  }
  return temp_arr
}