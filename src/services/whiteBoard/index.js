import request from '../../utils/requestAxios'
import { REQUEST_WHITEBOARD } from '../../globalset/js/constant'

// 获取列表
export const fetchList = async data => {
  const method = 'GET'
  const resp = await request({
    url: `${REQUEST_WHITEBOARD}/whiteboard/postil/record`,
    method,
    data,
    params: data
  })
  return resp
}
// 获取房间列表
export const fetchRooms = params => {
  return request({
    url: `${REQUEST_WHITEBOARD}/whiteboard/room/list`,
    method: 'get',
    params
  })
}

// 新建房间
export const addWhiteBoardRoom = data => {
  return request({
    url: `${REQUEST_WHITEBOARD}/whiteboard/room`,
    method: 'POST',
    data
  })
}

// 编辑房间
export const EditWhiteBoardRoom = data => {
  return request({
    url: `${REQUEST_WHITEBOARD}/whiteboard/room`,
    method: 'PUT',
    data
  })
}

export const addFeature = async data => {
  const resp = await request(
    {
      url: `${REQUEST_WHITEBOARD}/whiteboard/postil/record`,
      method: 'POST',
      data
    },
    { isNotLoading: true }
  )
  return resp
}

export const RemoveFeature = async data => {
  const resp = await request(
    {
      url: `${REQUEST_WHITEBOARD}/whiteboard/postil/record/single`,
      method: 'DELETE',
      params: data
    },
    { isNotLoading: true }
  )
  return resp
}

export const EditFeature = async data => {
  const resp = await request(
    {
      url: `${REQUEST_WHITEBOARD}/whiteboard/postil/record`,
      method: 'PUT',
      data: data
    },
    { isNotLoading: true }
  )
  return resp
}

/**
 * 邀请用户
 * @param {} params 用户id和房间id
 */
export const InvitationUser = params => {
  return request({
    url: `${REQUEST_WHITEBOARD}/whiteboard/room/user`,
    method: 'POST',
    params,
    data: params
  })
}

/**
 * 剔除用户
 * @param {*} data 房间号和用户id
 */
export const KickOutUser = data => {
  return request({
    url: `${REQUEST_WHITEBOARD}/whiteboard/room/user`,
    method: 'DELETE',
    data
  })
}

/**
 * 添加一页
 * @param data.room_id 房间id
 * @param data.page_number 页码
 */
export const AddPageForRoom = data => {
  return request({
    url: `${REQUEST_WHITEBOARD}/whiteboard/postil/page`,
    method: 'POST',
    data
  })
}

/**
 * 删除一页
 * @param page_number 页码
 * @param room_id 房间id
 */
export const RemovePageForRoom = data => {
  return request({
    url: `${REQUEST_WHITEBOARD}/whiteboard/postil/page`,
    method: 'DELETE',
    params: data
  })
}

/**
 * 上传网络图片
 * @param data file_name and url
 */
export const NetWorkFile = data => {
  return request({
    url: `${REQUEST_WHITEBOARD}/whiteboard/room/network/file`,
    method: 'POST',
    data
  })
}
