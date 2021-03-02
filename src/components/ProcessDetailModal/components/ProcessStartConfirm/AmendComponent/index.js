import React, { Component } from 'react'
import { Popover } from 'antd'
import indexStyles from '../index.less'
import FillInPersonContent from './FillInPersonContent'
import ExamineAndApproveContent from './ExamineAndApproveContent'
import DuplicateAndReportPerson from './DuplicateAndReportPerson'
import CompleteDeadlineContent from './CompleteDeadlineContent'

export default class index extends Component {
  state = {
    popoverVisible: false
  }

  onVisibleChange = (visible, calback) => {
    this.setState({
      popoverVisible: visible
    })
    if (calback && typeof calback == 'function') calback()
  }

  // 根据不同的类型 渲染不同的内容 填写人 | 审批人 | 抄送人/抄报人
  renderDiffTypeContent = type => {
    let container = <div></div>
    switch (type) {
      case '1': // 资料收集中的填写人
        container = (
          <FillInPersonContent
            popoverVisible={this.state.popoverVisible}
            onVisibleChange={this.onVisibleChange}
            {...this.props}
          />
        )
        break
      case '2': // 审批类型中的审批人
        container = (
          <ExamineAndApproveContent
            popoverVisible={this.state.popoverVisible}
            onVisibleChange={this.onVisibleChange}
            {...this.props}
          />
        )
        break
      case '3': // 抄送中的抄送人 | 抄报人
        container = (
          <DuplicateAndReportPerson
            popoverVisible={this.state.popoverVisible}
            onVisibleChange={this.onVisibleChange}
            {...this.props}
          />
        )
        break
      default:
        // 其他的显示完成期限
        container = (
          <CompleteDeadlineContent
            popoverVisible={this.state.popoverVisible}
            onVisibleChange={this.onVisibleChange}
            {...this.props}
          />
        )
        break
    }
    return container
  }

  render() {
    const { placementTitle, itemValue, type } = this.props
    const { node_type } = itemValue
    return (
      <span>
        <Popover
          visible={this.state.popoverVisible}
          trigger="click"
          title={<div className={indexStyles.mini_title}>{placementTitle}</div>}
          content={this.renderDiffTypeContent(type)}
          getPopupContainer={triggerNode => triggerNode.parentNode}
          placement={'bottomLeft'}
          className={`${indexStyles.mini_popover_card}`}
          onVisibleChange={this.onVisibleChange}
        >
          <span className={indexStyles.confirm_edit}>修改</span>
        </Popover>
      </span>
    )
  }
}

index.defaultProps = {
  type: '', //表示节点类型 1：资料收集 2：审批节点 3：评分节点
  updateParentsAssigneesOrCopyPersonnel: function() {}, //更新父组件中state执行人或者抄送人状态
  updateCorrespondingPrcodessStepWithNodeContent: function() {}, //确定回调
  placementTitle: '', //修改框标题
  data: [], //列表成员
  itemKey: '', //渲染的组件key
  itemValue: {}, //每一条item对象
  board_id: '', //项目ID
  NotModifiedInitiator: false //表示不显示发起人等状态
}
