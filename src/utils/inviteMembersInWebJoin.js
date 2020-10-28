import { message } from 'antd'
import {
  commInviteWebJoin,
  organizationInviteWebJoin
} from '../services/technological'
import { getOrgIdByBoardId } from './businessFunction'
import { isApiResponseOk } from './handleResponseData'

/**
 * 邀请成员 进组织和项目
 * @param {String} invitationType 邀请类型
 * @param {String} board_id 项目ID
 * @param {String} org_id 组织ID
 * @param {Object} values 数据 { board_id:'', users: [{user_id},{mobile:'',avatar:''},{email:'',avatar:''}], memebers:[{id:'',type:'other',name:''...},{id:'',type:'platform'...}] }
 * @param {function} calback 回调函数
 */
export function inviteMembersInWebJoin({
  invitationType,
  board_id,
  org_id,
  values,
  calback
}) {
  const org_id_ = org_id ? org_id : getOrgIdByBoardId(board_id)
  organizationInviteWebJoin({
    _organization_id: org_id_,
    type: invitationType,
    members: values.users
  }).then(res => {
    if (isApiResponseOk(res)) {
      commInviteWebJoin({
        id: board_id,
        role_id: res.data.role_id,
        type: invitationType,
        users: res.data.users
      }).then(res => {
        if (isApiResponseOk(res)) {
          message.success('邀请成功')
          if (calback && typeof calback == 'function') calback(values)
        }
      })
    }
  })
}
