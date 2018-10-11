import React from 'react'
import indexstyles from '../index.less'
import { Icon } from 'antd'

export default class ProcessItem extends React.Component {
  render() {
    const { itemValue = {} } = this.props
    const { is_realize } = itemValue
    return (
      <div className={indexstyles.processItem}>
        <div>奥斯陆电话卡警方很快就爱好疯狂计划奥斯陆电话卡奥斯陆电话卡警方很快就爱好疯狂计划奥斯陆电话卡奥斯陆电话卡警方很快就爱好疯狂计划奥斯陆电话卡<span style={{marginLeft: 6,color: '#8c8c8c', cursor: 'pointer'}}>#项目A</span></div>
        <div>
          <div style={{}}></div>
        </div>
      </div>
    )
  }
}
