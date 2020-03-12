import React, { Component } from 'react'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { connect } from 'dva'

@connect(mapStateToProps)
export default class EditProcess extends Component {
  render() {
    const { itemKey, itemValue, processEditDatasRecords = [], processCurrentEditStep, processEditDatas = [] } = this.props
    const { name, node_type, description, is_click_node_name } = itemValue
    return (
      <div key={itemKey} style={{ display: 'flex', marginBottom: '45px' }}>
        {/* {node_amount <= itemKey + 1 ? null : <div className={stylLine}></div>} */}
        <div className={indexStyles.line}></div>
        <div className={indexStyles.circle}> {itemKey + 1}</div>
        <div className={`${indexStyles.popover_card}`}>
          <div className={`${globalStyles.global_vertical_scrollbar}`}>
            {/* 步骤名称 */}
            <div style={{ marginBottom: '16px' }}>
              <div className={`${indexStyles.node_name} ${indexStyles.pub_hover}`}>
                <span className={`${globalStyles.authTheme} ${indexStyles.stepTypeIcon}`}>&#xe7b1;</span>
                <span>前期资料整理</span>
              </div>
            </div>
            <div style={{ paddingLeft: '14px', paddingRight: '14px', position: 'relative' }}>
              {/* 步骤类型 */}
              内容
            </div>
            {/* <span className={indexStyles.dynamicTime}></span> */}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [] } }) {
  return { processEditDatas }
}