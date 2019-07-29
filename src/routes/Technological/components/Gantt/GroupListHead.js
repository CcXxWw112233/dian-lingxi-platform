import React, { Component } from 'react';
import { connect, } from 'dva';
import indexStyles from './index.less'
import GroupListHeadItem from './GroupListHeadItem'

@connect(mapStateToProps)
export default class GroupListHead extends Component {
  constructor(props) {
    super(props)

  }

  render () {
    const { datas: { list_group =[], group_rows = [], ceiHeight,target_scrollLeft }} = this.props.model
    return (
      <div className={indexStyles.listHead} style={{left: target_scrollLeft}}>
        <div style={{height: 72, backgroundColor: 'red'}}></div>
        {list_group.map((value, key) =>{
          const { list_name, list_id, list_data = [] } = value
          return (
            <div key={list_id}>
              <GroupListHeadItem itemValue={value} itemKey={key} />
              {/*<div className={indexStyles.listHeadItem} key={list_id} style={{height: (group_rows[key] || 2) * ceiHeight}}>{list_name}</div>*/}
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
