import React, { Component } from 'react'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Collapse } from 'antd';
import indexStyles from '../index.less'
import FlowsInstanceItem from './FlowsInstanceItem'

const Panel = Collapse.Panel;

export default class PagingnationContent extends Component {
  render() {
    const { clientHeight } = this.props
    const maxContentHeight = clientHeight - 108 - 150
    return (
      <div className={indexStyles.pagingnationContent} style={{ maxHeight: maxContentHeight }}>
        <FlowsInstanceItem />
        <FlowsInstanceItem />
        <FlowsInstanceItem />
        <FlowsInstanceItem />
      </div>
    )
  }
}
