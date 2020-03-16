import React, { Component } from 'react'
import { Select, InputNumber } from 'antd'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import NameChangeInput from '@/components/NameChangeInput'

const Option = Select.Option;

export default class MoreOptionsComponent extends Component {

  state = {
    // moreOptionsList: []
  }

  // 更多选项的点击事件
  handleSelectedMoreOptions(code, e) {
    e && e.stopPropagation()
    const { itemValue } = this.props
    const { options_data = [] } = itemValue
    let moreOptionsList = [...options_data] || []
    let obj = {}
    obj = {
      code: code,
    }
    moreOptionsList.push(obj)
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: moreOptionsList }, 'options_data')
  }

  // 更多选项的删除事件
  handleDelMoreIcon(code,e) {
    e && e.stopPropagation()
    const { itemValue } = this.props
    const { options_data = [] } = itemValue
    let moreOptionsList = [...options_data] || []
    moreOptionsList = moreOptionsList.filter(item => {
      if (item.code != code) {
        return item
      }
    })
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: moreOptionsList }, 'options_data')
  }

  // 完成期限
  deadlineValueChange = (value) => {
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: value }, 'deadline_value')
  }
  deadlineTimeTypeValueChange = (value) => {
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: value }, 'deadline_time_type')
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: 1 }, 'deadline_value')
  }

  // 添加节点备注事件
  handleRemarksWrapper = (e) => {
    e && e.stopPropagation()
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: false }, 'is_click_node_description')
  }

  handleRemarksContent = (e) => {
    e && e.stopPropagation()
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: true }, 'is_click_node_description')
  }

  titleTextAreaChangeBlur = (e) => {
    let val = e.target.value.trimLR()
    if (val == "" || val == " " || !val) {
      this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: '' }, 'description')
      this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: false }, 'is_click_node_description')
      return
    }
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: val }, 'description')
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: false }, 'is_click_node_description')
  }

  titleTextAreaChangeClick = (e) => {
    e && e.stopPropagation()
  }

  // 渲染完成期限
  renderCompletionDeadline = () => {
    const { itemValue } = this.props
    const { deadline_time_type, deadline_value, description, } = itemValue
    return (
      <div className={`${indexStyles.complet_deadline}`}>
        <span style={{ fontWeight: 900, marginRight: '2px' }} className={globalStyles.authTheme}>&#xe686;</span>
        <span>完成期限 &nbsp;: </span>
        <InputNumber precision="0.1" min={1} max={deadline_time_type == 'hour' ? 24 : deadline_time_type == 'day' ? 30 : 12} value={deadline_value} onChange={this.deadlineValueChange} onClick={(e) => e.stopPropagation()} className={indexStyles.select_number} />
        <Select className={indexStyles.select_day} value={deadline_time_type} onChange={this.deadlineTimeTypeValueChange}>
          <Option value="hour">时</Option>
          <Option value="day">天</Option>
          <Option value="month">月</Option>
        </Select>
        <span onClick={this.handleDelMoreIcon.bind(this, 'COMPLETION_DEADLINE')} className={`${globalStyles.authTheme} ${indexStyles.del_moreIcon}`}>&#xe7fe;</span>
      </div>
    )
  }

  // 渲染备注
  renderRemarks = () => {
    const { itemValue } = this.props
    const { description, is_click_node_description } = itemValue
    return (
      <div onClick={this.handleRemarksWrapper} className={`${indexStyles.select_remarks}`}>
        <span className={globalStyles.authTheme}>&#xe636; 备注 &nbsp;:</span>
        <span onClick={this.handleDelMoreIcon.bind(this, 'REMARKS')} className={`${globalStyles.authTheme} ${indexStyles.del_moreIcon}`}>&#xe7fe;</span>
        {
          !is_click_node_description ? (
            <div onClick={(e) => { this.handleRemarksContent(e) }} className={indexStyles.remarks_content}>{description != '' ? description : '添加备注'}</div>
          ) : (
              <NameChangeInput
                autosize
                onBlur={this.titleTextAreaChangeBlur}
                onPressEnter={this.titleTextAreaChangeBlur}
                onClick={this.titleTextAreaChangeClick}
                autoFocus={true}
                goldName={''}
                nodeName={'input'}
                style={{ display: 'block', fontSize: 12, color: '#262626', resize: 'none', height: '38px', background: 'rgba(255,255,255,1)', boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.15)', borderRadius: '4px', border: 'none', marginTop: '4px' }}
              />
            )
        }

      </div>
    )
  }

  render() {
    const { itemValue } = this.props
    const { options_data = [], node_type, cc_type } = itemValue
    let deadlineCode = (options_data && options_data.length && (options_data.filter(item => item.code == 'COMPLETION_DEADLINE') || {})[0] || []).code || ''
    let remarksCode = (options_data && options_data.length && (options_data.filter(item => item.code == 'REMARKS') || {})[0] || []).code || ''
    return (
      <div>
        {/* 更多选项 */}
        {
          options_data.length == '2' || (node_type == '3' && cc_type == '1') && options_data.length == '1' ? (
            <></>
          ) : (
            <div className={indexStyles.more_select}>
            <span className={indexStyles.more_label}>... 更多选项 &nbsp;:</span>
            {
              !deadlineCode && (node_type == '3' ? cc_type == '1' ? false : true : true) && (
                <sapn onClick={this.handleSelectedMoreOptions.bind(this, 'COMPLETION_DEADLINE')} className={`${indexStyles.select_item}`}>+ 完成期限</sapn>
              )
            }
            {
              !remarksCode && (
                <sapn onClick={this.handleSelectedMoreOptions.bind(this, 'REMARKS')} className={`${indexStyles.select_item}`}>+ 备注</sapn>
              )
            }
          </div>
          )
        }
        {/* 完成期限 */}
        {
          deadlineCode && deadlineCode == 'COMPLETION_DEADLINE' && (
            this.renderCompletionDeadline()
          )
        }
        {/* 备注 */}
        {
          remarksCode && remarksCode == 'REMARKS' && (
            this.renderRemarks()
          )
        }
        {/* 关联内容 */}
        {/* <div className={indexStyles.select_related}>
          <span className={globalStyles.authTheme}>&#xe7f5; 关联内容 &nbsp; :</span>
          <span className={`${globalStyles.authTheme} ${indexStyles.del_moreIcon}`}>&#xe7fe;</span>
          <div className={indexStyles.related_content}>添加关联</div>
        </div> */}
      </div>
    )
  }
}

// 更多选项组件
MoreOptionsComponent.defaultProps = {

}
