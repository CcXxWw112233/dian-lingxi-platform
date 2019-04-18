import React, { Component } from 'react';
import { connect, } from 'dva';
import indexStyles from './index.less'
import { dateDataArray, monthDataArray } from './calDate'

const getEffectOrReducerByName = name => `gantt/${name}`
@connect(mapStateToProps)
export default class DateList extends Component {

  constructor(props) {
    super(props)

  }

  getDate = () => {
    const DateArray = []
    for(let i = 1; i < 13; i++) {
      const obj = {
        dateTop: `${i}月`,
        dateInner: []
      }
      for(let j = 1; j < 32; j++) {
        const obj2 = {
          name: `${i}/${j}`,
          is_daily: j % 6 || j % 7 == 0 ? '1' : '0'
        }
        obj.dateInner.push(obj2)
      }
      DateArray.push(obj)
    }
    return DateArray
  }

  render () {
    const { datas: { gold_date_arr = [], list_group =[] }} = this.props.model

    return (
      <div className={indexStyles.dateArea} >
        {gold_date_arr.map((value, key) => {
          const { date_top, date_inner = [] } = value
          return (
            <div className={indexStyles.dateAreaItem} key={key}>
              <div className={indexStyles.dateTitle}>{date_top}</div>
              <div className={indexStyles.dateDetail} >
                {date_inner.map((value2, key2) => {
                  const { month, date_no } = value2
                  return (
                    <div className={`${indexStyles.dateDetailItem}`} key={key2}>{month}/{date_no}</div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ modal, gantt, loading }) {
  return { modal, model: gantt, loading }
}
