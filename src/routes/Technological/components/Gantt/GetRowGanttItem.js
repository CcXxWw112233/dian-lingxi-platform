import React, { Component } from 'react';
import { connect, } from 'dva';
import indexStyles from './index.less'
import { isToday } from './getDate'
import globalStyles from '@/globalset/css/globalClassName.less'

const getEffectOrReducerByName = name => `gantt/${name}`
@connect(mapStateToProps)
export default class GetRowGanttItem extends Component {

  constructor(props) {
    super(props)
    this.state = {
      needs_task_arr: [], //实现以起始时间相同的为同一分组
    }
  }

  initSet(props) {
    const { list_id, list_data } = this.props
    // console.log(list_id, list_data)
    let start_time_arr = []
    let needs_task_arr = []
    const sortCreateTime = (a, b) => {
      return a.create_time - b.create_time
    }
    for (let val of list_data) {
      start_time_arr.push(val['start_time'])
    }
    start_time_arr = new Set(start_time_arr)
    for (let val of start_time_arr) {
      let arr = []
      for (let val2 of list_data) {
        if (val == val2['start_time']) {
          arr.push(val2)
        }
      }
      arr.sort(sortCreateTime)
      needs_task_arr = [].concat(needs_task_arr, arr)
    }
  }

  seeMiletones = () => {

  }

  isHasMiletoneList = (timestamp) => {
    const { milestoneMap = [] } = this.props
    let flag = false
    let current_date_miletones = []
    if (!timestamp) {
      return {
        flag,
        current_date_miletones
      }
    }
    for (let key in milestoneMap) {
      if (isSamDay(Number(timestamp), Number(key) * 1000)) {
        flag = true
        current_date_miletones = milestoneMap[key]
        break
      }
    }

    return {
      flag,
      current_date_miletones,
    }
  }

  render() {
    const { rows = 7 } = this.props
    const { gold_date_arr = [], ceiHeight, gantt_board_id } = this.props
    const { milestones = {} } = this.props
    const item_height = rows * ceiHeight
    return (
      <div className={indexStyles.ganttAreaOut}>

        <div className={indexStyles.ganttArea} >
          {gold_date_arr.map((value, key) => {
            const { date_inner = [] } = value
            return (
              <div className={indexStyles.ganttAreaItem} key={key}>
                <div className={indexStyles.ganttDetail} style={{ height: item_height }}>
                  {date_inner.map((value2, key2) => {
                    const { week_day, timestamp, } = value2
                    const has_lcb = this.isHasMiletoneList(Number(timestamp)).flag
                    const current_date_miletones = this.isHasMiletoneList(Number(timestamp)).current_date_miletones
                    return (
                      <div className={`${indexStyles.ganttDetailItem}`}
                        key={key2}
                        style={{ backgroundColor: (week_day == 0 || week_day == 6) ? 'rgba(0, 0, 0, 0.04)' : (isToday(timestamp) ? 'rgb(242, 251, 255)' : 'rgba(0,0,0,.02)') }}
                      >
                        {/* 12为上下margin的总和 */}
                        {
                          gantt_board_id == '0' && has_lcb && (
                            <div className={`${indexStyles.board_miletiones_flag} ${globalStyles.authTheme}`}
                              data-targetclassname="specific_example"
                              onClick={this.seeMiletones}
                              onMouseDown={e => e.stopPropagation()}
                            >&#xe6a0;</div>
                          )
                        }
                        {
                          gantt_board_id == '0' && has_lcb &&(
                            <div
                              data-targetclassname="specific_example"
                              className={`${indexStyles.board_miletiones_flagpole}`} style={{ height: item_height - 12 }}
                              onClick={this.seeMiletones}
                              onMouseDown={e => e.stopPropagation()}
                              onMouseOver={e => e.stopPropagation()}
                            />
                          )
                        }
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
function mapStateToProps({ gantt: { datas: { gold_date_arr = [], ceiHeight, gantt_board_id } } }) {
  return { gold_date_arr, ceiHeight, gantt_board_id }
}
