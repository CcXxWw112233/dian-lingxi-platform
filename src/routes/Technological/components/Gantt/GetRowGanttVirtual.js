import React, { Component } from 'react'
import GetRowGanttItem from './GetRowGanttItem'
import { connect } from 'dva'

@connect(mapStateToProps)
export default class GetRowGanttVirtual extends Component {
  render() {
    const {
      list_group,
      group_rows,
      group_list_area,
      ceiHeight,
      ceilWidth,
      date_total
    } = this.props
    const color = ['yellow', 'blue', 'red']
    return (
      <div>
        {list_group.map((value, key) => {
          const { lane_data, list_id, list_data = [] } = value
          const { milestones = {} } = lane_data
          return (
            <div
              style={{
                height: group_rows[key] * ceiHeight,
                width: date_total * ceilWidth,
                backgroundColor: 'rgb(245,245,245)', //color[key % 3]
                borderBottom: '1px solid #e5e5e5'
              }}
            ></div>
            // <GetRowGanttItem
            //   {...this.props}
            //   key={list_id}
            //   itemKey={key}
            //   list_id={list_id}
            //   list_data={list_data}
            //   rows={group_rows[key]}
            //   milestones={milestones}
            // />
          )
        })}
      </div>
    )
  }
}
function mapStateToProps({
  gantt: {
    datas: {
      list_group = [],
      group_rows = [],
      group_list_area = [],
      date_total,
      ceiHeight,
      ceilWidth
    }
  }
}) {
  return {
    list_group,
    group_rows,
    group_list_area,
    date_total,
    ceiHeight,
    ceilWidth
  }
}
