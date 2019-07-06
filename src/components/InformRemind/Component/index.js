// 渲染内容的组件
import React, { Component } from 'react'
import { connect } from 'dva'
import RenderHistory from './RenderHistory'
import infoRemindStyle from '../index.less'


@connect(({informRemind: { historyList, is_history }}) => ({
  historyList, is_history
}))
export default class RenderContent extends Component {

    render() {
      const { historyList = [], is_history } = this.props;
      {
        return is_history && (
          <div className={infoRemindStyle.content}>
              { historyList.map(value => {
                const { id } = value
                return <RenderHistory itemValue={value} key={id} />
                }) 
              }
          </div>
        )
      }
        
    }
}
