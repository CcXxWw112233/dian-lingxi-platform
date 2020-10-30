import {
  fetchRooms,
  addWhiteBoardRoom,
  RemoveFeature,
  addFeature,
  EditFeature,
  fetchList,
  InvitationUser,
  KickOutUser
} from '../../../../../services/whiteBoard'
import { isApiResponseOk } from '../../../../../utils/handleResponseData'
import WEvent from 'whiteboard-lingxi/lib/utils/whiteBoardEvent'
import {
  updateData,
  TransformRecords,
  TranslateRecord
} from 'whiteboard-lingxi/lib/utils'
import { WhiteBoardMain } from 'whiteboard-lingxi'
import WS from './websocket_wb'
import Cookies from 'js-cookie'
import { Avatar, message, notification } from 'antd'
class Action {
  room_id
  whiteboard_ws
  Authorization = Cookies.get('Authorization')
  WhiteBoard
  page_number = 1
  user = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : {}
  wsKeys = {}
  wsTimer = null
  editTimer = null
  constructor() {
    WEvent.on('drawend:feature', ({ feature, type }) => {
      feature.set('creator', this.user)
      this.addJSON(feature, type)
    })
    /**
     * ws需要用到的key
     */
    this.wsKeys = {
      // 数据添加
      'postil:add': this.featureAdd,
      // 数据删除
      'postil:del': this.featureRemove,
      // 人员添加
      'whiteboard:room:user:add': this.userAdd,
      // 人员删除
      'whiteboard:room:user:del': this.userRemove
    }
    // 画一个图
    WEvent.on('object:remove', obj => {
      let record_id = obj.get('record_id')
      if (obj.get('creator')) {
        let creator = obj.get('creator')
        if (creator.id !== this.user.id) {
          return
        }
      }
      RemoveFeature({ record_id: record_id })
    })
    // 有编辑数据
    WEvent.on('object:edit', obj => {
      clearTimeout(this.editTimer)
      this.editTimer = setTimeout(() => {
        if (obj.type === 'activeSelection') {
          obj.getObjects().forEach(item => {
            this.saveEdit(item)
          })
          return
        } else {
          this.saveEdit(obj)
        }
      }, 100)
    })
    WEvent.on('ws:message', ({ ws, message }) => {
      // console.log(message)
      if (message === 'pong') {
        clearTimeout(this.wsTimer)
        this.wsTimer = setTimeout(() => {
          ws.send('ping')
        }, 10 * 1000)
      }
      if (message && message !== 'pong') {
        let msg = JSON.parse(message)
        if (msg.detail) {
          let code = msg.detail.messageCode
          // console.log(code, this.wsKeys)
          this.wsKeys[code] && this.wsKeys[code](msg)
        }
      }
    })
    WEvent.on('ws:close', () => {
      message.warn('连接已断开')
    })
  }

  /**
   * 添加用户
   */
  userAdd = val => {
    // console.log(val, 'add')
    if (!this.checkIsOwn(val.detail?.creator)) {
      let content = val.detail?.content
      notification.success({
        message: '成员加入',
        description: (
          <div>
            <Avatar src={content?.avatar} />
            <span
              style={{ marginLeft: 10, fontSize: '1.1em', fontWeight: 'bold' }}
            >
              {content.name}
            </span>{' '}
            加入了房间
          </div>
        ),
        placement: 'bottomRight'
      })
    }
  }
  /**
   * 删除用户（踢出用户）
   */
  userRemove = val => {
    if (!this.checkIsOwn(val.detail?.creator)) {
      let content = val.detail?.content
      notification.info({
        message: '移除成员',
        description: (
          <div>
            <Avatar src={content?.avatar} />
            <span
              style={{ marginLeft: 10, fontSize: '1.1em', fontWeight: 'bold' }}
            >
              {content.name}
            </span>{' '}
            离开了房间
          </div>
        ),
        placement: 'bottomRight'
      })
      /**
       * 退出房间，强制离开
       */
      if (
        (content.id || content.user_id) === (this.user.user_id || this.user.id)
      )
        WEvent.dispatchDEvent('exit:room', 'KickOut')
    }
  }
  /**
   * 获取白板的中心位置
   */
  domContainer = () => {
    let dom = document.querySelector('#' + WhiteBoardMain.id)
    if (dom) {
      return {
        width: dom.clientWidth,
        height: dom.clientHeight
      }
    } else return undefined
  }
  /**
   * 检查是不是自己操作的数据
   */
  checkIsOwn = (creator = {}) => {
    if (creator.id === this.user.id) {
      return true
    }
    return false
  }
  /**
   * 从websocket添加的数据，进入不可选状态
   * @param {*} content
   */
  featureAdd = content => {
    // 添加了
    let c = content.detail.content
    let record = c.record
    // console.log(record, '添加了数据')
    if (
      !this.checkIsOwn(content?.detail?.creator) &&
      c.pageNumber === this.page_number
    ) {
      // this.WhiteBoard.add(record)
      record.detail.record_id = record.id
      let rc = TranslateRecord(record.detail)
      rc.record_id = record.id
      rc.drawType = record.detail.drawType
      rc.creator = content?.detail?.creator
      rc.selectable = false
      rc.disabled = true
      rc.container_size = record.containerSize || ''
      WhiteBoardMain.AddObject(rc)
    }
  }

  /**
   * websocket传入的删除操作
   * @param {*} content 删除的数据
   */
  featureRemove = content => {
    let con = content.detail.content
    let r_id = con
    if (!this.checkIsOwn(content?.detail?.creator))
      this.WhiteBoard.forEachObject(item => {
        if (item.get('record_id') == r_id) {
          this.WhiteBoard.remove(item)
          this.WhiteBoard.requestRenderAll()
        }
      })
  }
  /**
   * 开启websocket
   */
  openWS = () => {
    this.whiteboard_ws = new WS()
    this.whiteboard_ws.open(
      `${window.location.origin.replace(
        /^(https?)/,
        'ws'
      )}/ws/websocket?t=wp&uid=${this.room_id}&token=${this.Authorization}`
    )
    WEvent.on('ws:open', ({ ws }) => {
      ws.send('ping')
    })
  }
  /**
   * 关闭websocket
   */
  closeWS = () => {
    this.whiteboard_ws.disconnect()
    clearTimeout(this.wsTimer)
  }
  /**
   *
   * @param {*} wb
   * @param {*} page_number 白板页数
   * @param {*} room_id 房间id
   */
  init = (wb, page_number, room_id) => {
    fetchList({ page_number, room_id }).then(res => {
      this.WhiteBoard = wb
      // 更新禁用状态
      let data = (res.data.records || []).map(item => {
        if (item.create_by != this.user.id) {
          item.detail.disabled = 'true'
        } else {
          item.detail.disabled = 'false'
        }
        return item
      })
      let arr = TransformRecords(data)
      // 将禁用的数据设置为不可选
      arr = arr.map(item => {
        if (item.disabled) {
          item.selectable = false
        }
        return item
      })
      updateData(wb, arr)
    })
  }
  /**
   * 保存修改
   * @param {*} obj 修改的对象
   */
  saveEdit = obj => {
    let containerSize = this.domContainer()
    let size = [containerSize.width, containerSize.height].join(',')
    let record_id = obj.get('record_id')
    let json = this.toTransformJson(obj.toJSON())
    delete json.postil_type
    delete json.room_id
    delete json.page_number
    delete json.creator
    json.record_id = record_id
    json.container_size = size
    EditFeature(json).then(res => {
      obj.set('record_id', res.data)
      obj.set('creator', this.user)
    })
  }

  /**
   *
   * @param {*} val 主要对象
   * @param {*} type 添加对象类型
   */
  addJSON = (val, type) => {
    let json = this.toTransformJson(val.toJSON(), type)
    let containerSize = this.domContainer()
    let size = [containerSize.width, containerSize.height].join(',')
    json.container_size = size
    addFeature(json).then(res => {
      val.set('record_id', res.data)
    })
  }
  /**
   *
   * @param json 画的对象
   * @param type 画的类型
   */
  toTransformJson = (json, type) => {
    let obj = { ...json }
    obj.styles = obj.styles ? JSON.stringify(obj.styles) : null
    obj.path = obj.path ? JSON.stringify(obj.path) : null
    obj.postil_type = 1
    obj.room_id = this.room_id
    obj.page_number = 1
    if (type) obj.drawType = type
    return obj
  }
  getOrgId = data => {
    const _organization_id =
      localStorage.getItem('OrganizationId') === '0'
        ? localStorage.getItem('OrganizationId')
        : !data
        ? data.organization_id
        : localStorage.getItem('OrganizationId')
    return _organization_id
  }
  /**
   *
   * @param {*} data 获取房间列表需要的参数
   */
  fetchList = async data => {
    data = data || {}
    // let orgId = this.getOrgId(data)
    let res = await fetchRooms(data)
    if (isApiResponseOk(res)) {
      // console.log(res)
      return res
    }
    return Promise.reject()
  }
  /**
   *
   * @param {*} data 添加房间需要的参数
   */
  addWhiteBoardRoom = async data => {
    // let param = {
    //   _organization_id: this.getOrgId(data),
    //   name: data.name
    // }
    let res = await addWhiteBoardRoom(data)
    if (isApiResponseOk(res)) {
      // console.log(res)
      return res
    }
    return Promise.reject()
  }

  /**
   * 邀请组织中的人员
   * @param {user_id, room_id} data 房间id和用户id
   */
  invitationUser = async data => {
    const res = await InvitationUser(data)
    if (isApiResponseOk(res)) {
      return res
    }
    return Promise.reject()
  }

  /**
   * 踢出用户
   */
  KickOutUser = async data => {
    const res = await KickOutUser(data)
    if (isApiResponseOk(res)) {
      return res
    }
    return Promise.reject()
  }
}

const A = new Action()
export default A
