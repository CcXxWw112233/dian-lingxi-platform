import React from 'react'
import indexstyles from '../index.less'
import { Icon } from 'antd'
import Cookies from 'js-cookie'

export default class ArticleItem extends React.Component {
  render() {
    const { itemValue = {} } = this.props
    const { title} = itemValue //status 1running 2stop 3 complete
    return (
      <div className={indexstyles.processItem}>
        <div>{title}</div>
      </div>
    )
  }
}
