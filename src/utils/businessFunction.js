//业务逻辑公共工具类
import { message } from 'antd'

//检查是否有操作权限
export const checkIsHasPermission = (code) => {
  const organizationMemberPermissions = JSON.parse(localStorage.getItem('organizationMemberPermissions'))
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
  const currentBoardPermission = JSON.parse(localStorage.getItem('currentBoardPermission'))
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
