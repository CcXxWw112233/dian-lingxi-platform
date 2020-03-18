import React, { Component } from 'react'
import { connect } from 'dva'
import BeginningStepOne from './component/BeginningStepOne'
import BeginningStepTwo from './component/BeginningStepTwo'

@connect(mapStateToProps)
export default class BeginningProcess extends Component {

  filterForm = (value, key) => {
    const { node_type } = value
    let container = (<div></div>)
    switch (node_type) {
      case '1':
        container = <BeginningStepOne itemKey={key} itemValue={value} />
        break;
      case '2':
        container = <BeginningStepTwo itemKey={key} itemValue={value} />
        break;
      default:
        container = <div></div>
        break;
    }
    return container
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
