import React, { Component } from 'react'
import indexStyles from '../index.less'
import FlowsInstanceItem from './FlowsInstanceItem'
export default class PagingnationContent extends Component {

  render() {
    const { clientHeight } = this.props
    const maxContentHeight = clientHeight - 108 - 150
    return (
        <div className={indexStyles.pagingnationContent} style={{ maxHeight: maxContentHeight }}>
          <FlowsInstanceItem handleProcessInfo={this.props.handleProcessInfo}/>
          <FlowsInstanceItem />
          <FlowsInstanceItem />
          <FlowsInstanceItem />
        </div>
    )
  }
}
