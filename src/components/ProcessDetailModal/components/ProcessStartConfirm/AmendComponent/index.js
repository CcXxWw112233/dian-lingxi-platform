import React, { Component } from 'react'
import { Popover } from 'antd'
import indexStyles from '../index.less'
import FillInPersonContent from './FillInPersonContent'
import ExamineAndApproveContent from './ExamineAndApproveContent'
import DuplicateAndReportPerson from './DuplicateAndReportPerson'
import CompleteDeadlineContent from './CompleteDeadlineContent'

export default class index extends Component {

  // 根据不同的类型 渲染不同的内容 填写人 | 审批人 | 抄送人/抄报人
  renderDiffTypeContent = (type) => {
    let container = (<div></div>)
    switch (type) {
      case '1': // 资料收集中的填写人
        container = <FillInPersonContent {...this.props}/>
        break;
      case '2': // 审批类型中的审批人
        container = <ExamineAndApproveContent {...this.props} />
      case '3': // 抄送中的抄送人 | 抄报人
        container = <DuplicateAndReportPerson {...this.props}/>
        break
      default: // 其他的显示完成期限
        container = <CompleteDeadlineContent {...this.props}/>
        break;
    }
    return container
  }

  render() {
    const { placementTitle, itemValue, type } = this.props
    const { node_type } = itemValue
    return (
      <span>
        <Popover
          trigger="click"
          title={<div className={indexStyles.mini_title}>{placementTitle}</div>}
          content={this.renderDiffTypeContent(type)}
          getPopupContainer={triggerNode => triggerNode.parentNode}
          placement={'bottomLeft'}
          className={`${indexStyles.mini_popover_card}`}
        >
          <span className={indexStyles.confirm_edit}>修改</span>
        </Popover>
      </span>
    )
  }
}
