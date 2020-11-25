import request from '@/utils/requestAxios'
import { REQUEST_PREFIX } from '../../../../../globalset/js/constant'
import { isApiResponseOk } from '../../../../../utils/handleResponseData'
import { uploadFileForAxios } from '../../../../../utils/requestAxios'
const REQUEST_ROOM_URL = `${REQUEST_PREFIX}/meeting`

class Action {
  /**
   * 获取会议室列表
   * @param {*} data 组织ID
   */
  fetchList = async data => {
    const res = await request({
      method: 'GET',
      url: `${REQUEST_ROOM_URL}/room`,
      data,
      params: data
    })
    if (isApiResponseOk(res)) {
      return res.data
    } else return Promise.reject()
  }

  /**
   * 获取设备列表
   * @param {*} data
   */
  fetchDevices = async (data = {}) => {
    const res = await request({
      method: 'GET',
      url: `${REQUEST_ROOM_URL}/device/type`,
      data
    })
    if (isApiResponseOk(res)) {
      return res.data
    } else return Promise.reject()
  }

  /**
   * 保存一个会议室
   * @param {*} params 会议室数据
   */
  saveRoom = async params => {
    const res = await request({
      method: 'POST',
      url: `${REQUEST_ROOM_URL}/room`,
      data: params
    })
    if (isApiResponseOk(res)) {
      return res.data
    } else return Promise.reject(res)
  }

  /**
   * 获取会议室详情
   * @param {*} data
   */
  getMeetingInfo = async data => {
    const res = await request({
      method: 'GET',
      url: `${REQUEST_ROOM_URL}/room/${data.id}`
    })
    if (isApiResponseOk(res)) {
      return res.data
    } else return Promise.reject()
  }

  /**
   * 修改会议室详情
   * @param {*} data 会议室数据
   */
  editMeetingInfo = async data => {
    const res = await request({
      method: 'PUT',
      url: `${REQUEST_ROOM_URL}/room/${data.id}`,
      data
    })
    if (isApiResponseOk(res)) {
      return res.data
    } else return Promise.reject()
  }

  /**
   * 删除会议室照片
   */
  removePicture = async data => {
    const res = await request({
      method: 'DELETE',
      url: `${REQUEST_ROOM_URL}/room/image/${data.id}`
    })
    if (isApiResponseOk(res)) {
      return res.data
    } else return Promise.reject()
  }

  /**
   * 删除会议室
   * @param {*} data id
   */
  removeMeetingRoom = async data => {
    const res = await request({
      method: 'DELETE',
      url: `${REQUEST_ROOM_URL}/room/${data.id}`
    })
    if (isApiResponseOk(res)) {
      return res.data
    } else return Promise.reject()
  }

  /**
   * 检查绑定码是否有效
   * @param data bind_code
   */
  checkBindCode = async data => {
    const res = await request({
      method: 'POST',
      url: `${REQUEST_ROOM_URL}/device/bind_code/check`,
      data,
      params: data
    })
    if (isApiResponseOk(res)) {
      return res
    } else return Promise.reject(res)
  }

  /**
   * 传图片
   * @param {formData} data {file: file}
   */
  uploadFile = async data => {
    const res = await uploadFileForAxios(
      `${REQUEST_ROOM_URL}/common/upload`,
      data
    )
    if (isApiResponseOk(res.data)) {
      return res.data
    } else return Promise.reject()
  }

  getHours = time => {
    let t = new Date(time)
    let h = t.getHours()
    let m = t.getMinutes()
    h += m >= 30 ? 0.5 : 0
    return h
  }

  forMatTime = val => {
    let text = ''
    let H = Math.floor(val.time)
    if (val.time - H) {
      let minut = val.time - H
      minut = minut * 60
      text = H + ':' + minut
    } else text = H + ':' + '00'
    return text
  }
}

export default new Action()
