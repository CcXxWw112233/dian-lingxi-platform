// 用来封装弹窗中公用方法

/**
 * 获取弹窗中需要查询的对应字段数据
 * 这个 getCurrentDrawerContentPropsModelDatasExecutors 方法
 * 需要用该方法代替的
 * @param {Array} properties 需要过滤的数组列表
 * @param {String} code 需要获取的字段类型
 * @returns {Object} 返回一个对象, 当前对应属性字段
 */
export const getCurrentDrawerContentPropsModelFieldData = ({properties = [], code}) => {
  if (!properties || !code) return {}
  if (!(properties && properties.length)) return {}
  const currentFieldInfo =(properties.filter(item => item.code == code) || [])[0]
  return currentFieldInfo || {}
}

/**
 * 过滤那些需要更新的字段
 * @param {Array} properties 需要过滤的数组列表
 * @param {String} code 属性字段
 * @param {any} value 需要更新的值
 * @returns {Array} 返回更新完成的列表
 */
export const filterCurrentUpdateDatasField = ({properties = [], code, value}) => {
  if (!properties || !code || !value) return []
  let new_properties = JSON.parse(JSON.stringify(properties || []))
  new_properties = new_properties.map(item => {
    if (item.code == code) {
      let new_item = item
      new_item = { ...item, data: value }
      return new_item
    } else {
      let new_item = item
      return new_item
    }
  })
  return new_properties
}