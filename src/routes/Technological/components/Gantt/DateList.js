import React, { Component } from 'react';
import { connect, } from 'dva';
import indexStyles from './index.less'
import globalStyles from '../../../../globalset/css/globalClassName.less'
import { Tooltip } from 'antd'
import DateListLCBItem from './DateListLCBItem'

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

  checkLCB = ({has_lcb}) => {

  }

  render () {
    const { datas: { gold_date_arr = [], list_group =[], target_scrollTop }} = this.props.model

    return (
      <div className={indexStyles.dateArea}
           style={{top: target_scrollTop}}
      >
        {gold_date_arr.map((value, key) => {
          const { date_top, date_inner = [] } = value
          return (
            <div className={indexStyles.dateAreaItem} key={key}>
              <div className={indexStyles.dateTitle}>{date_top}</div>
              <div className={indexStyles.dateDetail} >
                {date_inner.map((value2, key2) => {
                  const { month, date_no } = value2
                  const has_lcb = key2%2==0
                  return (
                    <div key={`${month}/${date_no}`}>
                      <div className={`${indexStyles.dateDetailItem}`} key={key2}>{month}/{date_no}</div>
                      {/*<DateListLCBItem has_lcb={has_lcb}/>*/}
                    </div>
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
