import React, { Component } from 'react';
import { connect, } from 'dva';
import indexStyles from './index.less'
import { Tooltip } from 'antd'

@connect(mapStateToProps)
export default class GroupListHeadItem extends Component {
  constructor(props) {
    super(props)

  }
  noTimeAreaScroll(e) {
    e.stopPropagation()
  }
  render () {
    const { datas: { list_group =[], group_rows = [], ceiHeight, target_scrollLeft }} = this.props.model
    const { itemValue = { }, itemKey } = this.props
    const { list_name, list_id, list_data = [], list_no_time_data = [] } = itemValue
    return (
      <div className={indexStyles.listHeadItem} style={{height: (group_rows[itemKey] || 2) * ceiHeight}}>
        <div >{list_name}</div>
        <div
          className={indexStyles.no_time_card_area_out}
          style={{height: (group_rows[itemKey] || 2) * ceiHeight - 50}}
          onScroll={this.noTimeAreaScroll.bind(this)}>
          <div className={indexStyles.no_time_card_area}>
            {
              list_no_time_data.map((value, key) => {
                const { name, id, is_realize } = value || {}
                return (
                  <Tooltip title={name} key={`${id}_${name}`}>
                    <div
                      className={indexStyles.no_time_card_area_card_item}
                      key={id}
                      style={{
                        backgroundColor: is_realize == '0'? '#1890FF': '#9AD0FE'
                      }} />
                  </Tooltip>
                )
              })
            }
          </div>
        </div>

      </div>
    )
  }

}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ modal, gantt, loading }) {
  return { modal, model: gantt, loading }
}
