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
      const { historyList = [], rela_id, is_add_remind } = this.props;
      const num = historyList && historyList.length;
      {
        return (
          <div className={infoRemindStyle.content}>
              { historyList.map((value, index) => {
                const { id } = value
                return <RenderHistory is_add_remind={is_add_remind} rela_id={rela_id} num={num} index={index} itemValue={value} key={id} />
                }) 
              }
          </div>
        ) 
      }
        
    }
}
