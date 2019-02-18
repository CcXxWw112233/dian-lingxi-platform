//业务逻辑公共工具类
import { message } from 'antd'
import { NORMAL_NOUN_PLAN } from '../globalset/js/constant'

//检查是否有操作权限
export const checkIsHasPermission = (code) => {
  const organizationMemberPermissions = JSON.parse(localStorage.getItem('organizationMemberPermissions')) || []
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
  const currentBoardPermission = JSON.parse(localStorage.getItem('currentBoardPermission')) || []
  if(!Array.isArray(currentBoardPermission)) {
    return false
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
