import React, { Component } from 'react';
import indexStyles from './index.less'
import GetRowGantt from './GetRowGantt'

export default class Gantt extends Component {

  constructor(props) {
    super(props)
    this.state = {
      viewModal: '2', //视图模式1周，2月，3年
    }
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

  getListRow = () => {
    const arr = []
    for(let i = 0; i < 3; i ++) {
      const obj = {
        name: `任务名称_${i}`
      }
      arr.push(obj)
    }
    return arr
  }

  render () {

    return (
      <div className={indexStyles.cardDetail} id={'gantt_card_out'}>
        <div className={indexStyles.cardDetail_left}></div>
        <div className={indexStyles.cardDetail_middle} id={'gantt_card_out_middle'}>
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

          <div className={indexStyles.panel}>
            <div className={indexStyles.listHead}>
              {this.getListRow().map((value, key) =>{
                const { name } = value
                return (
                  <div className={indexStyles.listHeadItem} key={key}>{name}</div>
                )
              })}
            </div>
            <GetRowGantt />
          </div>
        </div>
        <div className={indexStyles.cardDetail_right}></div>
      </div>
    )
  }

}
