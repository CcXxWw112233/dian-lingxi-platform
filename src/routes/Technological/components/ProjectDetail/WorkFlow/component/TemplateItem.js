import React, { Component } from 'react'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'

export default class TemplateItem extends Component {

  handleStartProcess = () => {
    this.props.handleStartProcess && this.props.handleStartProcess()
  }

  handleEditTemplete = () => {
    this.props.handleEditTemplete && this.props.handleEditTemplete()
  }

  render() {
    return (
      <div className={indexStyles.tempItemWrapper}>
        <span className={indexStyles.tem_item}>
          {/* 三种状态 */}
          <span className={indexStyles.hover_icon_display}>
            <span onClick={this.handleStartProcess} className={`${indexStyles.common_authority_hover}`}><span className={`${indexStyles.hover_icon} ${indexStyles.start_process_icon} ${globalStyles.authTheme}`}>&#xe6b8; 启动流程</span></span>
            <span onClick={this.handleEditTemplete} className={`${indexStyles.common_authority_hover}`}><span className={`${indexStyles.hover_icon} ${indexStyles.edit_temp_icon} ${globalStyles.authTheme}`}>&#xe602; 编辑模板</span></span>
            <span className={`${indexStyles.common_authority_hover}`}><span className={`${indexStyles.hover_icon} ${indexStyles.delete_temp_icon} ${globalStyles.authTheme}`}>&#xe7c3; 删除模板</span></span>
          </span>
        </span>
        <span className={indexStyles.temp_item_name}>财务报销模板很长很长很长很长很长很长很长很长很长</span>
      </div>
    )
  }
}

// 每一个模板选项结构
TemplateItem.defaultProps = {

}
