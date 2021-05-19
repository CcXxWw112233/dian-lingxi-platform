import React, { Component } from 'react'
import { connect } from 'dva'
import { Checkbox } from 'antd'
import { ganttIsSingleBoardGroupView, GANTT_IDS } from '../../constants'
//分组模式下多选
@connect(mapStateToProps)
export default class BatchOperateCheckBoxItem extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  singleChange = ({ target }) => {
    const { batch_opetate_ids = [], dispatch } = this.props
    const { checked, value } = target
    let _batch_opetate_ids = [...batch_opetate_ids]
    if (!checked) {
      _batch_opetate_ids = batch_opetate_ids.filter(item => item != value)
    } else {
      _batch_opetate_ids.push(value)
    }
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        batch_opetate_ids: _batch_opetate_ids
      }
    })
  }
  render() {
    const {
      batch_operating,
      itemValue: { list_id },
      batch_opetate_ids,
      gantt_board_id,
      group_view_type
    } = this.props
    return (
      <>
        {batch_operating &&
          ganttIsSingleBoardGroupView({ gantt_board_id, group_view_type }) && (
            <div style={{ marginRight: 6 }}>
              <Checkbox
                value={list_id}
                onChange={this.singleChange}
                checked={batch_opetate_ids.includes(list_id)}
              />
            </div>
          )}
      </>
    )
  }
}
function mapStateToProps({
  gantt: {
    datas: {
      batch_opetate_ids,
      batch_operating,
      gantt_board_id,
      group_view_type
    }
  }
}) {
  return {
    batch_opetate_ids,
    batch_operating,
    gantt_board_id,
    group_view_type
  }
}
