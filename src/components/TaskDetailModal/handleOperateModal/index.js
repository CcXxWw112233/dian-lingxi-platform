// 用来封装弹窗中公用方法

import { getSubfixName } from "../../../utils/businessFunction"

/**
 * 获取对应属性的data列表
 * @param {Array} arr 需要获取数据的列表
 * @param {String} code 需要查找的data元素
 * @returns 该方法返回需要查询的data
 */
export const getCurrentPropertiesData = (arr,code) => {
  if (!arr || !code) return
  const gold_data = (arr.find(item => item.code == code) || {}).data
  return gold_data
}

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

// 获取不同类型的文件图标
export const judgeFileType = (fileName) => {
  let themeCode = ''
  const type = getSubfixName(fileName)
  switch (type) {
    case '.xls':
      themeCode = '&#xe65c;'
      break
    case '.png':
      themeCode = '&#xe69a;'
      break
    case '.xlsx':
      themeCode = '&#xe65c;'
      break
    case '.ppt':
      themeCode = '&#xe655;'
      break
    case '.pptx':
      themeCode = '&#xe650;'
      break
    case '.gif':
      themeCode = '&#xe657;'
      break
    case '.jpeg':
      themeCode = '&#xe659;'
      break
    case '.pdf':
      themeCode = '&#xe651;'
      break
    case '.docx':
      themeCode = '&#xe64a;'
      break
    case '.txt':
      themeCode = '&#xe654;'
      break
    case '.doc':
      themeCode = '&#xe64d;'
      break
    case '.jpg':
      themeCode = '&#xe653;'
      break
    case '.mp4':
      themeCode = '&#xe6e1;'
      break
    case '.mp3':
      themeCode = '&#xe6e2;'
      break
    case '.skp':
      themeCode = '&#xe6e8;'
      break
    case '.gz':
      themeCode = '&#xe6e7;'
      break
    case '.7z':
      themeCode = '&#xe6e6;'
      break
    case '.zip':
      themeCode = '&#xe6e5;'
      break
    case '.rar':
      themeCode = '&#xe6e4;'
      break
    case '.3dm':
      themeCode = '&#xe6e0;'
      break
    case '.ma':
      themeCode = '&#xe65f;'
      break
    case '.psd':
      themeCode = '&#xe65d;'
      break
    case '.obj':
      themeCode = '&#xe65b;'
      break
    case '.bmp':
      themeCode = '&#xe6ee;'
      break
    default:
      themeCode = '&#xe660;'
      break
  }
  return themeCode
}

// 显示上传人名称
export const showMemberName = (userId, data = []) => {
  const users = data.filter((item) => item.user_id == userId);
  if (users.length > 0) {
    return <span>{users[0].name}</span>
  }
  return;
}

// 递归获取文件路径
export const  getFolderPathName = (fileItem) => {
  if (!(fileItem && Object.keys(fileItem).length)) return
  let arr = []
  const target_path = fileItem.folder_path
  // 递归添加路径
  const digui = (name, data) => {
    if (data[name]) {
      arr.push({ file_name: data.folder_name, file_id: data.id, type: '1' })
      digui(name, data[name])
    } else if (data['parent_id'] == '0') {
      arr.push({ file_name: '根目录', type: '0' })
    } else if (data['parent_id'] == '2') {// 表示临时目录
      arr.push({ file_name: data.folder_name, file_id: data.id, type: '2' })
    }
  }
  digui('parent_folder', target_path)
  const newbreadcrumbList = arr.reverse()
  return newbreadcrumbList
}