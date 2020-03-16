import React, { Component } from 'react'
import indexStyles from '../index.less'
import TemplateItem from './TemplateItem'
import globalStyles from '@/globalset/css/globalClassName.less'
import { connect } from 'dva'
import ProcessDetailModal from '../../../../../../components/ProcessDetailModal'
@connect(mapStateToProps)
export default class TemplateContent extends Component {// 模板组件

  // 新增模板点击事件
  handleAddTemplate = () => {
    this.props.dispatch({
      type: 'publicProcessDetailModal/updateDatas',
      payload: {
        processPageFlagStep: '3',
        process_detail_modal_visible: true
      }
    })
  }

  render() {
    const { process_detail_modal_visible } = this.props
    return (
      <>
      <div className={`${indexStyles.templateContent}`}>
        <div className={indexStyles.addTemplate}>
          <span className={indexStyles.add_icon} onClick={this.handleAddTemplate}>+</span>
          <span className={indexStyles.add_name}>新建模板</span>
        </div>
        <div className={`${indexStyles.templateItemContent} ${globalStyles.global_vertical_scrollbar}`}>
          <TemplateItem />
          <TemplateItem />
          <TemplateItem />
          <TemplateItem />
          <TemplateItem />
          <TemplateItem />
          <TemplateItem />
        </div>
      </div>
      {
        process_detail_modal_visible && (
          <ProcessDetailModal process_detail_modal_visible={process_detail_modal_visible}/>
        )
      }
      </>
    )
  }
}

// 模板组件
TemplateContent.defaultProps = {

}
function mapStateToProps({
  publicProcessDetailModal: {
    process_detail_modal_visible
  }
}) {
  return {
    process_detail_modal_visible
  }
}
