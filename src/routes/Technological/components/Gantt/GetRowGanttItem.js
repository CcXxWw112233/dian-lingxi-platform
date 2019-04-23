import React, { Component } from 'react';
import { connect, } from 'dva';
import indexStyles from './index.less'
import { isToday } from './getDate'

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
    for(let val of list_data) {
      start_time_arr.push(val['start_time'])
    }
    start_time_arr = new Set(start_time_arr)
    for(let val of start_time_arr) {
      let arr = []
      for(let val2 of list_data) {
        if(val == val2['start_time']) {
          arr.push(val2)
        }
      }
      arr.sort(sortCreateTime)
      needs_task_arr = [].concat(needs_task_arr, arr)
    }
    console.log({needs_task_arr})
  }

  render () {
    const { rows = 7 } = this.props
    const { datas: { gold_date_arr = [], list_group =[], ceiHeight}} = this.props.model

    return (
      <div className={indexStyles.ganttAreaOut}>

        <div className={indexStyles.ganttArea} >
          {gold_date_arr.map((value, key) => {
            const { date_inner = [] } = value
            return (
              <div className={indexStyles.ganttAreaItem} key={key}>
                <div className={indexStyles.ganttDetail} style={{height: rows * ceiHeight}}>
                  {date_inner.map((value2, key2) => {
                    const { week_day, timestamp } = value2
                    return (
                      <div className={`${indexStyles.ganttDetailItem}`}
                           key={key2}
                           style={{backgroundColor: (week_day == 0 || week_day == 6) ? 'rgb(250, 250, 250)' : (isToday(timestamp)? 'rgb(242, 251, 255)': '')}}
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
function mapStateToProps({ modal, gantt, loading }) {
  return { modal, model: gantt, loading }
}
