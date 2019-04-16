import React, { Component } from 'react';
import indexStyles from './index.less'
import {checkIsHasPermissionInBoard} from "../../../../utils/businessFunction";

export default class GetRowGanttItem extends Component {

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
      <div className={indexStyles.ganttAreaOut}>

        <div className={indexStyles.ganttArea} >
          {this.getDate().map((value, key) => {
            const { dateInner = [] } = value
            return (
              <div className={indexStyles.ganttAreaItem} key={key}>
                <div className={indexStyles.ganttDetail} >
                  {dateInner.map((value2, key2) => {
                    return (
                      <div className={`${indexStyles.ganttDetailItem}`} key={key2}></div>
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
