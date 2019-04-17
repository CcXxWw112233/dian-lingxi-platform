import React, { Component } from 'react';
import indexStyles from './index.less'
import { dateDataArray, monthDataArray } from './calDate'

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

    return (
      <div className={indexStyles.dateArea} >
        {this.getDate().map((value, key) => {
          const { dateTop, dateInner = [] } = value
          return (
            <div className={indexStyles.dateAreaItem} key={key}>
              <div className={indexStyles.dateTitle}>{dateTop}</div>
              <div className={indexStyles.dateDetail} >
                {dateInner.map((value2, key2) => {
                  const { name, is_daily } = value2
                  return (
                    <div className={`${indexStyles.dateDetailItem}`} key={key2}>{name}</div>
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
