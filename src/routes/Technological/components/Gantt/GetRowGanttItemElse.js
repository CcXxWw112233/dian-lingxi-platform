import React, { Component } from 'react';
import { connect, } from 'dva';
import indexStyles from './index.less'
import { isToday } from './getDate'
import { ganttIsOutlineView } from './constants';
// 这是一个甘特图面板尾部的日期列表
const getEffectOrReducerByName = name => `gantt/${name}`
@connect(mapStateToProps)
export default class GetRowGanttItem extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  getElseHeight = () => {
    let rows = 7
    const { gantt_card_height, dataAreaRealHeight, ceiHeight, group_view_type, outline_tree_round = [] } = this.props
    const difference_height = gantt_card_height - dataAreaRealHeight
    const mult = Math.ceil(difference_height / ceiHeight)
    if (dataAreaRealHeight < 0) {
      rows = 7
    } else {
      if (mult < 7) {
        rows = 7
      } else {
        rows = mult
      }
    }
    if (ganttIsOutlineView({ group_view_type })) {
      const outline_tree_round_length = outline_tree_round.length
      if (outline_tree_round_length > rows) {
        return (outline_tree_round_length + 8) * ceiHeight
      } else {
        return (rows + 5) * ceiHeight
      }
    }
    return (rows + 5) * ceiHeight
  }

  filterHeight = () => {
    const { list_group, group_view_type, gantt_board_id, } = this.props
    if (
      ganttIsOutlineView({ group_view_type }) ||
      (group_view_type == '1' && gantt_board_id == '0') ||
      group_view_type == '2' ||
      (group_view_type == '1' && gantt_board_id != '0' && !list_group.length)
    ) {
      return this.getElseHeight()
    } else {
      return 30
    }

  }
  setBorderTop = () => {
    const { group_view_type, gantt_board_id, } = this.props
    if (
      group_view_type == '1' && gantt_board_id != '0'
    ) {
      return {
        borderTop: 'none'
      }
    } else {
      return {

      }
    }
  }

  render() {
    const { gold_date_arr = [], } = this.props
    return (
      <div className={indexStyles.ganttAreaOut}>
        <div className={indexStyles.ganttArea} >
          {gold_date_arr.map((value, key) => {
            const { date_inner = [] } = value
            return (
              <div className={indexStyles.ganttAreaItem} key={key}>
                <div className={indexStyles.ganttDetail}
                  style={{ height: this.filterHeight(), }}>
                  {date_inner.map((value2, key2) => {
                    const { week_day, timestamp } = value2
                    return (
                      <div className={`${indexStyles.ganttDetailItem}`}
                        key={key2}
                        style={{
                          backgroundColor: isToday(timestamp) ? 'rgb(242, 251, 255)' : ((week_day == 0 || week_day == 6) ? 'rgba(0, 0, 0, 0.04)' : 'rgba(0,0,0,.02)'),
                          ...this.setBorderTop()
                        }}
                      >
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ gantt: { datas: { gold_date_arr = [], gantt_board_id, group_view_type, outline_tree_round, ceiHeight, group_rows = [], list_group = [] } } }) {
  return { gold_date_arr, ceiHeight, group_rows, list_group, group_view_type, outline_tree_round, gantt_board_id }
}
