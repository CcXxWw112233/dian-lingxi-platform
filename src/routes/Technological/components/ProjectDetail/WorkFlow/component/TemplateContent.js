import React, { Component } from 'react'
import indexStyles from '../index.less'
import TemplateItem from './TemplateItem'
import globalStyles from '@/globalset/css/globalClassName.less'
export default class TemplateContent extends Component {// 模板组件

  // 新增模板点击事件
  handleAddTemplate = () => {
    this.props.handleAddTemplate && this.props.handleAddTemplate()
  }

  // 编辑模板的点击事件
  handleEditTemplete = () => {
    this.props.handleEditTemplete && this.props.handleEditTemplete()
  }

  // 启动流程的点击事件
  handleStartProcess = () => {
    this.props.handleStartProcess && this.props.handleStartProcess()
  }

  render() {
    const { process_detail_modal_visible } = this.props
    return (
        <div className={`${indexStyles.templateContent}`}>
          <div className={indexStyles.addTemplate}>
            <span className={indexStyles.add_icon} onClick={this.handleAddTemplate}>
              <span style={{fontSize: '30px'}} className={globalStyles.authTheme}>&#xe8fe;</span>
              <span className={indexStyles.add_name}>新建模板</span>
            </span>
          </div>
          <div className={`${indexStyles.templateItemContent} ${globalStyles.global_vertical_scrollbar}`}>
            <TemplateItem handleEditTemplete={this.handleEditTemplete} handleStartProcess={this.handleStartProcess} />
            <TemplateItem handleEditTemplete={this.handleEditTemplete} handleStartProcess={this.handleStartProcess} />
            <TemplateItem handleEditTemplete={this.handleEditTemplete} handleStartProcess={this.handleStartProcess} />
            <TemplateItem handleEditTemplete={this.handleEditTemplete} handleStartProcess={this.handleStartProcess} />
            <TemplateItem handleEditTemplete={this.handleEditTemplete} handleStartProcess={this.handleStartProcess} />
            <TemplateItem handleEditTemplete={this.handleEditTemplete} handleStartProcess={this.handleStartProcess} />
            <TemplateItem handleEditTemplete={this.handleEditTemplete} handleStartProcess={this.handleStartProcess} />
            <TemplateItem handleEditTemplete={this.handleEditTemplete} handleStartProcess={this.handleStartProcess} />
            <TemplateItem handleEditTemplete={this.handleEditTemplete} handleStartProcess={this.handleStartProcess} />
          </div>
        </div>
    )
  }
}

// 模板组件
TemplateContent.defaultProps = {

}
