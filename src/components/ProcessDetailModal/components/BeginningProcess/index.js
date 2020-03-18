import React, { Component } from 'react'
import { connect } from 'dva'

@connect(mapStateToProps)
export default class BeginningProcess extends Component {

  filterForm = (value, key) => {
    
  }

  render() {
    const { itemValue, itemKey } = this.props
    return (
      <div>
        {/* {this.filterForm(itemValue, itemKey)} */}
        进行中的流程
      </div>
    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [] } }) {
  return { processEditDatas }
}
