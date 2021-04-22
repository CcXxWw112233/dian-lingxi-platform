/**
 * 获取控制点数据的起始和结束时间
 * 更新一级里程碑的一级前方预留的空位
 * @param {{}[]} data 需要提取的数据，必须包含时间
 * @param { string } property_key 需要取哪个数值进行对比和取值 默认end_time
 * @returns {{}}
 */
export const getFirstItem = (data, property_key = 'end_time') => {
  if (!data) return null
  if (!data.length) return []
  const arr = data.sort(
    (a, b) => (a[property_key] || 0) - (b[property_key] || 0)
  )

  return arr[0]
}

/** 取控制点数据的结束时间
 * 算出开始到结束时间有多少天
 * @param {{}[]} data 需要提取的数据，必须包含时间
 * @param { string } property_key 需要取哪个数值进行对比和取值 默认end_time
 * @returns {{}}
 */
export const getLastItem = (data, property_key = 'end_time') => {
  if (!data) return null
  if (!data.length) return []
  const arr = data.sort(
    (a, b) => (a[property_key] || 0) - (b[property_key] || 0)
  )

  return arr[arr.length - 1]
}

/** 获取文本px宽度*
 * @param font{String}: 字体样式
 * **/
// eslint-disable-next-line no-extend-native
String.prototype.pxWidth = function(font = 'normal 14px Robot') {
  // re-use canvas object for better performance
  let canvas =
      String.prototype.pxWidth.canvas ||
      (String.prototype.pxWidth.canvas = document.createElement('canvas')),
    context = canvas.getContext('2d')

  font && (context.font = font)
  var metrics = context.measureText(this)

  canvas = null
  return metrics.width
}
