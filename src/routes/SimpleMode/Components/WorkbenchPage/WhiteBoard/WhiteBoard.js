import React, { Fragment } from 'react'
import styles from './index.less'
import globalStyles from '../../../../../globalset/css/globalClassName.less'
import WhiteBoard, { WTools, Controller } from 'whiteboard-lingxi'
import { WEvent } from 'whiteboard-lingxi/lib/utils'
import Action from './Action'
import SelectMembers from '../../../../../components/MenuSearchMultiple/MenuSearchPartner'
import { getCurrentOrgAccessibleAllMembers } from '../../../../../services/technological/workbench'
import { dataURLtoFile } from '../../../../../utils/util'
import { getProjectList } from '../../../../../services/technological/projectCommunication'
import { REQUEST_DOMAIN_FILE } from '../../../../../globalset/js/constant'
import { setUploadHeaderBaseInfo } from '../../../../../utils/businessFunction'
import {
  fileUpload,
  fileToUpload,
  getFolderList
} from '../../../../../services/technological/file'
import { uploadFileForAxios } from '../../../../../utils/requestAxios'
import {
  Dropdown,
  Menu,
  message,
  Modal,
  Input,
  Cascader,
  Button,
  Select
} from 'antd'
import RightContent from './components/boardContent'

export default class WhiteBoardRoom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      page_number: 1,
      users: [],
      intheRoomUsers: [],
      show: false,
      options: [],
      caser: [], // 级联选择器
      saveParam: {
        fileName: '',
        board_id: '',
        folder_id: ''
      },
      rightContentVisible: true,
      pages: []
    }
    WEvent.on('exit:room', () => {
      this.exitWhiteboard()
      Modal.info({
        centered: true,
        title: '移出房间通知',
        content: '您已被管理员移出房间,如有疑问,请联系管理员'
      })
    })
    WEvent.on('page_remove', page_number => {
      this.removePage(page_number, 'ws')
    })
    WEvent.on('page_add', page_number => {
      this.addPageFromWS(page_number)
    })
  }
  WB_lx = ''
  whiteboard_tools = React.createRef()
  componentDidMount() {
    // 打开websocket
    Action.openWS()
    Action.clear()
  }
  // 点击退出白板
  exitWhiteboard = () => {
    const { onClose } = this.props
    onClose && onClose()
  }
  componentWillUnmount() {
    // 关闭ws
    Action.closeWS()
    this.SendWhiteBoardPic()
  }
  /**
   * 退出时，更新当前房间概述图片
   */
  SendWhiteBoardPic = () => {
    const { onUpdatePic } = this.props
    onUpdatePic && onUpdatePic(this.props.room || {})
  }
  /**
   * 加载白板
   * @param {*} WB_lx 白板加载完成
   */
  WhiteBoardLoad = async WB_lx => {
    // 白板主体
    this.WB_lx = WB_lx
    let res = await Action.init(
      WB_lx,
      this.state.page_number,
      this.props.room_id
    )
    if (res.code === '0') {
      let data = res.data
      // 创建图层
      let arr = this.createPages(data.pages || [])
      this.setState({
        page_number: +(data.page_number || 1),
        pages: arr
      })
      Action.page_number = +(data.page_number || 1)
    }
    // 获取组织成员，去除自己的数据
    getCurrentOrgAccessibleAllMembers({
      _organization_id: this.props.room.org_id
    }).then(res => {
      // console.log(res)
      this.setState({
        users: (res.data?.users || [])
          .map(item => {
            return { ...item, user_id: item.id }
          })
          .filter(item => item.id !== Action.user.id),
        intheRoomUsers: this.props.room.users
      })
    })
  }

  // 创建图层，默认1
  createPages = page => {
    if (!page.length) return [{ url: '', index: 1 }]
    let arr = []
    for (let i = 0; i < page.length; i++) {
      arr.push({ url: '', index: page[i] })
    }
    return arr
  }

  /**
   * 点击用户选择
   */
  handleChangeMember = ({ key, type }) => {
    if (type === 'add') {
      Action.invitationUser({ room_id: this.props.room_id, user_id: key }).then(
        res => {
          message.success('已发送邀请')
        }
      )
    } else if (type === 'remove') {
      Action.KickOutUser({ room_id: this.props.room_id, user_id: key }).then(
        res => {
          message.success('已踢除用户')
        }
      )
    }
  }

  handleSaveToBoard = () => {
    const { room } = this.props
    // let dataUrl = this.WB_lx.toDataURL()
    // let file = dataURLtoFile(dataUrl, room.name + '.png')
    this.setState({
      show: true,
      saveParam: { ...this.state.saveParam, fileName: room.name }
    })
    // onSave && onSave(file)
  }

  handleMenu = ({ key }) => {
    const { room } = this.props
    if (key === 'save') {
      this.handleSaveToBoard()
    }
    // console.log(key)
    if (key === 'download') {
      let dataUrl = this.WB_lx.toDataURL()
      let a = document.createElement('a')
      a.href = dataUrl
      a.download = room.name + '.png'
      a.click()
      a = null
    }
  }

  // 加载第一层数据
  focusCascader = () => {
    getProjectList({ _organization_id: this.props.org_id }).then(res => {
      if (res.code === '0') {
        this.setState({
          options: res.data.map(item => {
            let obj = {
              value: item.board_id,
              label: item.board_name,
              isLeaf: false
            }
            return obj
          })
        })
      }
    })
  }

  /**
   * 通过文件夹id搜索文件或文件夹
   * @param {*} board_id 项目id
   * @param {*} folder_id 文件夹id
   */
  getFolderList = (board_id, folder_id = '') => {
    return new Promise((resolve, reject) => {
      getFolderList({ board_id }).then(res => {
        if (res.code === '0') {
          resolve(res.data)
        } else reject(res)
      })
    })
  }

  // 项目选择
  boardChange = val => {
    this.getFolderList(val).then(data => {
      this.setState({
        caser: [data],
        saveParam: { ...this.state.saveParam, board_id: val }
      })
    })
  }

  selectFolder = value => {
    let folder = value[value.length - 1]
    this.setState({
      saveParam: { ...this.state.saveParam, folder_id: folder }
    })
  }

  // 保存数据
  saveFile = () => {
    // const { room } = this.props
    const { saveParam } = this.state
    this.WB_lx.setBackgroundColor(
      '#ffffff',
      this.WB_lx.renderAll.bind(this.WB_lx)
    )
    let dataUrl = this.WB_lx.toDataURL()
    let file = dataURLtoFile(dataUrl, this.state.saveParam.fileName + '.png')

    let data = new FormData()
    data.append('board_id', saveParam.board_id)
    data.append('file', file)
    data.append('folder_id', saveParam.folder_id)
    data.append('type', 1)
    data.append('upload_type', 1)
    data.append('org_id', this.props.org_id)
    this.toogleSpin(true)
    let headers = setUploadHeaderBaseInfo({
      boardId: saveParam.board_id,
      orgId: this.props.org_id,
      aboutBoardOrganizationId: this.props.org_id,
      contentDataType: 'file'
    })
    uploadFileForAxios(`${REQUEST_DOMAIN_FILE}/file/upload`, data, headers)
      .then(res => {
        WEvent.dispatchDEvent('saveSuccess', res.data)
        this.setState({
          show: false
        })
        this.toogleSpin(false)
        setTimeout(() => {
          if (res.data.code === '0') message.success('保存成功')
        }, 10)
      })
      .catch(err => {
        this.setState({
          show: false
        })
        this.toogleSpin(false)
      })
  }

  // 右侧开关变量
  changeRightContent = val => {
    this.setState({
      rightContentVisible: val
    })
  }

  // 更新页码
  changePage = async val => {
    this.setState({
      page_number: +val.index
    })
    Action.page_number = +val.index
    Action.clear()
    this.toogleSpin(true)
    await Action.getRoomMsg(this.props.room.id, val.index)
    this.toogleSpin(false)
  }
  // 删除页码
  removePage = async (index, from = 'btn') => {
    // console.log(val)
    if (this.state.pages.length === 1) {
      return message.warn('最后一页无法删除')
    }
    let arr = Array.from(this.state.pages)
    arr = arr.filter(item => +item.index !== +index)
    if (index === this.state.page_number) {
      Action.clear()
      await this.changePage(arr[arr.length - 1])
    }
    this.setState({
      pages: arr
    })
    if (from === 'btn')
      await Action.removePage({
        page_number: index,
        room_id: this.props.room.id
      })
  }
  toogleSpin = flag => {
    const { dispatch } = this.props
    dispatch({
      type: 'technological/updateDatas',
      payload: {
        visibleWhiteboardSpin: flag
      }
    })
  }

  // 点击退出白板
  exitWhiteboard = () => {
    const { onClose } = this.props
    onClose && onClose()
  }

  //通过ws添加的
  addPageFromWS = index => {
    let arr = Array.from(this.state.pages).sort((a, b) => a.index - b.index)
    arr.push({ url: '', index: index })
    this.setState({
      pages: arr
    })
  }
  // 添加一页
  onPageAdd = async () => {
    let arr = Array.from(this.state.pages).sort((a, b) => a.index - b.index)
    let index = arr[arr.length - 1]?.index || 1
    let page_number = +index + 1
    arr.push({ url: '', index: page_number })
    this.setState({
      pages: arr,
      page_number
    })
    Action.page_number = page_number
    this.toogleSpin(true)
    await Action.addPage({ page_number, room_id: this.props.room.id })
    Action.clear()
    this.toogleSpin(false)
  }

  handleImgForBoard = val => {
    // console.log(val)
    const { current } = this.whiteboard_tools
    if (current) {
      current.setActiveByParent && current.setActiveByParent('hand')
    }
  }
  render() {
    const { show } = this.state
    return (
      <Fragment>
        <div
          className={`${styles.WhiteBoardRoom_container} ${
            this.state.rightContentVisible ? styles.minWidth : styles.maxWidth
          }`}
        >
          <div className={styles.whiteboard_rightOperation}>
            <Dropdown
              trigger={['click']}
              overlay={
                <Menu onClick={this.handleMenu}>
                  <Menu.Item key="save">保存到项目</Menu.Item>
                  <Menu.Item key="download">下载</Menu.Item>
                </Menu>
              }
            >
              <div>
                保存
                <span
                  className={globalStyles.authTheme}
                  style={{ transform: 'rotate(180deg)', marginLeft: 10 }}
                >
                  &#xe61f;
                </span>
              </div>
            </Dropdown>
          </div>
          <div className={`${styles.settings} ${globalStyles.authTheme}`}>
            {this.props.room.create_by === Action.user.id &&
              this.props.room.status == 1 && (
                <Dropdown
                  trigger="click"
                  overlay={
                    <SelectMembers
                      keyCode="user_id"
                      HideInvitationOther={true}
                      listData={this.state.users}
                      chirldrenTaskChargeChange={this.handleChangeMember}
                      searchName="name"
                      currentSelect={this.state.intheRoomUsers}
                    />
                  }
                >
                  <div className={styles.invitation}>
                    <span>&#xe7db;</span>
                  </div>
                </Dropdown>
              )}
          </div>
          <WhiteBoard onLoad={this.WhiteBoardLoad} RoomId={this.props.room_id}>
            {this.props.room.status == 1 && (
              <WTools ref={this.whiteboard_tools} />
            )}
            <Controller />
          </WhiteBoard>

          {show && (
            <div className={styles.modal_confirm}>
              <div className={styles.modal_content}>
                <div className={styles.save_name}>
                  <span className={styles.label_name}>文件名</span>
                  <Input
                    placeholder="请输入名称"
                    style={{ flex: 1 }}
                    value={this.state.saveParam.fileName}
                    onChange={val => {
                      this.setState({
                        saveParam: {
                          ...this.state.saveParam,
                          fileName: val.target.value.trim()
                        }
                      })
                    }}
                  />
                </div>
                <div className={styles.save_board}>
                  <span className={styles.label_name}>项目</span>
                  <Select
                    placeholder="请选择项目"
                    style={{ flex: 1 }}
                    onFocus={this.focusCascader}
                    onChange={this.boardChange}
                  >
                    {this.state.options.map(item => {
                      return (
                        <Select.Option value={item.value} key={item.value}>
                          {item.label}
                        </Select.Option>
                      )
                    })}
                  </Select>
                </div>
                <div className={styles.save_path}>
                  <span className={styles.label_name}>位置</span>
                  <Cascader
                    fieldNames={{
                      children: 'child_data',
                      label: 'folder_name',
                      value: 'folder_id'
                    }}
                    placeholder="请选择保存的位置"
                    style={{ flex: 1 }}
                    options={this.state.caser}
                    onChange={this.selectFolder}
                    changeOnSelect
                  />
                </div>
                <div className={styles.save_btn}>
                  <div>
                    <Button onClick={() => this.setState({ show: false })}>
                      取消
                    </Button>
                    <Button type="primary" onClick={this.saveFile}>
                      确定
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <RightContent
          {...this.props}
          onSelectImg={this.handleImgForBoard}
          onChangePage={this.changePage}
          onDelete={this.removePage}
          onChangeOpen={this.changeRightContent}
          org_id={this.props.org_id}
          room={this.props.room}
          acTivePageNumber={this.state.page_number}
          onClose={this.props.onClose}
          pages={this.state.pages}
          onAddPage={this.onPageAdd}
        />
        <div
          className={`${globalStyles.authTheme} ${
            styles.WhiteBoardRoom_close
          } ${this.state.rightContentVisible ? '' : styles.hideFiles}`}
          onClick={this.exitWhiteboard}
        >
          &#xe7ce;
        </div>
      </Fragment>
    )
  }
}
