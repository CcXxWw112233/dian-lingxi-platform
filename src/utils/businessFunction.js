//业务逻辑公共工具类
import { message } from 'antd'
import { NORMAL_NOUN_PLAN } from '../globalset/js/constant'
import {getFilePDFInfo} from "../services/technological/file";
import {getUserOrgPermissions} from "../services/technological/organizationMember";

//检查是否有操作权限
export const checkIsHasPermission = (code) => {
  const organizationMemberPermissions = JSON.parse(localStorage.getItem('userOrgPermissions')) || []
  if(!Array.isArray(organizationMemberPermissions)) {
    return false
  }
  let flag = false
  for(let i = 0; i < organizationMemberPermissions.length; i ++) {
    if (code === organizationMemberPermissions[i]['code']) {
      flag = true
      break
    }
  }
  return flag
}

//在当前项目中检查是否有权限操作
export const checkIsHasPermissionInBoard = (code) => {
  const userBoardPermissions = JSON.parse(localStorage.getItem('userBoardPermissions')) || []
  const board_id = localStorage.getItem('board_id')
  if(!Array.isArray(userBoardPermissions)) {
    return false
  }
  if(!board_id || board_id == '0') {
    return true
  }
  let currentBoardPermission = []
  for(let val of userBoardPermissions) {
    if(board_id == val['board_id']) {
      currentBoardPermission = val['permissions']
      break
    }
  }
  let flag = false
  for(let i = 0; i < currentBoardPermission.length; i ++) {
    if (code === currentBoardPermission[i]['code']) {
      flag = true
      break
    }
  }
  return flag
}

//返回当前名词定义对应名称
export const currentNounPlanFilterName = (code) => {
  let currentNounPlan = localStorage.getItem('currentNounPlan') ///|| NORMAL_NOUN_PLAN
  if(currentNounPlan) {
    currentNounPlan = JSON.parse(currentNounPlan)
  } else {
    currentNounPlan = NORMAL_NOUN_PLAN
  }
  let name = ''
  for(let i in currentNounPlan) {
    if(code === i) {
      name = currentNounPlan[i]
      break
    }
  }
  return name
}

//打开pdf文件名
export const openPDF = (params) => {
  const { protocol, hostname } = window.location
  window.open(`${protocol}//${hostname}/#/iframeOut?operateType=openPDF&id=${params['id']}`)
}
//获取后缀名
export const getSubfixName = (file_name) => {
  return file_name ? file_name.substr(file_name.lastIndexOf(".")).toLowerCase() : ''
}

//设置localstorage缓存
export const setStorage = (key, value) => {
  localStorage.setItem(key, value)
}

//是否有组织成员查看权限

export const isHasOrgMemberQueryPermission = () => checkIsHasPermission('org:upms:organization:member:query')
