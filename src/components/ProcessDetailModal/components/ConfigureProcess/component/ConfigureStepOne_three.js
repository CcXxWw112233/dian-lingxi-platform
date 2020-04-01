import React, { Component } from 'react'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Popover, Input, Button, Radio } from 'antd'
import { connect } from 'dva'
import { compareACoupleOfObjects } from '../../../../../utils/util'
import ConfigureNapeGuide from '../../../ConfigureNapeGuide'

let temp_item = {
  "field_type": "3",//类型 1=文本 2=选择 3=日期 4=表格 5=附件
  "title": "日期选择",//标题
  "prompt_content": "请选择日期",//提示内容
  "is_required": "0",//是否必填 1=必须 0=不是必须
  "date_range": "1",//日期范围 1=单个日期 2=开始日期~截止日期
  "date_precision": "2",//日期精度 1=仅日期 2=日期+时间
  "is_click_currentTextForm": true
}
@connect(mapStateToProps)
export default class ConfigureStepOne_three extends Component {

  constructor(props) {
    super(props)
    this.state = {
      popoverVisible: null,
      form_item: compareACoupleOfObjects(temp_item, props.itemValue) ? temp_item : props.itemValue
    }
  }

  onVisibleChange = (visible) => {
    const { is_click_confirm_btn, form_item } = this.state
    const { itemKey, parentKey, processEditDatas = [], itemValue } = this.props
    let temp_item = { ...form_item }
    if (!is_click_confirm_btn) {// 判断是否点击了确定按钮,否 那么就保存回原来的状态
      if (visible == false)
        this.setState({
          form_item: temp_item
        })
      const { forms = [] } = processEditDatas[parentKey]
      forms[itemKey] = { ...temp_item }
      this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: forms }, 'forms')
    }
    this.setState({
      popoverVisible: visible
    })
  }

  updateEdit = (data, key) => {
    const { itemKey, parentKey, processEditDatas = [] } = this.props
    const { forms = [] } = processEditDatas[parentKey]
    forms[itemKey][key] = data.value
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: forms }, 'forms')
  }
  propertyNameChange = (e) => {
    this.updateEdit({ value: e.target.value }, 'title')
  }
  defaultValueChange = (e) => {
    this.updateEdit({ value: e.target.value }, 'prompt_content')
  }
  dateRangeValueChange = (e) => {
    this.updateEdit({ value: e.target.value }, 'date_range')
  }
  datePrecisionValueChange = (e) => {
    this.updateEdit({ value: e.target.value }, 'date_precision')
  }
  isRequiredCheck = (e) => {
    this.updateEdit({ value: e.target.value }, 'is_required')
  }

  // 删除对应字段的表项
  handleDelFormDataItem = (e) => {
    e && e.stopPropagation()
    const { processEditDatas = [], parentKey = 0, itemKey } = this.props
    const { forms = [] } = processEditDatas[parentKey]
    let new_form_data = [...forms]
    new_form_data.splice(itemKey, 1)
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: new_form_data }, 'forms')
  }

  // 每一个表项的点击事件
  handleChangeTextFormColor = (e) => {
    e && e.stopPropagation()
    const { itemValue, parentKey, processEditDatas = [] } = this.props
    const { forms = [] } = processEditDatas[parentKey]
    const { is_click_currentTextForm } = itemValue
    let newFormsData = [...forms]
    newFormsData = newFormsData.map(item => {
      if (item.is_click_currentTextForm) {
        let new_item
        new_item = { ...item, is_click_currentTextForm: false }
        return new_item
      } else {
        return item
      }
    })
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: newFormsData }, 'forms')
    this.updateEdit({ value: !is_click_currentTextForm }, 'is_click_currentTextForm')
  }

    // 每个配置表项的确定的点击事件
    handleConfirmFormItem = () => {
      const { popoverVisible } = this.state
      const { itemValue } = this.props
      this.setState({
        is_click_confirm_btn: true
      })
      if (popoverVisible) {
        this.setState({
          form_item: JSON.parse(JSON.stringify(itemValue))
        },() => {
          this.onVisibleChange(false)
        })
      }
    }

  renderContent = () => {
    const { itemValue } = this.props
    const { title, prompt_content, date_precision, date_range, is_required } = itemValue
    const { form_item } = this.state
    let disabledFlag = compareACoupleOfObjects(form_item, itemValue)
    return (
      <div className={indexStyles.popover_content}>
        <div className={`${indexStyles.pop_elem} ${globalStyles.global_vertical_scrollbar}`}>
          <div>
            <p>标题:</p>
            <Input value={title} maxLength={50} onChange={this.propertyNameChange} />
          </div>
          <div>
            <p>提示内容:</p>
            <Input value={prompt_content} maxLength={50} onChange={this.defaultValueChange} />
          </div>
          <div className={indexStyles.layout_style}>
            <span style={{ marginRight: '5px' }}>日期范围&nbsp;:</span>
            <Radio.Group value={date_range} onChange={this.dateRangeValueChange}>
              <Radio value="1">单个日期</Radio>
              <Radio value="2">开始日期 ~ 截止日期</Radio>
            </Radio.Group>
          </div>
          <div className={indexStyles.layout_style}>
            <span style={{ marginRight: '5px' }}>日期精度&nbsp;:</span>
            <Radio.Group value={date_precision} onChange={this.datePrecisionValueChange}>
              <Radio value="1">仅日期</Radio>
              <Radio value="2">日期 + 时间</Radio>
            </Radio.Group>
          </div>
          <div className={indexStyles.layout_style}>
            <p style={{ marginRight: '16px' }}>是否为必填项&nbsp;:</p>
            <Radio.Group onChange={this.isRequiredCheck} value={is_required}>
              <Radio value="1">是</Radio>
              <Radio value="0">否</Radio>
            </Radio.Group>
          </div>
        </div>
        <div className={indexStyles.pop_btn}>
          <Button onClick={this.handleConfirmFormItem} disabled={(title && title != '' && title.trimLR() != '') && !disabledFlag ? false : true} style={{ width: '100%' }} type="primary">确定</Button>
        </div>
      </div>
    )
  }

  render() {
    const { itemKey, itemValue } = this.props
    const { title, prompt_content, is_required, is_click_currentTextForm } = itemValue
    return (
      <div>
        <div className={indexStyles.text_form} style={{ background: is_click_currentTextForm ? 'rgba(230,247,255,1)' : 'rgba(0,0,0,0.02)' }} onClick={this.handleChangeTextFormColor}>
          <p>{title}:&nbsp;&nbsp;{is_required == '1' && <span style={{ color: '#F5222D' }}>*</span>}</p>
          <div className={indexStyles.text_fillOut}>
            <span className={globalStyles.authTheme}>&#xe7d3;&nbsp;&nbsp;</span>
            <span style={{ color: 'rgba(0,0,0,0.25)' }}>{prompt_content}</span>
          </div>
          {
            is_click_currentTextForm && (
              <>
                <span onClick={this.handleDelFormDataItem} className={`${indexStyles.delet_iconCircle}`}>
                  <span className={`${globalStyles.authTheme} ${indexStyles.deletet_icon}`}>&#xe68d;</span>
                </span>
                <div onClick={(e) => e && e.stopPropagation()} className={indexStyles.popoverContainer} style={{ position: 'absolute', right: 0, top: 0 }}>
                  <Popover
                    title={<div className={indexStyles.popover_title}>配置表项</div>}
                    trigger="click"
                    visible={this.state.popoverVisible}
                    content={this.renderContent()}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    placement={'bottomRight'}
                    zIndex={1010}
                    className={indexStyles.popoverWrapper}
                    autoAdjustOverflow={false}
                    onVisibleChange={this.onVisibleChange}
                  >
                    <div onClick={this.handelPopoverVisible} className={`${globalStyles.authTheme} ${indexStyles.setting_icon}`}>
                      <span>&#xe78e;</span>
                    </div>
                  </Popover>

                </div>
              </>
            )
          }
          {/* {itemKey == '0' && <ConfigureNapeGuide visible={false} />} */}
        </div>
      </div>
    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [] } }) {
  return { processEditDatas }
}
