import React, { Component } from 'react';
import { connect, } from 'dva';
import indexStyles from './index.less'
import GetRowGantt from './GetRowGantt'
import DateList from './DateList'
import { getMonthDate } from './getDate'

const getEffectOrReducerByName = name => `gantt/${name}`
@connect(mapStateToProps)
export default class GroupListHead extends Component {
  constructor(props) {
    super(props)

  }

  render () {
    const { datas: { list_group =[], group_rows = [], ceiHeight,target_scrollLeft }} = this.props.model
    return (
      <div className={indexStyles.listHead} style={{left: target_scrollLeft}}>
        {list_group.map((value, key) =>{
          const { list_name, list_id, list_data = [] } = value
          return (
            <div className={indexStyles.listHeadItem} key={list_id} style={{height: (group_rows[key] || 2) * ceiHeight}}>{list_name}</div>
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
