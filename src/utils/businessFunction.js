//业务逻辑公共工具类
import { message } from 'antd'
import { NORMAL_NOUN_PLAN } from '../globalset/js/constant'
import {getFilePDFInfo} from "../services/technological/file";
import {getUserOrgPermissions} from "../services/technological/organizationMember";

// 权限的过滤和存储在technological下
// 权限分为全组织和确定组织下
// 确定组织下的数据为[{code: 'xxx'}]
// 全组织下的数据格式为
// const ss = [{
//   org_id: 'sss',
//   permissions: [
//     { code: 'xxx'}
//   ]
// }]
// 两者区别是通过确认的组织id过滤出permisions的列表
//》
//检查是否有操作权限(组织)
// 当全组织状态下，如果调用方法不传确认的组织id则默认有权限。如果传递了组织id那就遍历相应的权限code来获取有无权限
// 确认组织下，只需要传递code就可以遍历得到有无权限
export const checkIsHasPermission = (code, param_org_id) => {
  const OrganizationId = localStorage.getItem('OrganizationId')
  const organizationMemberPermissions = JSON.parse(localStorage.getItem('userOrgPermissions')) || []
  if(OrganizationId == '0') {
    if(!param_org_id) {
      return true
    } else {
      let currentOrgPermission = []
      for(let val of organizationMemberPermissions) {
        if(param_org_id == val['org_id']) {
          currentOrgPermission = val['permissions']
          break
        }
      }
      let flag = false
      for(let i = 0; i < currentOrgPermission.length; i ++) {
        if (code === currentOrgPermission[i]['code']) {
          flag = true
          break
        }
      }
      return flag
    }
  }
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
  const board_id = localStorage.getItem('storageCurrentOperateBoardId')
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

// 返回全组织（各个组织下）或某个确认组织下对应的org_name
export const getOrgNameWithOrgIdFilter = (org_id, organizations = []) => {
  const OrganizationId = localStorage.getItem('OrganizationId')
  if(OrganizationId != '0') { //确认组织
    let currentSelectOrganize = localStorage.getItem('currentSelectOrganize') || '{}'
    currentSelectOrganize = JSON.parse(currentSelectOrganize)
    return currentSelectOrganize['name']
  } else { //全组织
    const name = (organizations.find(item => org_id == item.id) || {} ).name
    return name
  }
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
//设置组织id localstorage缓存
export const setOrganizationIdStorage = (value) => {
  localStorage.setItem('OrganizationId', value)
}
//设置board_id localstorage缓存, 同时存储board_id对应的org_id
export const setBoardIdStorage = (value) => {
  localStorage.setItem('storageCurrentOperateBoardId', value)
  // 从缓存中拿到相应的board_id对应上org_id，存储当前项目的org_id => aboutBoardOrganizationId
  let userAllOrgsAllBoards = localStorage.getItem('userAllOrgsAllBoards') || []
  if(userAllOrgsAllBoards) {
    userAllOrgsAllBoards = JSON.parse(userAllOrgsAllBoards)
  }
  let org_id = ''
  for(let val of userAllOrgsAllBoards) {
    for(let val_2 of val['board_ids']) {
      if(value == val_2) {
        org_id = val['org_id']
        break
      }
    }
    if(org_id) {
      break
    }
  }
  localStorage.setItem('aboutBoardOrganizationId', org_id || '0')
}

//是否有组织成员查看权限

export const isHasOrgMemberQueryPermission = () => checkIsHasPermission('org:upms:organization:member:query')

export const isHasOrgTeamBoardEditPermission = () => checkIsHasPermission('org:team:board:edit')
