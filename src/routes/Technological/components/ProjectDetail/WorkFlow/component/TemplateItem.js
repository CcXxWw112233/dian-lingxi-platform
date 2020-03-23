import React, { Component } from 'react'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'

export default class TemplateItem extends Component {

  // 启动流程的点击事件
  handleStartProcess = (item) => {
    this.props.handleStartProcess && this.props.handleStartProcess(item)
  }

  // 编辑流程的点击事件
  handleEditTemplete = (item) => {
    this.props.handleEditTemplete && this.props.handleEditTemplete(item)
  }
  
  // 删除流程的点击事件
  handleDelteTemplete = (item) => {
    this.props.handleDelteTemplete && this.props.handleDelteTemplete(item)
  }

  render() {
    const { itemValue } = this.props
    const { id, name } = itemValue
    return (
      <div className={indexStyles.tempItemWrapper}>
        <span className={indexStyles.tem_item}>
          <span>
            <span className={`${globalStyles.authTheme} ${indexStyles.tem_icon}`}>&#xe68c;</span>
            <span className={indexStyles.temp_item_name}>{name}</span>
          </span>
          {/* 三种状态 */}
          <span className={indexStyles.hover_icon_display}>
            <span onClick={() => { this.handleStartProcess(itemValue) }} className={`${indexStyles.common_authority_hover}`}><span className={`${indexStyles.hover_icon} ${indexStyles.start_process_icon} ${globalStyles.authTheme}`}>&#xe796; 启动流程</span></span>
            <span onClick={() => { this.handleEditTemplete(itemValue) }} className={`${indexStyles.common_authority_hover}`}><span className={`${indexStyles.hover_icon} ${indexStyles.edit_temp_icon} ${globalStyles.authTheme}`}>&#xe602; 编辑模板</span></span>
            <span onClick={() => { this.handleDelteTemplete(itemValue) }} className={`${indexStyles.common_authority_hover}`}><span className={`${indexStyles.hover_icon} ${indexStyles.delete_temp_icon} ${globalStyles.authTheme}`}>&#xe7c3; 删除模板</span></span>
          </span>
        </span>
      </div>
    )
  }
}

// 每一个模板选项结构
TemplateItem.defaultProps = {

}
