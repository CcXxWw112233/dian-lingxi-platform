// 渲染内容的组件
import React, { Component } from 'react'
import { connect } from 'dva'
import RenderHistory from './RenderHistory'
import RenderAdd from './RenderAdd'
import infoRemindStyle from '../index.less'


@connect(({informRemind: { historyList, is_history, is_add_remind }}) => ({
  historyList, is_history, is_add_remind
}))
export default class RenderContent extends Component {

    render() {
      const { historyList = [], is_history, rela_id, is_add_remind } = this.props;
      {
        return is_history && (
          <div className={infoRemindStyle.content}>
              { historyList.map(value => {
                const { id } = value
                return <RenderHistory rela_id={rela_id} itemValue={value} key={id} />
                }) 
              }
              {
                is_add_remind && <RenderAdd rela_id={rela_id} />
              }
          </div>
        ) 
      }
        
    }
}
