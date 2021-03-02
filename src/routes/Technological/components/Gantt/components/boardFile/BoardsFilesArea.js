import React, { Component } from 'react'
import styles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { connect } from 'dva'
import BoardsFilesItem from './BoardsFilesItem'
import { isPaymentOrgUser } from '../../../../../../utils/businessFunction'
import HideFileSlider from './HideFileSlider'

@connect(mapStateToProps)
export default class BoardsFilesArea extends Component {
  constructor(props) {
    super(props)
    this.scrollTop = 0
    this.outRef = React.createRef()
  }
  state = {
    previewFileModalVisibile: false
  }
  // 更新父组件中私有变量开启文件弹窗
  updatePrivateVariablesWithOpenFile = () => {
    this.setState({
      previewFileModalVisibile: true
    })
  }
  //弹窗
  setPreviewFileModalVisibile = () => {
    this.setState({
      previewFileModalVisibile: !this.state.previewFileModalVisibile
    })
    this.props.dispatch({
      type: 'publicFileDetailModal/updateDatas',
      payload: {
        isInOpenFile: false,
        filePreviewCurrentFileId: '',
        fileType: '',
        filePreviewCurrentName: ''
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    // 从单项目切换到多项目
    if (
      nextProps.folder_seeing_board_id == '0' &&
      this.props.folder_seeing_board_id != nextProps.folder_seeing_board_id
    ) {
      this.recoverRefSrcollTop()
    }
  }

  setBoardFileMessagesRead = () => {
    const { dispatch } = this.props
    const { im_all_latest_unread_messages = [] } = this.props
    const arr = im_all_latest_unread_messages.filter(item => {
      if (
        item.action == 'board.file.upload' ||
        item.action == 'board.file.version.upload'
      ) {
        return item
      }
    })
    const reads = arr.map(item => item.idServer)
    console.log('ssss_全部设置已读', reads)
    dispatch({
      type: 'imCooperation/listenImLatestAreadyReadMessages',
      payload: {
        messages: reads
      }
    })
  }

  // 仅出现当前查看的文件夹所属项目
  filterSeeingBoard = board_id => {
    const { folder_seeing_board_id = '0' } = this.props
    if (folder_seeing_board_id == '0') {
      return true
    } else {
      if (folder_seeing_board_id == board_id) {
        return true
      } else {
        return false
      }
    }
  }
  // 监听事件
  listenScroll = e => {
    const scrollTop = e.currentTarget.scrollTop
    //多项目文件查看
    if (this.props.folder_seeing_board_id == '0') {
      setTimeout(() => {
        this.setScrollTop(scrollTop)
      }, 500)
    }
  }
  setScrollTop = scrollTop => {
    this.scrollTop = scrollTop
    console.log('sssssssaaa', scrollTop)
  }

  // 单项目切换回到多项目要恢复之前查看的位置
  recoverRefSrcollTop = () => {
    setTimeout(() => {
      this.outRef.current.scrollTop = this.scrollTop
    }, 400)
  }

  render() {
    const { is_show_board_file_area, boards_flies = [] } = this.props

    return (
      <div
        ref={this.outRef}
        className={` ${globalStyles.global_vertical_scrollbar} ${
          styles.boards_files_area
        }
            ${is_show_board_file_area == '1' && styles.boards_files_area_show}
            ${is_show_board_file_area == '2' && styles.boards_files_area_hide}
            `}
        onScroll={this.listenScroll}
      >
        <HideFileSlider />
        <div
          onClick={this.setBoardFileMessagesRead}
          className={styles.all_set_read}
        >
          全部标为已读
        </div>
        <div>
          {boards_flies.map((item, key) => {
            const { id, board_name, org_id, folder_id } = item
            return (
              <div key={`${id}_${board_name}_${folder_id}`}>
                {isPaymentOrgUser(org_id) && this.filterSeeingBoard(id) && (
                  <BoardsFilesItem
                    itemValue={item}
                    item={key}
                    board_id={id}
                    board_name={board_name}
                    previewFileModalVisibile={
                      this.state.previewFileModalVisibile
                    }
                    updatePrivateVariablesWithOpenFile={
                      this.updatePrivateVariablesWithOpenFile
                    }
                    setPreviewFileModalVisibile={
                      this.setPreviewFileModalVisibile
                    }
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
function mapStateToProps({
  gantt: {
    datas: {
      is_show_board_file_area,
      boards_flies = [],
      folder_seeing_board_id
    }
  },
  imCooperation: { im_all_latest_unread_messages = [] }
}) {
  return {
    is_show_board_file_area,
    boards_flies,
    folder_seeing_board_id,
    im_all_latest_unread_messages
  }
}
