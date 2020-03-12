import React, { Component } from 'react'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Popover, Input, Button, Radio, Select, InputNumber } from 'antd'
import { connect } from 'dva'
const Option = Select.Option;
@connect(mapStateToProps)
export default class ConfigureStepOne_one extends Component {

  constructor(props) {
    super(props)
  }

  state = {
    popoverVisible: false,
  }

  handelPopoverVisible = () => {
    this.setState({
      popoverVisible: !this.state.popoverVisible
    })
  }

  updateEdit(data, key) {
    const { itemKey, parentKey, processEditDatas = [] } = this.props
    const { form_data = [] } = processEditDatas[parentKey]
    form_data[itemKey][key] = data.value
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: form_data }, 'form_data')
  }
  propertyNameChange(e) {
    this.updateEdit({ value: e.target.value }, 'property_name')
  }
  defaultValueChange(e) {
    this.updateEdit({ value: e.target.value }, 'default_value')
  }
  valLengthChange(value) {
    this.updateEdit({ value: value.toString() }, 'val_length')
  }
  isRequiredCheck(e) {
    this.updateEdit({ value: e.target.value}, 'is_required')
  }
  verificationRuleChange(value) {
    this.updateEdit({ value: value }, 'verification_rule')
  }

  // 删除对应字段的表项
  handleDelFormDataItem = () => {
    const { processEditDatas = [], parentKey = 0, itemKey } = this.props
    const { form_data = [] } = processEditDatas[parentKey]
    let new_processEditDatas = [...processEditDatas]
    let new_form_data = [...form_data]
    new_form_data.splice(itemKey, 1)
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: new_form_data }, 'form_data')
  }

  renderContent = () => {
    const { itemKey, itemValue, processEditDatas = [], parentKey } = this.props
    const { property_name, default_value, verification_rule, val_length, is_required } = itemValue
    return (
      <div key={itemValue} className={indexStyles.popover_content}>
        <div className={`${indexStyles.pop_elem} ${globalStyles.global_vertical_scrollbar}`}>
          <div>
            <p>标题:</p>
            <Input value={property_name} onChange={this.propertyNameChange.bind(this)}/>
          </div>
          <div>
            <p>提示内容:</p>
            <Input value={default_value} onChange={this.defaultValueChange.bind(this)}/>
          </div>
          <div>
            <p>校验规则:</p>
            <Select value={verification_rule} onChange={this.verificationRuleChange.bind(this)} className={`${indexStyles.verify_select}`} style={{width: '100%', position: 'relative'}} getPopupContainer={triggerNode => triggerNode.parentNode}>
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
          <div>
            <p>限制字数:</p>
            <InputNumber min={1} style={{ width: 174, marginRight: '8px' }} /> ~ <InputNumber min={1} max={100} style={{ width: 174, marginLeft: '8px' }}/>
          </div>
          <div className={indexStyles.layout_style}>
            <p style={{marginRight: '16px'}}>是否为必填项:</p>
            <Radio.Group onChange={this.isRequiredCheck.bind(this)} value={is_required}>
              <Radio value="1">是</Radio>
              <Radio value="0">否</Radio>
            </Radio.Group>
          </div>
        </div>
        <div className={indexStyles.pop_btn}>
          <Button disabled={property_name && property_name != '' && property_name.trimLR() != '' ? false : true} style={{width: '100%'}} type="primary">确定</Button>
        </div>
      </div>
    )
  }

  render() {
    const { itemKey, itemValue } = this.props
    const { property_name, default_value, verification_rule, val_length, is_required } = itemValue
    return (
      <div>
        <div className={indexStyles.text_form}>
          <p>{property_name}:&nbsp;&nbsp;{ is_required == '1' && <span style={{color: '#F5222D'}}>*</span>}</p>
          <div className={indexStyles.text_fillOut}>
            <span>{default_value}</span>
          </div>
          <span onClick={this.handleDelFormDataItem} className={`${indexStyles.delet_iconCircle}`}>
            <span className={`${globalStyles.authTheme} ${indexStyles.deletet_icon}`}>&#xe68d;</span>
          </span>
          <div className={indexStyles.popoverContainer} style={{ position: 'absolute', right: 0, top: 0 }}>
            <Popover
              key={`${itemKey}-${itemValue}`}
              title={<div className={indexStyles.popover_title}>配置表项</div>}
              trigger="click"
              // visible={this.state.popoverVisible}
              content={this.renderContent()}
              getPopupContainer={triggerNode => triggerNode.parentNode}
              // placement={itemKey == '0' || itemKey == '1' ? 'bottomRight' : 'topRight'}
              placement={'bottomRight'}
              zIndex={1010}
              className={indexStyles.popoverWrapper}
              autoAdjustOverflow={false}
            >
              <div onClick={this.handelPopoverVisible} className={`${globalStyles.authTheme} ${indexStyles.setting_icon}`}>
                <span>&#xe78e;</span>
              </div>
            </Popover>

          </div>
        </div>
      </div>

    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [] } }) {
  return {  processEditDatas }
}
