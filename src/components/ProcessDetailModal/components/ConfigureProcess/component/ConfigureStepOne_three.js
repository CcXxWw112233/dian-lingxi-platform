import React, { Component } from 'react'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Popover, Input, Button, Radio, Select, InputNumber, Checkbox } from 'antd'
import { connect } from 'dva'
const Option = Select.Option;
@connect(mapStateToProps)
export default class ConfigureStepOne_three extends Component {

  state = {
    popoverVisible: false
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
  dateScopeValueChange(e) {
    this.updateEdit({ value: e.target.value }, 'date_scope')
  }
  verificationRuleChange(value) {
    this.updateEdit({ value: value }, 'verification_rule')
  }
  isRequiredCheck(e) {
    this.updateEdit({ value: e.target.value }, 'is_required')
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
    const { property_name, default_value, verification_rule, date_scope, val_length, is_required } = itemValue
    return (
      <div className={indexStyles.popover_content}>
        <div className={`${indexStyles.pop_elem} ${globalStyles.global_vertical_scrollbar}`}>
          <div>
            <p>标题:</p>
            <Input value={property_name} onChange={this.propertyNameChange.bind(this)} />
          </div>
          <div>
            <p>提示内容:</p>
            <Input value={default_value} onChange={this.defaultValueChange.bind(this)} />
          </div>
          <div className={indexStyles.layout_style}>
            <span style={{ marginRight: '5px' }}>日期范围&nbsp;:</span>
            <Radio.Group value={date_scope} onChange={this.dateScopeValueChange.bind(this)}>
              <Radio value="SINGLE_DATE">单个日期</Radio>
              <Radio value="SINGLE_DATE_TIME">开始日期 ~ 截止日期</Radio>
            </Radio.Group>
          </div>
          <div className={indexStyles.layout_style}>
            <span style={{ marginRight: '5px' }}>日期精度&nbsp;:</span>
            <Radio.Group value={verification_rule} onChange={this.verificationRuleChange.bind(this)}>
              <Radio value="SINGLE_DATE">仅日期</Radio>
              <Radio value="SINGLE_DATE_TIME">日期 + 时间</Radio>
            </Radio.Group>
          </div>
          <div className={indexStyles.layout_style}>
            <p style={{ marginRight: '16px' }}>是否为必填项&nbsp;:</p>
            <Radio.Group onChange={this.isRequiredCheck.bind(this)} value={is_required}>
              <Radio value="1">是</Radio>
              <Radio value="0">否</Radio>
            </Radio.Group>
          </div>
        </div>
        <div className={indexStyles.pop_btn}>
          <Button disabled={property_name && property_name != '' && property_name.trimLR() != '' ? false : true} style={{ width: '100%' }} type="primary">确定</Button>
        </div>
      </div>
    )
  }

  render() {
    const { itemKey, itemValue, processEditDatas = [], parentKey } = this.props
    const { property_name, default_value, verification_rule, val_length, is_required } = itemValue
    return (
      <div>
        <div className={indexStyles.text_form}>
          <p>{property_name}:&nbsp;&nbsp;{is_required == '1' && <span style={{ color: '#F5222D' }}>*</span>}</p>
          <div className={indexStyles.text_fillOut}>
            <span className={globalStyles.authTheme}>&#xe7d3;&nbsp;&nbsp;</span>
            <span style={{ color: 'rgba(0,0,0,0.25)' }}>{default_value}</span>
          </div>
          <span onClick={this.handleDelFormDataItem} className={`${indexStyles.delet_iconCircle}`}>
            <span className={`${globalStyles.authTheme} ${indexStyles.deletet_icon}`}>&#xe68d;</span>
          </span>
          <div className={indexStyles.popoverContainer} style={{ position: 'absolute', right: 0, top: 0 }}>
            <Popover
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
  return { processEditDatas }
}
