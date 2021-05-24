import React, { Component } from 'react'
import {
  ganttIsSingleBoardGroupView,
  task_item_height,
  task_item_margin_top
} from '../../constants'
import styles from './index.less'
import { connect } from 'dva'

@connect(mapStateToProps)
export default class AlreadyBatchSetFlagGroupItem extends Component {
  render() {
    const {
      gantt_head_width,
      group_view_type,
      gantt_board_id,
      list_id,
      already_batch_operate_ids
    } = this.props
    return (
      <>
        {ganttIsSingleBoardGroupView({ group_view_type, gantt_board_id }) &&
          already_batch_operate_ids.includes(list_id) && (
            <div
              style={{
                height: task_item_height,
                marginBottom: task_item_margin_top,
                position: 'absolute',
                top: 0,
                left: gantt_head_width - 52
              }}
            >
              <div className={styles.batch_flag}>
                <div className={styles.batch_flag_arrow}></div>
                <div className={styles.batch_flag_text}>已设置</div>
              </div>
            </div>
          )}
      </>
    )
  }
}
function mapStateToProps({
  gantt: {
    datas: {
      gantt_head_width,
      group_view_type,
      gantt_board_id,
      already_batch_operate_ids
    }
  }
}) {
  return {
    gantt_head_width,
    group_view_type,
    gantt_board_id,
    already_batch_operate_ids
  }
}
