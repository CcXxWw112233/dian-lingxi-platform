// 用来封装弹窗中公用方法

/**
 * 获取弹窗中需要查询的对应字段数据
 * @param {Array} properties 需要过滤的数组列表
 * @param {String} code 需要获取的字段类型
 * @returns {Object} 返回一个对象, 当前对应属性字段
 */
const getCurrentDrawerContentPropsModelFieldData = ({properties = [], code}) => {
  if (!properties || !code) return {}
  if (!(properties && properties.length)) return {}
  const currentFieldInfo =(properties.filter(item => item.code == code) || [])[0]
  return currentFieldInfo || {}
}