import React, { Component } from 'react'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Popover, Input, Button, Radio, Select, InputNumber, Icon } from 'antd'
import { connect } from 'dva'
const Option = Select.Option;
@connect(mapStateToProps)
export default class ConfigureStepOne_two extends Component {

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
  optionsValueChange = (e, key) => {
    const { itemValue } = this.props
    let { options_data = [] } = itemValue
    options_data[key]['value'] = e.target.value
    this.updateEdit({ value: options_data }, 'options_data')
  }
  // 添加选项的点击事件
  handleAddOptionsSelect = () => {
    const { itemValue } = this.props
    const { options_data = [] } = itemValue
    let obj = {
      key: (Number(options_data.length)).toString(),
      value: `选项${(Number(options_data.length) + 1)}`
    }
    options_data.push(obj)
    this.updateEdit({ value: options_data }, 'options_data')
  }
  // 删除选项的点击事件 (这里是根据下标来)
  handleDelOptionsSelect = (key) => {
    const { itemValue } = this.props
    const { options_data = [] } = itemValue
    let newOptionsData = [...options_data]
    for (var i = 0; i < newOptionsData.length; i++) {
      if (i == key) {
        newOptionsData.splice(key, 1); // 将使后面的元素依次前移，数组长度减1
        i--; // 如果不减，将漏掉一个元素
        break
      }
    }
    // newOptionsData.splice(key,1)
    this.updateEdit({ value: newOptionsData }, 'options_data')
  }
  isRequiredCheck(e) {
    this.updateEdit({ value: e.target.value }, 'is_required')
  }
  verificationRuleChange(e) {
    this.updateEdit({ value: e.target.value }, 'verification_rule')
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
    const { property_name, default_value, verification_rule, val_length, is_required, options_data = [] } = itemValue
    return (
      <div className={indexStyles.popover_content}>
        <div className={`${indexStyles.pop_elem} ${globalStyles.global_vertical_scrollbar}`}>
          <div>
            <p>标题:</p>
            <Input value={property_name} onChange={this.propertyNameChange.bind(this)} />
          </div>
          <div>
            <p>{default_value}:</p>
            <Input value={default_value} onChange={this.defaultValueChange.bind(this)} />
          </div>
          <div>
            <p>添加选项: <span onClick={this.handleAddOptionsSelect} style={{ color: '#1890FF', marginLeft: '5px', cursor: 'pointer', fontSize: '16px' }} className={`${globalStyles.authTheme}`}>&#xe846;</span></p>
            {/* <Input value="空"/> */}
            {
              options_data.map((item, index) => {
                return (
                  <div key={item} style={{ position: 'relative' }}><Input style={{ marginBottom: '4px', transition: 'all .5s' }} key={item.key} value={item.value} onChange={(e) => { this.optionsValueChange(e, item.key) }} />{item.key != '0' && <span onClick={() => { this.handleDelOptionsSelect(index) }} style={{ marginLeft: '4px', position: 'absolute', top: '6px' }} className={`${globalStyles.authTheme} ${indexStyles.del_optionsIcon}`}>&#xe7fe;</span>}</div>
                )
              })
            }
          </div>
          <div className={indexStyles.layout_style}>
            <p style={{ marginRight: '16px' }}>是否为必填项:</p>
            <Radio.Group value={is_required} onChange={this.isRequiredCheck.bind(this)}>
              <Radio value="1">是</Radio>
              <Radio value="0">否</Radio>
            </Radio.Group>
          </div>
          <div className={indexStyles.layout_style}>
            <p style={{ marginRight: '16px' }}>是否支持多选:</p>
            <Radio.Group value={verification_rule} onChange={this.verificationRuleChange.bind(this)}>
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
        <div className={`${indexStyles.text_form}`}>
          <p>{property_name}:&nbsp;&nbsp;{is_required == '1' && <span style={{ color: '#F5222D' }}>*</span>}</p>
          <Select className={indexStyles.option_select} placeholder={default_value} disabled={true} />
          <span onClick={this.handleDelFormDataItem} className={`${indexStyles.delet_iconCircle}`}>
            <span className={`${globalStyles.authTheme} ${indexStyles.deletet_icon}`}>&#xe68d;</span>
          </span>
          <div className={indexStyles.popoverContainer} style={{ position: 'absolute', right: 0, top: 0 }}>
            <Popover
              title={<div className={indexStyles.popover_title}>配置表项</div>}
              trigger="click"
              visible={this.state.popoverVisible}
              content={this.renderContent()}
              getPopupContainer={triggerNode => triggerNode.parentNode}
              placement={itemKey == '0' || itemKey == '1' ? 'bottomRight' : 'topRight'}
              zIndex={1010}
              className={indexStyles.popoverWrapper}
            // autoAdjustOverflow={false}
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
