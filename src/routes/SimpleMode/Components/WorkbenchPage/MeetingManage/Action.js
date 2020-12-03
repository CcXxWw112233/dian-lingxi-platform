import request from '@/utils/requestAxios'
import { REQUEST_PREFIX } from '../../../../../globalset/js/constant'
import { isApiResponseOk } from '../../../../../utils/handleResponseData'
import { uploadFileForAxios } from '../../../../../utils/requestAxios'
import sha256 from 'js-sha256'
const REQUEST_ROOM_URL = `${REQUEST_PREFIX}/meeting`
// const REQUEST_ROOM_URL = 'api/meeting'

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
    } else return Promise.reject(res)
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
   * 获取授权组织列表
   * @param {org_id} data 组织id org_id
   */
  getRoomAuthList = async data => {
    const res = await request({
      method: 'GET',
      url: `${REQUEST_ROOM_URL}/room/auth`,
      data,
      params: data
    })
    if (isApiResponseOk(res)) {
      return res
    } else return Promise.reject(res)
  }

  /**
   * 获取会议室列表
   * @param {org_id} data 组织id org_id
   */
  getRoomList = async data => {
    const res = await request({
      method: 'GET',
      url: `${REQUEST_ROOM_URL}/room/list`,
      params: data
    })
    if (isApiResponseOk(res)) {
      return res
    } else return Promise.reject(res)
  }

  /**
   * 授权组织接口
   * @param {*} data 授权传参
   */
  addAuthOrg = async data => {
    const res = await request({
      method: 'POST',
      url: `${REQUEST_ROOM_URL}/room/auth`,
      data
    })
    if (isApiResponseOk(res)) return res
    return Promise.reject(res)
  }

  /**
   * 保存修改授权的参数
   * @param {*} data
   */
  SaveEditRoom = async data => {
    const res = await request({
      method: 'PUT',
      url: `${REQUEST_ROOM_URL}/room/auth/${data.id}`,
      data
    })
    if (isApiResponseOk(res)) return res
    return Promise.reject(res)
  }

  /**
   * 删除授权项
   * @param {*} data
   */
  DelRoomOrg = async data => {
    const res = await request({
      method: 'DELETE',
      url: `${REQUEST_ROOM_URL}/room/auth/${data.id}`,
      data
    })
    if (isApiResponseOk(res)) return res
    return Promise.reject(res)
  }

  getHashString(length = 15) {
    let str1 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
    let str2 = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    let str = ''
    for (let i = 0; i < length; i++) {
      let stringIndex = Math.round(Math.random() * 1)
      let item = [str1, str2][stringIndex]
      let index = Math.round(Math.random() * (item.length - 1))
      let text = item[index]
      str += text
    }
    return str
  }
  /**
   * 修改定价 价格需要进行加密处理
   * @param {*} data
   */
  ChangePrice = async data => {
    let headers = { Signature: '' }
    let param = {
      app: 'huixiebao',
      time: parseInt(new Date().getTime() / 1000, 10),
      nonce: this.getHashString(),
      sign: ''
    }
    let hashString = `${param.app}\n${param.time}\n${
      param.nonce
    }\n${JSON.stringify({ ...data })}`
    param.sign = sha256(hashString)

    headers.Signature = window.btoa(JSON.stringify(param))
    const res = await request({
      method: 'PUT',
      url: `${REQUEST_ROOM_URL}/room/cost`,
      data,
      headers
    })
    if (isApiResponseOk(res)) return res
    return Promise.reject(res)
  }

  /**
   * 获取历史记录中的组织列表
   * @param {*} data org_id: orgid
   */
  getHistoryOrgList = async data => {
    const res = await request({
      method: 'GET',
      url: `${REQUEST_ROOM_URL}/plan/order/org`,
      data,
      params: data
    })
    if (isApiResponseOk(res)) return res
    return Promise.reject(res)
  }

  /**
   * 获取使用记录列表
   * @param {*} data
   */
  getHistoryUseList = async data => {
    const res = await request({
      method: 'POST',
      url: `${REQUEST_ROOM_URL}/plan/order/list`,
      data
    })
    if (isApiResponseOk(res)) return res
    return Promise.reject(res)
  }

  /**
   * 获取应收账单列表 传入org_id和分页参数
   * @param {*} data
   */
  getReceivable = async data => {
    const res = await request({
      method: 'GET',
      url: `${REQUEST_ROOM_URL}/bill/receivable/list`,
      data,
      params: data
    })
    if (isApiResponseOk(res)) return res
    return Promise.reject(res)
  }

  /**
   * 获取应付账单 传入 org_id 和分页参数
   * @param {*} data
   */
  getPayable = async data => {
    const res = await request({
      method: 'GET',
      url: `${REQUEST_ROOM_URL}/bill/payable/list`,
      data,
      params: data
    })
    if (isApiResponseOk(res)) return res
    return Promise.reject(res)
  }

  /**
   * 获取订单明细 传入订单id，跟随url
   * @param {*} data
   */
  getOrderDetail = async data => {
    const res = await request({
      method: 'GET',
      url: `${REQUEST_ROOM_URL}/bill/detail/${data.id}`,
      data
    })
    if (isApiResponseOk(res)) return res
    return Promise.reject(res)
  }

  /**
   * 生成账单
   * @param {*} data
   */
  setGenerate = async data => {
    const res = await request({
      method: 'POST',
      url: `${REQUEST_ROOM_URL}/bill/generate`,
      data
    })
    if (isApiResponseOk(res)) return res
    return Promise.reject(res)
  }

  /**
   * 设置优惠金额
   * @param {*} data bill_id, discount_cost
   */
  setBillDiscount = async data => {
    let headers = {
      Signature: ''
    }
    let param = {
      app: 'huixiebao',
      time: parseInt(new Date().getTime() / 1000, 10),
      nonce: this.getHashString(),
      sign: ''
    }
    let hashString = `${param.app}\n${param.time}\n${
      param.nonce
    }\n${JSON.stringify({ ...data })}`
    param.sign = sha256(hashString)

    headers.Signature = window.btoa(JSON.stringify(param))
    const res = await request({
      method: 'PUT',
      url: `${REQUEST_ROOM_URL}/bill/discount`,
      data,
      headers
    })
    if (isApiResponseOk(res)) return res
    return Promise.reject(res)
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
    } else return Promise.reject(res.data)
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
