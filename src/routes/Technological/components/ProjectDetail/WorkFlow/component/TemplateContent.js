import React, { Component } from 'react'
import indexStyles from '../index.less'
import TemplateItem from './TemplateItem'
import globalStyles from '@/globalset/css/globalClassName.less'
import { connect } from 'dva'
@connect(mapStateToProps)
export default class TemplateContent extends Component {// 模板组件

  // 新增模板点击事件
  handleAddTemplate = () => {
    this.props.handleAddTemplate && this.props.handleAddTemplate()
  }

  // 编辑模板的点击事件
  handleEditTemplete = (item) => {
    this.props.handleEditTemplete && this.props.handleEditTemplete(item)
  }

  // 启动流程的点击事件
  handleStartProcess = (item) => {
    this.props.handleStartProcess && this.props.handleStartProcess(item)
  }

  // 删除流程的点击事件
  handleDelteTemplete = (item) => {
    this.props.handleDelteTemplete && this.props.handleDelteTemplete(item)
  }

  render() {
    const { processTemplateList = [] } = this.props
    return (
        <div className={`${indexStyles.templateContent}`}>
          <div className={indexStyles.addTemplate}>
            <span className={indexStyles.add_icon} onClick={this.handleAddTemplate}>
              <span style={{fontSize: '30px'}} className={globalStyles.authTheme}>&#xe8fe;</span>
              <span className={indexStyles.add_name}>新建模板</span>
            </span>
          </div>
          <div className={`${indexStyles.templateItemContent} ${globalStyles.global_vertical_scrollbar}`}>
            {
              processTemplateList && processTemplateList.map((item, key) => {
                return (
                  <TemplateItem
                    itemValue={item} 
                    itemKey={key}
                    handleEditTemplete={this.handleEditTemplete} 
                    handleStartProcess={this.handleStartProcess}
                    handleDelteTemplete={this.handleDelteTemplete}
                  />
                )
              })
            }
          </div>
        </div>
    )
  }
}

// 模板组件
TemplateContent.defaultProps = {

}

function mapStateToProps({
  publicProcessDetailModal: {
    processTemplateList = []
  }
}) {
  return {
    processTemplateList
  }
}