import React, { Fragment } from 'react'
import styles from './index.less'
import globalStyles from '../../../../../../../globalset/css/globalClassName.less'
import { Avatar, Select, Tabs, Icon, message } from 'antd'
import { getProjectList } from '../../../../../../../services/technological/projectCommunication'
import { getBoardFileList } from '../../../../../../../services/technological/file'
import Action from '../../Action'
import { WEvent } from 'whiteboard-lingxi/lib/utils'
import WhiteBoardPage from '../whiteboardPage'
import { dateFormat } from '../../../../../../../utils/util'

const DefineIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_779568_5f33nbn5h3l.js'
})

export default class BoardContent extends React.Component {
  state = {
    open: true,
    user: window.localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : {},
    projects: [],
    selectBoard: '',
    file_data: [], // 文件列表
    folder_data: [], // 文件夹列表
    activeId: '', // 选中的图片id
    file_path: [] // 文件路径
  }

  saveEvent = null
  componentDidMount() {
    this.getProject()
    this.saveEvent = WEvent.on('saveSuccess', () => {
      if (this.state.selectBoard) {
        if (!this.state.file_path.length) {
          this.ChangeProject(this.state.selectBoard)
        } else {
          let folder = this.state.file_path[this.state.file_path.length - 1]
          this.ChangeProject(this.state.selectBoard, folder.folder_id)
        }
      }
    })
  }
  componentWillUnmount() {
    WEvent.unByKey(this.saveEvent)
  }
  /**
   * 切换打开状态
   */
  toogleOpen = () => {
    const { open } = this.state
    const { onChangeOpen } = this.props
    this.setState(
      {
        open: !open
      },
      () => {
        onChangeOpen && onChangeOpen(this.state.open)
        setTimeout(() => {
          Action.resize && Action.resize()
        }, 200)
      }
    )
  }
  // 点击退出白板
  exitWhiteboard = () => {
    const { onClose } = this.props
    onClose && onClose()
  }

  /**
   * 获取项目列表
   */
  getProject = () => {
    const { org_id } = this.props
    getProjectList({ _organization_id: org_id }).then(res => {
      // console.log(res)
      if (res.code === '0') {
        this.setState({
          projects: res.data || []
        })
      }
    })
  }

  /**
   * 切换项目
   * @param val 项目id
   */
  ChangeProject = (val, fold_id = '') => {
    // console.log(val)
    getBoardFileList({
      board_id: val,
      folder_id: fold_id
    }).then(res => {
      // console.log(res)
      if (res.code === '0') {
        this.setState({
          file_data: res.data.file_data || [],
          folder_data: res.data.folder_data || [],
          selectBoard: val
        })
        if (!fold_id) {
          this.setState({
            file_path: []
          })
        }
      }
    })
  }
  checkType = name => {
    if (!name) return 'unkown'
    let imgkey = ['png', 'jpeg', 'jpg', 'gif']
    let s = name.split('.')
    let suffix = s[s.length - 1]
    if (imgkey.includes(suffix)) {
      return 'img'
    } else if (suffix === 'pdf') {
      return 'pdf'
    } else return 'word'
  }

  setActiveImgToDraw = val => {
    const { room = {}, onSelectImg } = this.props
    // console.log(val)
    this.setState({
      activeId: val.file_id
    })
    if (room.status !== '1') {
      return message.warn('房间已过期，不能进行操作')
    }
    onSelectImg && onSelectImg(val)
    Action.addImageFromBoard(val.thumbnail_url)
  }

  setActiveFolder = val => {
    const { selectBoard, file_path } = this.state
    let index = file_path.findIndex(item => item.folder_id === val.folder_id)
    if (index !== -1) {
      let arr = file_path
      arr.length = index + 1
      this.setState({
        file_path: arr
      })
      this.ChangeProject(selectBoard, val.folder_id)
    }
  }

  // 渲染文件夹路径
  renderFilePath = () => {
    const { file_path } = this.state
    let obj = this.state.projects.find(
      item => item.board_id === this.state.selectBoard
    )
    if (obj) {
      return (
        <div>
          路径:
          <span
            className={styles.file_path_item}
            onClick={() => this.ChangeProject(obj.board_id)}
          >
            {obj.board_name}
          </span>
          {file_path.map((item, index) => {
            return (
              <span
                onClick={() => this.setActiveFolder(item)}
                className={`${styles.file_path_item} ${
                  index === file_path.length - 1 ? styles.active : ''
                }`}
                key={item.folder_id}
              >
                / {item.folder_name}
              </span>
            )
          })}
        </div>
      )
    }
    return null
  }

  // 更新文件路径
  setFolder = val => {
    let { selectBoard, file_path } = this.state
    file_path.push(val)
    this.setState({
      file_path
    })
    this.ChangeProject(selectBoard, val.folder_id)
  }

  render() {
    const {
      user,
      open,
      projects,
      file_data,
      folder_data,
      activeId
    } = this.state
    const { room = {} } = this.props
    return (
      <div
        className={`${styles.container} ${!open ? styles.hideContainer : ''}`}
      >
        <div className={styles.handleCloseBtn}>
          <span
            className={`${globalStyles.authTheme} ${styles.closeBtn}`}
            onClick={this.toogleOpen}
          >
            {open ? <span>&#xe7d6;</span> : <span>&#xe7d7;</span>}
          </span>
        </div>
        <div className={styles.container_header_content}>
          <div className={styles.headers}>
            <div>
              <Avatar src={user.avatar} size={30} style={{ marginRight: 10 }} />
              {user.name}
            </div>
            <div
              className={`${globalStyles.authTheme} ${styles.WhiteBoardRoom_close}`}
              onClick={this.exitWhiteboard}
            >
              &#xe7ce;
            </div>
          </div>
          <div className={styles.board_message}>
            <div className={styles.whiteboards_name}>{room.name}</div>
            <div>
              过期日期:{' '}
              {dateFormat(+(room.expire_time + '000'), 'yyyy年MM月dd日 HH:mm')}
            </div>
          </div>
        </div>
        <div className={styles.container_board_content}>
          <Tabs className={styles.tabbar}>
            <Tabs.TabPane
              tab={
                <div>
                  <DefineIcon type="icon-bianzu46" />
                  <span style={{ fontSize: '12px' }}>文件</span>
                </div>
              }
              key="1"
            >
              <div className={styles.tabbarContainer}>
                <div style={{ textAlign: 'center' }}>
                  <Select
                    onClick={this.getProject}
                    onChange={val => this.ChangeProject(val)}
                    suffixIcon={
                      <span
                        className={globalStyles.authTheme}
                        style={{ transform: 'rotate(90deg)' }}
                      >
                        &#xe61f;
                      </span>
                    }
                    placeholder="选择项目"
                    style={{ width: '98%' }}
                  >
                    <Select.Option value="">请选择</Select.Option>
                    {projects.map(item => {
                      return (
                        <Select.Option
                          key={item.board_id}
                          value={item.board_id}
                        >
                          {item.board_name}
                        </Select.Option>
                      )
                    })}
                  </Select>
                </div>
                <div className={styles.board_panel}>
                  <div className={styles.folder_path}>
                    {this.renderFilePath()}
                  </div>
                  <div className={styles.folders_content}>
                    {folder_data.map(item => {
                      return (
                        <div
                          key={item.folder_id}
                          className={styles.folder_item}
                          onClick={() => this.setFolder(item)}
                        >
                          {item.folder_name}
                        </div>
                      )
                    })}
                  </div>
                  <div className={styles.files_content}>
                    {file_data.map(item => {
                      if (this.checkType(item.file_name) === 'img')
                        return (
                          <div className={styles.file_item} key={item.file_id}>
                            <div
                              className={`${styles.file_center_detail} ${
                                activeId === item.file_id ? styles.active : ''
                              }`}
                              onClick={this.setActiveImgToDraw.bind(this, item)}
                            >
                              <div className={`${styles.file_theme}`}>
                                <img
                                  src={item.thumbnail_url}
                                  alt=""
                                  crossOrigin="anonymous"
                                />
                              </div>
                              <div className={styles.file_detail_name}>
                                {item.file_name}
                              </div>
                            </div>
                          </div>
                        )
                      return null
                    })}
                  </div>
                </div>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <Fragment>
                  <DefineIcon type="icon-bianzu47" />
                  <span style={{ fontSize: '12px' }}>图层</span>
                </Fragment>
              }
              key="2"
            >
              <WhiteBoardPage
                {...this.props}
                pageNumber={this.props.acTivePageNumber}
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}
