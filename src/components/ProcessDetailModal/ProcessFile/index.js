import React, { Component } from 'react'
import indexStyles from './index.less'
import { isPaymentOrgUser } from '../../../utils/businessFunction'
import { connect } from 'dva'
import { message } from 'antd'
import ShowFileSlider from '../../../routes/Technological/components/Gantt/components/boardFile/ShowFileSlider'
import BoardsFilesArea from '../../../routes/Technological/components/Gantt/components/boardFile/BoardsFilesArea'
import { getGanttBoardsFiles } from '../../../services/technological/gantt'
import { isApiResponseOk } from '../../../utils/handleResponseData'
import { MESSAGE_DURATION_TIME } from '../../../globalset/js/constant'

@connect(mapStateToProps)
export default class index extends Component {

  componentDidMount() {
    getGanttBoardsFiles({
      board_id: "",
      query_board_ids: [],
      _organization_id: localStorage.getItem('OrganizationId') || '0'
    }).then(res => {
      if (isApiResponseOk(res)) {
        this.props.dispatch({
          type: 'gantt/updateDatas',
          payload: {
            boards_flies: res.data
          }
        })
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
        if (res.code == 4041) {
          message.warn(res.message, MESSAGE_DURATION_TIME)
        }
      }
    })
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'gantt/updateDatas',
      payload: {
        boards_flies: [],
        is_show_board_file_area: '0'
      }
    })
  }

  render() {
    const { is_show_board_file_area } = this.props
    return (
      <div>
        <div id="process_file_detail_container" className={indexStyles.process_file_detail_container}>
          {
            isPaymentOrgUser() && is_show_board_file_area != '1' && (<div style={{position: 'relative', left: '22px'}}><ShowFileSlider /></div>)
          }
          <BoardsFilesArea />
        </div>
      </div>
    )
  }
}

function mapStateToProps({
  gantt: { datas: { is_show_board_file_area } }
}) {
  return { is_show_board_file_area }
}
