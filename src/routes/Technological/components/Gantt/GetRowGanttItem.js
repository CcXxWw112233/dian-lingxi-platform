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
      rows: 7
    }
  }

  render () {

    const { rows } = this.state
    const arr = new Array(rows)
    const { datas: { gold_date_arr = [], list_group =[] }} = this.props.model

    return (
      <div className={indexStyles.ganttAreaOut}>

        <div className={indexStyles.ganttArea} >
          {gold_date_arr.map((value, key) => {
            const { date_inner = [] } = value
            return (
              <div className={indexStyles.ganttAreaItem} key={key}>
                <div className={indexStyles.ganttDetail} >
                  {date_inner.map((value2, key2) => {
                    const { week_day, timestamp } = value2
                    return (
                      <div className={`${indexStyles.ganttDetailItem}`}
                           key={key2}
                           style={{backgroundColor: (week_day == 0 || week_day == 6) ? 'rgb(250, 250, 250)' : (isToday(timestamp)? 'rgb(242, 251, 255)': '')}}
                      >
                        {[1, 2, 3, 4, 5, 6, 7].map((value, key) => {
                          return (
                            <div className={indexStyles.ganttDetailItem_item} key={key}></div>
                          )
                        })}
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
