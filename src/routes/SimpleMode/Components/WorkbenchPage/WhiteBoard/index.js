import React from 'react'
import styles from './index.less'
// import RoomList from './RoomList'
// import WhiteBoard from './WhiteBoard'
import Action from './Action'
import { connect } from 'dva'
import { Button, Cascader, Input, Select, Spin } from 'antd'
const RoomList = React.lazy(() => import('./RoomList'))
const WhiteBoard = React.lazy(() => import('./WhiteBoard'))
const RightContent = React.lazy(() => import('./components/boardContent'))

@connect(
  ({
    technological: {
      datas: {
        currentUserOrganizes = [],
        OrganizationId,
        visibleWhiteboardSpin
      }
    }
  }) => ({
    currentUserOrganizes,
    OrganizationId,
    visibleWhiteboardSpin
  })
)
export default class WhiteBoardRooms extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: 'list', // 当前模式属于列表还是房间
      room_id: '',
      rooms: [],
      rightContentVisible: true,
      show: true,
      options: [],
      caser: [], // 级联选择器
      saveParam: {
        fileName: '',
        board_id: '',
        folder_id: ''
      }
    }
    this.file = ''
  }

  componentDidMount() {
    this.fetchList()
  }
  handleRoom = val => {
    // console.log(val)
    Action.room_id = val.id
    this.setState({
      room_id: val.id,
      mode: 'whiteBoard',
      room: val
    })
  }
  closeWhiteBoard = () => {
    this.setState({
      mode: 'list',
      room_id: '',
      room: {}
    })
    Action.room_id = ''
  }

  fetchList = () => {
    // this.setTime()
    // 获取房间列表
    Action.fetchList({ _organization_id: this.props.OrganizationId }).then(
      res => {
        if (res)
          this.setState({
            rooms: res.data
          })
      }
    )
  }
  /**
   * 房间更新方法
   * @param {*} room 房间信息
   */
  updateRoom = room => {
    Action.saveWhiteBoardPic(room).then(res => {
      this.fetchList()
    })
  }

  /**
   * 保存文件到项目
   */
  SaveFileToBoard = file => {
    this.file = file
    this.setState({
      show: true,
      saveParam: { ...this.state.saveParam, fileName: file.name }
    })
  }

  render() {
    const { mode } = this.state
    const { visibleWhiteboardSpin, dispatch } = this.props
    return (
      <div className={styles.whiteboard_rooms}>
        {mode === 'list' && (
          <RoomList
            onEnter={this.handleRoom}
            orgs={this.props.currentUserOrganizes}
            org_id={this.props.OrganizationId}
            list={this.state.rooms}
            onUpdate={this.fetchList}
          />
        )}
        {mode === 'whiteBoard' && (
          <div className={styles.board_white_content}>
            <Spin
              className={styles.loading_spin}
              style={{ zIndex: visibleWhiteboardSpin ? 10 : -1 }}
              spinning={visibleWhiteboardSpin}
            />
            <WhiteBoard
              dispatch={dispatch}
              onSave={this.SaveFileToBoard}
              orgs={this.props.currentUserOrganizes}
              org_id={this.props.OrganizationId}
              room_id={this.state.room_id}
              room={this.state.room}
              onUpdatePic={this.updateRoom}
              onClose={this.closeWhiteBoard}
            />
          </div>
        )}
      </div>
    )
  }
}
