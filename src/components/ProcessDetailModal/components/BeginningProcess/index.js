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
        {this.filterForm(itemValue, itemKey)}
      </div>
    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [] } }) {
  return { processEditDatas }
}
