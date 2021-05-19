import React, { Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import {
  ganttIsOutlineView,
  ganttIsSingleBoardGroupView,
  milestone_base_height,
  task_item_height,
  task_item_margin_top
} from '../../constants'

@connect(mapStateToProps)
export default class AlreadyBatchSetFlag extends Component {
  renderOutLineFlag = () => {
    const {
      batch_operating,
      outline_tree_round = [],
      ceiHeight,
      gantt_head_width,
      already_batch_operate_ids = []
    } = this.props
    return (
      <div
        className={styles.batch_flag_wrapper}
        style={{
          height: outline_tree_round.length * ceiHeight,
          left: gantt_head_width - 52
        }}
      >
        <div style={{ marginTop: 8 }}>
          <div style={{ height: 22, width: 20 }}></div>
        </div>
        <div style={{ marginTop: 12 }}>
          {outline_tree_round.map(item => {
            const { id } = item
            return (
              <div
                key={id}
                style={{
                  height: task_item_height,
                  marginBottom: task_item_margin_top,
                  visibility: already_batch_operate_ids.includes(id)
                    ? 'visible'
                    : 'hidden'
                }}
              >
                <div className={styles.batch_flag}>
                  <div className={styles.batch_flag_arrow}></div>
                  <div className={styles.batch_flag_text}>已设置</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  renderGroupFlag = () => {
    const {
      group_list_area_section_height,
      list_group = [],
      gantt_head_width,
      already_batch_operate_ids = []
    } = this.props
    return (
      <div
        className={styles.batch_flag_wrapper}
        style={{
          height: group_list_area_section_height[list_group.length - 1],
          left: gantt_head_width - 52
        }}
      >
        <div style={{ marginTop: 12 }}>
          {list_group.map((item, index) => {
            const { list_id } = item
            return (
              <div
                key={list_id}
                style={{
                  height: task_item_height,
                  marginBottom: task_item_margin_top,
                  position: 'absolute',
                  top:
                    index == 0
                      ? milestone_base_height
                      : group_list_area_section_height[index - 1] +
                        milestone_base_height,
                  visibility: already_batch_operate_ids.includes(list_id)
                    ? 'visible'
                    : 'hidden'
                }}
              >
                <div className={styles.batch_flag}>
                  <div className={styles.batch_flag_arrow}></div>
                  <div className={styles.batch_flag_text}>已设置</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  render() {
    const {
      batch_operating,
      group_view_type = [],
      gantt_board_id,
      gantt_head_width,
      already_batch_operate_ids = []
    } = this.props
    return (
      <>
        {batch_operating && (
          <>
            {ganttIsOutlineView({ group_view_type }) &&
              this.renderOutLineFlag()}
            {ganttIsSingleBoardGroupView({ group_view_type, gantt_board_id }) &&
              this.renderGroupFlag()}
          </>
        )}
      </>
    )
  }
}

function mapStateToProps({
  gantt: {
    datas: {
      group_view_type,
      gantt_board_id,
      batch_operating,
      batch_opetate_ids,
      outline_tree,
      outline_tree_round = [],
      list_group = [],
      group_list_area_section_height = [],
      already_batch_operate_ids = [],
      ceiHeight,
      gantt_head_width
    }
  }
}) {
  return {
    group_view_type,
    gantt_board_id,
    batch_operating,
    batch_opetate_ids,
    outline_tree,
    list_group,
    outline_tree_round,
    group_list_area_section_height,
    already_batch_operate_ids,
    ceiHeight,
    gantt_head_width
  }
}
