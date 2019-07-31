import React, { Component } from 'react'
import indexStyles from './index.less'
import globalStyles from  '@/globalset/css/globalClassName.less'
import { connect } from 'dva'

@connect(mapStateToProps)
export default class GroupListHeadElse extends Component {
    getElseHeight = () => {
        let rows = 7
        const { gantt_card_height, dataAreaRealHeight, ceiHeight } = this.props
        const difference_height = gantt_card_height - dataAreaRealHeight
        const mult = Math.ceil(difference_height/ceiHeight)
        if(dataAreaRealHeight < 0) {
          rows = 7
        } else {
          if (mult < 7) {
            rows = 7
          }else {
            rows = mult
          }
        }
        return rows * ceiHeight
    }
    render() {
        return (
            <div style={{ height: this.getElseHeight()}} className={`${indexStyles.listHeadItem}`}>
              sssss
             </div>
        )
    }
}

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ gantt: { datas: { gold_date_arr = [], ceiHeight }} }) {
    return { gold_date_arr, ceiHeight }
  }