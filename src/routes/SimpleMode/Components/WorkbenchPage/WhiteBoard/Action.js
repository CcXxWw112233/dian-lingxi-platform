import {
  fetchRooms,
  addWhiteBoardRoom,
  RemoveFeature,
  addFeature,
  EditFeature,
  fetchList,
  InvitationUser,
  KickOutUser,
  EditWhiteBoardRoom,
  AddPageForRoom,
  RemovePageForRoom,
  NetWorkFile
} from '../../../../../services/whiteBoard'
import { fabric } from 'fabric'
import { isApiResponseOk } from '../../../../../utils/handleResponseData'
import WEvent from 'whiteboard-lingxi/lib/utils/whiteBoardEvent'
import {
  updateData,
  TransformRecords,
  TranslateRecord,
  reSize,
  REDOLIST,
  UNDOLIST,
  RESET
} from 'whiteboard-lingxi/lib/utils'
import { WhiteBoardMain } from 'whiteboard-lingxi'
import WS from './websocket_wb'
import Cookies from 'js-cookie'
import { Avatar, message, notification } from 'antd'
import { uploadFileForAxios } from '../../../../../utils/requestAxios'
import { REQUEST_WHITEBOARD } from '../../../../../globalset/js/constant'
import { dataURLtoFile } from '../../../../../utils/util'
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
  isDisconnect = false
  reConnectWS = null
  isLogOut = false
  hasUpdate = false // 是否有数据更新，用来判定是不是要更新缩略图
  maxImgW = 500 // 图片最大宽度
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
      'whiteboard:room:user:del': this.userRemove,
      // 删除了
      'whiteboard:room:page:del': this.removePageFromWS,
      'whiteboard:room:page:add': this.PageAddFromWS
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
      if (record_id) RemoveFeature({ record_id: record_id })
      this.hasUpdate = true
    })
    // 有图片上传
    WEvent.on('drawend:img', ({ img, type, file }) => {
      this.uploadFile({ file }).then(res => {
        // console.log(res)
        let resp = res.data
        if (isApiResponseOk(resp)) {
          let data = resp.data
          img.set('send_src', data.path)
          this.addJSON(img, type, { src: data.path })
        }
      })
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
    WEvent.on('ws:open', () => {
      console.log('open')
      this.isDisconnect = false
      clearTimeout(this.reConnectWS)
    })
    WEvent.on('ws:message', ({ ws, message }) => {
      // console.log(message)
      clearTimeout(this.reConnectWS)
      if (message === 'pong') {
        clearTimeout(this.wsTimer)
        this.wsTimer = setTimeout(() => {
          ws.send('ping')
        }, 3 * 1000)
      }
      if (message && message !== 'pong') {
        this.isDisconnect = false

        let msg = JSON.parse(message)
        if (msg.detail) {
          let code = msg.detail.messageCode
          // console.log(code, this.wsKeys)
          this.wsKeys[code] && this.wsKeys[code](msg)
        }
      }
    })
    WEvent.on('ws:close', () => {
      // console.log('close')
      this.isDisconnect = true
      if (this.isLogOut) return
      // message.warn('连接已断开')
      this.toReconnect()
    })
    WEvent.on('ws:error', () => {
      this.toReconnect()
    })
    window.document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        if (this.isDisconnect && !this.isLogOut) {
          // 重连
          this.openWS()
        }
      }
    })
  }
  clear = () => {
    if (this.WhiteBoard) {
      this.WhiteBoard.forEachObject(obj => {
        this.WhiteBoard.remove(obj)
      })
    }
    RESET()
  }

  /**
   * 删除页数
   * @param {*} val 参数
   */
  removePageFromWS = val => {
    if (this.checkIsOwn(val?.detail?.creator)) return
    let page = val.detail.content
    WEvent.dispatchDEvent('page_remove', page)
  }

  PageAddFromWS = val => {
    if (this.checkIsOwn(val?.detail?.creator)) return
    let content = val.detail.content || {}
    let page = content.pageNumber
    WEvent.dispatchDEvent('page_add', page)
  }

  /**
   * 从右侧项目列表中添加图片
   * @param {} url 图片地址
   */
  addImageFromBoard = url => {
    let activeObject = this.WhiteBoard.getActiveObject()
    if (
      activeObject &&
      activeObject.get('add_from') === 'board' &&
      activeObject.type === 'image'
    ) {
      let id = activeObject.get('record_id')
      if (id) RemoveFeature({ record_id: id })
      this.WhiteBoard.remove(activeObject)
    }
    this.createImage(url).then(img => {
      // let key = 'thumbnail/'
      let key = '.com/'
      let path = url.split(key)[1]
      img.set('send_src', path)
      img.set('add_from', 'board')
      img.selectable = false
      this.addJSON(img, 'image', { src: path })
      this.WhiteBoard.add(img).setActiveObject(img)
      REDOLIST.push(img)
      img.on('deselected', () => {
        img.set('add_from', '')
      })
    })
  }

  resize = () => {
    reSize(this.WhiteBoard, WhiteBoardMain.id)
  }

  //重连机制
  toReconnect = () => {
    clearTimeout(this.reConnectWS)
    this.reConnectWS = setTimeout(() => {
      this.openWS()
    }, 5000)
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
      // notification.info({
      //   message: '移除成员',
      //   description: (
      //     <div>
      //       <Avatar src={content?.avatar} />
      //       <span
      //         style={{ marginLeft: 10, fontSize: '1.1em', fontWeight: 'bold' }}
      //       >
      //         {content.name}
      //       </span>{' '}
      //       离开了房间
      //     </div>
      //   ),
      //   placement: 'bottomRight'
      // })
      /**
       * 退出房间，强制离开
       */
      if (
        (content || content.id || content.user_id) ===
        (this.user.user_id || this.user.id)
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
      this.hasUpdate = true
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
    this.hasUpdate = true
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
      `${window.location.origin.replace('http', 'ws')}/websocket?t=wp&uid=${
        this.room_id
      }&token=${this.Authorization}`
    )
    WEvent.on('ws:open', ({ ws }) => {
      ws.send('ping')
    })
  }
  /**
   * 关闭websocket
   */
  closeWS = () => {
    this.isLogOut = true
    this.whiteboard_ws.disconnect()
    clearTimeout(this.wsTimer)
  }
  /**
   *
   * @param {*} wb
   * @param {*} page_number 白板页数
   * @param {*} room_id 房间id
   */
  init = async (wb, page_number, room_id) => {
    this.isLogOut = false
    this.WhiteBoard = wb
    return await this.getRoomMsg(room_id, page_number)
  }

  //根据页数获取数据
  getRoomMsg = (room_id, page_number) => {
    return new Promise((resolve, reject) => {
      fetchList({ page_number, room_id })
        .then(res => {
          resolve(res)
          // 更新禁用状态
          let data = (res.data.records || []).map(item => {
            if (item.create_by != this.user.id) {
              item.detail.disabled = 'true'
            } else if (item.detail) {
              item.detail.disabled = 'false'
            }
            if (!item.detail) item.detail = {}
            return item
          })
          let arr = TransformRecords(data)
          // 将禁用的数据设置为不可选
          arr = arr.map(item => {
            if (item.disabled) {
              item.selectable = false
            }
            if (item.type === 'image') {
              item.crossOrigin = 'anonymous'
            }
            return item
          })
          updateData(this.WhiteBoard, arr)
        })
        .catch(err => {
          reject(err)
        })
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
    if (obj.type === 'image') {
      if (obj.get('send_src')) {
        json.src = obj.get('send_src')
      }
      delete json.filters
      let k = '.com/'
      if (json.src && json.src.indexOf('.com/') !== -1) {
        json.src = json.src.split(k)[1]
      }
      // json.src.indexOf('whiteboard/') !== -1 ? 'whiteboard/' : 'thumbnail/'
    }
    EditFeature(json).then(res => {
      obj.set('record_id', res.data)
      obj.set('creator', this.user)
      this.hasUpdate = true
    })
  }

  /**
   *
   * @param {*} val 主要对象
   * @param {*} type 添加对象类型
   */
  addJSON = (val, type, addParam = {}) => {
    let json = this.toTransformJson(val.toJSON(), type)
    let containerSize = this.domContainer()
    let size = [containerSize.width, containerSize.height].join(',')
    json.container_size = size
    json.page_number = this.page_number
    if (val.type === 'image') {
      if (val.get('send_src')) {
        json.src = val.get('send_src')
      }
      let k = '.com/'
      if (json.src && json.src.indexOf('.com/') !== -1) {
        json.src = json.src.split(k)[1]
      }
      // json.src.indexOf('whiteboard/') !== -1 ? 'whiteboard/' : 'thumbnail/'
      delete json.filters
      json.crossOrigin = 'anonymous'
    }
    addFeature({ ...json, ...addParam }).then(res => {
      val.set('record_id', res.data)
      val.selectable = true
      this.hasUpdate = true
      val.canvas.requestRenderAll()
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
    obj.page_number = this.page_number
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
  /**
   * 上传文件不使用antd
   */
  uploadFile = data => {
    let formdata = new FormData()
    for (let key in data) {
      formdata.append(key, data[key])
    }
    let url = `${REQUEST_WHITEBOARD}/whiteboard/room/file`
    return uploadFileForAxios(url, formdata)
  }

  /**
   * 添加一页
   * @param {*} data
   */
  addPage = async data => {
    const res = await AddPageForRoom(data)
    if (isApiResponseOk(res)) {
      return res
    }
    return Promise.reject()
  }

  /**
   * 删除一页
   * @param {} data roomid
   * @param page_number
   */
  removePage = async data => {
    const res = await RemovePageForRoom(data)
    if (isApiResponseOk(res)) {
      return res
    }
    return Promise.reject()
  }

  /**
   * 在白板中上传网络图片
   * @param {*} data file_name and url
   */
  addNetWorkFile = async data => {
    const res = await NetWorkFile(data)
    if (isApiResponseOk(res)) {
      return res
    }
    return Promise.reject()
  }

  /**
   * 保存白板房间的缩略图
   */
  saveWhiteBoardPic = (room = {}) => {
    if (!this.hasUpdate) return Promise.reject()
    return new Promise((resolve, reject) => {
      let dataUrl = this.WhiteBoard.toDataURL()
      let file = dataURLtoFile(dataUrl, 'wb' + new Date().getTime() + '.png')
      this.hasUpdate = false
      // 先上传，再更新
      this.uploadFile({ file }).then(res => {
        let data = res.data
        EditWhiteBoardRoom({
          id: room.id,
          name: room.name,
          thumbnail_url: data.data.path
        })
          .then(resp => {
            resolve(data)
          })
          .catch(err => reject(err))
      })
    })
  }

  /**
   * 创建一个本地图片
   */
  createImage = url => {
    return new Promise(resolve => {
      fabric.Image.fromURL(
        url,
        img => {
          let center = WhiteBoardMain.getDomCenter()
          let radio = 1
          if ((img.width || 0) > this.maxImgW) {
            radio = this.maxImgW / (img.width || 0)
          }
          let w = (img.width || 0) * radio
          let h = (img.height || 0) * radio
          img.set({
            left: center.x - w / 2,
            top: center.y - h / 2,
            scaleX: radio,
            scaleY: radio,
            crossOrigin: 'anonymous'
          })
          resolve(img)
        },
        { crossOrigin: 'anonymous' }
      )
    })
  }
}

const A = new Action()
export default A
