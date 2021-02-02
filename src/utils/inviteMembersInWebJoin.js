import { message } from 'antd'
import {
  commInviteWebJoin,
  inviteNewUserInProject,
  organizationInviteWebJoin
} from '../services/technological'
import { getOrgIdByBoardId, setRequestHeaderBaseInfo } from './businessFunction'
import { isApiResponseOk } from './handleResponseData'

// import Avatars from '@dicebear/avatars'
// import SpriteBoottts from '@dicebear/avatars-bottts-sprites'
// import SpriteMale from '@dicebear/avatars-male-sprites'
import {
  REQUEST_DOMAIN,
  REQUEST_INTERGFACE_VERSIONN
} from '../globalset/js/constant'
import Cookies from 'js-cookie'
import axios from 'axios'
import { validateTel, validOnlyNumber } from './verify'
const options = {
  radius: 32,
  width: 32,
  height: 32
}
// const avatars = new Avatars(SpriteMale, options)
const avatars = { create: () => {} }

/**
 * 将用户id过滤出来。不是用户id的，如果是手机号，则进行注册再邀请。如果不是用户id也不是手机号，则筛掉。
 * @param {Array} users [id,phoneNo]
 * @returns {Array} j
 */
export async function handleInviteUsersToId({ users = [] }) {
  //用户id
  const effective_user_ids = users.filter(
    item => item.length > 18 && validOnlyNumber(item)
  )
  //用户手机
  const user_tels = users.filter(
    item => validateTel(item) && validOnlyNumber(item)
  )
  if (user_tels.length) {
    const res = await inviteNewUserInProject({ data: user_tels.join(',') })
    // debugger
    if (isApiResponseOk(res)) {
      const users = res.data.map(item => item.id)
      return [...effective_user_ids, ...users]
    } else {
      return []
    }
  }
  return [...effective_user_ids]
}
/**
 * 邀请成员 进组织和项目
 * @param {String} invitationType 邀请类型
 * @param {String} invitationId 项目ID 或任务id 或流程id等等，根据invitationType不同类型来传
 * @param {String} org_id 组织ID
 * @param {String} users 数据 'id1,id2,id3'
 * @param {function} calback 回调函数
 * @param {Object} join_board_param 邀请进项目其它特定参数

 */
export async function inviteMembersInWebJoin({
  invitationType,
  invitationId,
  org_id,
  board_id,
  users,
  calback,
  join_board_param = {}
}) {
  const org_id_ = org_id ? org_id : getOrgIdByBoardId(board_id)
  const user_ids = await handleInviteUsersToId({
    users: users.split(',')
  })
  // debugger
  if (!user_ids.length) return
  organizationInviteWebJoin({
    _organization_id: org_id_,
    type: invitationType,
    users: user_ids
  }).then(res => {
    if (isApiResponseOk(res)) {
      commInviteWebJoin({
        id: invitationId,
        role_id: res.data.role_id,
        type: invitationType,
        users: res.data.users,
        ...join_board_param
      }).then(res => {
        if (isApiResponseOk(res)) {
          message.success('邀请成功')
          console.log(calback)
          if (calback && typeof calback == 'function')
            calback({ users: user_ids })
        } else {
          message.warn(res.message)
        }
      })
    } else {
      message.warn(res.message)
    }
  })
}

export const axiosForSend = (url, data) => {
  const Authorization = Cookies.get('Authorization')
  return new Promise((resolve, reject) => {
    axios
      .post(url, data, {
        headers: {
          Authorization,
          ...setRequestHeaderBaseInfo({ data, headers: {}, params: {} })
        }
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

// base64转文件
export const dataURLtoFile = (dataurl, filename) => {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

// 注册用户并生成头像
export const getEnrollUsers = user => {
  let svg = avatars.create(user)
  let file = dataURLtoFile(
    'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg))),
    user + '.svg'
  )
  let data = new FormData()
  data.append('file', file)
  return new Promise((resolve, reject) => {
    axiosForSend(
      `${REQUEST_DOMAIN}/user/signup/invite/single?invitee_account=${user}`,
      data
    )
      .then(res => {
        // console.log(res)
        if (isApiResponseOk(res)) {
          resolve(res.data.id)
        } else {
          reject({})
        }
      })
      .catch(err => {
        message.warn('上传头像失败，请稍后重试')
      })
  })
}

export const getIcons = async (users = []) => {
  // let users = this.getRequestParams()
  for (let i = 0; i < users.length; i++) {
    if (!users[i].id) {
      const user_id = await getEnrollUsers(users[i].user)
      users[i].id = user_id
    }
  }
  return users
}
