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
  optionsValueChange = (e, key) => {
    const { itemValue } = this.props
    let { options_data = [], options = [] } = itemValue
    // this.setState({
    //   local_name: e.target.value,
    //   key
    // })
    // options_data[key]['value'] = e.target.value
    let newOptionsData = [...options]
    newOptionsData[key]['value'] = e.target.value
    this.updateEdit({ value: newOptionsData }, 'options')
  }

  // 添加选项的点击事件
  handleAddOptionsSelect = () => {
    const { itemValue } = this.props
    const { options_data = [], options = [] } = itemValue
    let obj = {
      key: (Number(options.length)).toString(),
      value: `选项${(Number(options.length) + 1)}`
    }
    options.push(obj)
    // options.push(`选项${(Number(options.length) + 1)}`)
    this.updateEdit({ value: options }, 'options')
  }
  // 删除选项的点击事件 (这里是根据下标来)
  handleDelOptionsSelect = (key) => {
    const { itemValue } = this.props
    const { options_data = [], options = [] } = itemValue
    let newOptionsData = [...options]
    for (var i = 0; i < newOptionsData.length; i++) {
      if (i == key) {
        newOptionsData.splice(key, 1); // 将使后面的元素依次前移，数组长度减1
        i--; // 如果不减，将漏掉一个元素
        break
      }
    }
    // newOptionsData.splice(key,1)
    this.updateEdit({ value: newOptionsData }, 'options')
  }
  isRequiredCheck = (e) => {
    this.updateEdit({ value: e.target.value }, 'is_required')
  }
  verificationRuleChange = (e) => {
    this.updateEdit({ value: e.target.value }, 'is_multiple_choice')
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

  renderContent = () => {
    const { itemKey, itemValue, processEditDatas = [], parentKey } = this.props
    const { title, prompt_content, is_multiple_choice, val_length, is_required, options_data = [], options = [] } = itemValue
    return (
      <div className={indexStyles.popover_content}>
        <div className={`${indexStyles.pop_elem} ${globalStyles.global_vertical_scrollbar}`}>
          <div>
            <p>标题:</p>
            <Input value={title} onChange={this.propertyNameChange} />
          </div>
          <div>
            <p>请选择标题:</p>
            <Input value={prompt_content} onChange={this.defaultValueChange} />
          </div>
          <div>
            <p>添加选项: <span onClick={this.handleAddOptionsSelect} style={{ color: '#1890FF', marginLeft: '5px', cursor: 'pointer', fontSize: '16px' }} className={`${globalStyles.authTheme}`}>&#xe846;</span></p>
            {/* <Input value="空"/> */}
            {
              options.map((item, index) => {
                return (
                  <div key={item} style={{ position: 'relative' }}><Input style={{ marginBottom: '4px', transition: 'all .5s' }} key={item.key} value={item.value} onChange={(e) => { this.optionsValueChange(e, item.key) }} />{index != '0' && <span onClick={() => { this.handleDelOptionsSelect(index) }} style={{ marginLeft: '4px', position: 'absolute', top: '6px' }} className={`${globalStyles.authTheme} ${indexStyles.del_optionsIcon}`}>&#xe7fe;</span>}</div>
                )
              })
            }
          </div>
          <div className={indexStyles.layout_style}>
            <p style={{ marginRight: '16px' }}>是否为必填项:</p>
            <Radio.Group value={is_required} onChange={this.isRequiredCheck}>
              <Radio value="1">是</Radio>
              <Radio value="0">否</Radio>
            </Radio.Group>
          </div>
          <div className={indexStyles.layout_style}>
            <p style={{ marginRight: '16px' }}>是否支持多选:</p>
            <Radio.Group value={is_multiple_choice} onChange={this.verificationRuleChange}>
              <Radio value="1">是</Radio>
              <Radio value="0">否</Radio>
            </Radio.Group>
          </div>
        </div>
        <div className={indexStyles.pop_btn}>
          <Button disabled={title && title != '' && title.trimLR() != '' ? false : true} style={{ width: '100%' }} type="primary">确定</Button>
        </div>
      </div>
    )
  }

  render() {
    const { itemKey, itemValue, processEditDatas = [], parentKey } = this.props
    const { title, prompt_content, is_multiple_choice, val_length, is_required, is_click_currentTextForm } = itemValue
    return (
      <div>
        <div className={`${indexStyles.text_form}`} style={{ background: is_click_currentTextForm ? 'rgba(230,247,255,1)' : 'rgba(0,0,0,0.02)' }} onClick={this.handleChangeTextFormColor}>
          <p>{title}:&nbsp;&nbsp;{is_required == '1' && <span style={{ color: '#F5222D' }}>*</span>}</p>
          <Select className={indexStyles.option_select} placeholder={prompt_content} disabled={true} />
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
              </>
            )
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [] } }) {
  return { processEditDatas }
}
