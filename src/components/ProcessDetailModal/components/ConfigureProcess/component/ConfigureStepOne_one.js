import React, { Component } from 'react'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Popover, Input, Button, Radio, Select, InputNumber, message } from 'antd'
import { connect } from 'dva'
import { compareACoupleOfObjects } from '../../../../../utils/util'
import ConfigureNapeGuide from '../../../ConfigureNapeGuide'
const Option = Select.Option;

let temp_item = {
  "field_type": "1",//类型 1=文本 2=选择 3=日期 4=表格 5=附件
  "title": "文本输入",//标题
  "prompt_content": "请填写内容",//提示内容
  "is_required": "0",//是否必填 1=必须 0=不是必须
  "verification_rule": "",//校验规则
  "val_min_length": "",//最小长度
  "val_max_length": "",//最大长度
  "is_click_currentTextForm": true
}
@connect(mapStateToProps)
export default class ConfigureStepOne_one extends Component {

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
  valMinLengthChange = (value) => {
    if (isNaN(value)) {
      // message.warn('请输入数字')
      return
    }
    this.updateEdit({ value: value }, 'val_min_length')
  }
  valMaxLengthChange = (value) => {
    if (isNaN(value)) {
      // message.warn('请输入数字')
      return
    }
    this.updateEdit({ value: value }, 'val_max_length')
  }
  isRequiredCheck = (e) => {
    this.updateEdit({ value: e.target.value }, 'is_required')
  }
  verificationRuleChange = (value) => {
    this.updateEdit({ value: value }, 'verification_rule')
  }

  // 删除对应字段的表项
  handleDelFormDataItem = (e) => {
    e && e.stopPropagation()
    const { processEditDatas = [], parentKey = 0, itemKey } = this.props
    const { forms = [] } = processEditDatas[parentKey]
    let new_processEditDatas = [...processEditDatas]
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
    const { title, prompt_content, verification_rule, is_required, val_min_length, val_max_length } = itemValue
    const { form_item } = this.state
    let disabledFlag = compareACoupleOfObjects(form_item, itemValue)
    return (
      <div key={itemValue} className={indexStyles.popover_content}>
        <div className={`${indexStyles.pop_elem} ${globalStyles.global_vertical_scrollbar}`}>
          <div>
            <p>标题:</p>
            <Input value={title} maxLength={50} onChange={this.propertyNameChange} />
          </div>
          <div>
            <p>提示内容:</p>
            <Input value={prompt_content} maxLength={50} onChange={this.defaultValueChange} />
          </div>
          <div>
            <p>校验规则:</p>
            <Select value={verification_rule} onChange={this.verificationRuleChange} className={`${indexStyles.verify_select}`} style={{ width: '100%', position: 'relative' }} getPopupContainer={triggerNode => triggerNode.parentNode}>
              <Option value="">不校验格式</Option>
              <Option value="mobile">手机号码</Option>
              <Option value="tel">座机</Option>
              <Option value="ID_card">身份证号码</Option>
              <Option value="chinese_name">中文名（2-6）个汉字</Option>
              <Option value="url">网址</Option>
              <Option value="qq">QQ号</Option>
              <Option value="postal_code">邮政编码</Option>
              <Option value="positive_integer">正整数</Option>
              <Option value="negative">负数</Option>
              <Option value="two_decimal_places">精确到两位小数</Option>
            </Select>
          </div>
          {
            verification_rule == '' && (
              <div>
                <p>限制字数:</p>
                <InputNumber min={1} precision="0.1" value={val_min_length} onChange={this.valMinLengthChange} style={{ width: 174, marginRight: '8px' }} /> ~ <InputNumber value={val_max_length} onChange={this.valMaxLengthChange} precision="0.1" min={1} style={{ width: 174, marginLeft: '8px' }} />
              </div>
            )
          }
          <div className={indexStyles.layout_style}>
            <p style={{ marginRight: '16px' }}>是否为必填项:</p>
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
    const { itemKey, itemValue, parentKey, processEditDatas = [] } = this.props
    const { forms = [] } = processEditDatas[parentKey]
    const { title, prompt_content, is_required, is_click_currentTextForm } = itemValue
    return (
      <div>
        <div className={indexStyles.text_form} style={{ background: is_click_currentTextForm ? 'rgba(230,247,255,1)' : 'rgba(0,0,0,0.02)' }} onClick={this.handleChangeTextFormColor}>
          <p>{title}:&nbsp;&nbsp;{is_required == '1' && <span style={{ color: '#F5222D' }}>*</span>}</p>
          <div className={indexStyles.text_fillOut}>
            <span>{prompt_content}</span>
          </div>
          {
            is_click_currentTextForm && (
              <>
                <span onClick={this.handleDelFormDataItem} className={`${indexStyles.delet_iconCircle}`}>
                  <span className={`${globalStyles.authTheme} ${indexStyles.deletet_icon}`}>&#xe68d;</span>
                </span>
                <div onClick={(e) => e.stopPropagation()} className={indexStyles.popoverContainer} style={{ position: 'absolute', right: 0, top: 0 }}>
                  <Popover
                    key={`${itemKey}-${itemValue}`}
                    title={<div className={indexStyles.popover_title}>配置表项</div>}
                    trigger="click"
                    visible={this.state.popoverVisible}
                    onClick={(e) => e.stopPropagation()}
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
          { itemKey == ((forms && forms.length) && forms.length - 1) && <ConfigureNapeGuide /> }
        </div>
      </div>

    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [] } }) {
  return { processEditDatas }
}
