import React, { Component } from 'react'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Popover, Input, Button, Radio, Select, InputNumber, Checkbox } from 'antd'
import { connect } from 'dva'
const Option = Select.Option;
@connect(mapStateToProps)
export default class ConfigureStepOne_five extends Component {

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
  limitFileNumValueChange(value) {
    this.updateEdit({ value: value.toString() }, 'limit_file_num')
  }
  limitFileSizeValueChange(value) {
    this.updateEdit({ value: value.toString() }, 'limit_file_size')
  }
  limilFileTypeValueChange(values) {
    this.updateEdit({ value: values.join(',') }, 'limit_file_type')
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

  renderFileTypeArrayText = () => {
    const { itemValue } = this.props
    const { limit_file_type } = itemValue
    const fileTypeArray = limit_file_type.split(',') //文档类型
    let fileTypeArrayText = [] //文档类型转化中文
    for (let i = 0; i < fileTypeArray.length; i++) {
      if (fileTypeArray[i] === '1') {
        fileTypeArrayText.push('文档')
      } else if (fileTypeArray[i] === '2') {
        fileTypeArrayText.push('图像')
      } else if (fileTypeArray[i] === '3') {
        fileTypeArrayText.push('音频')
      } else if (fileTypeArray[i] === '4') {
        fileTypeArrayText.push('视频')
      }
    }
    return fileTypeArrayText.join('、')
  }

  renderContent = () => {
    const { itemKey, itemValue, processEditDatas = [], parentKey } = this.props
    const { property_name, limit_file_num, limit_file_type, limit_file_size, is_required } = itemValue
    const limit_file_type_default = limit_file_type ? limit_file_type.split(',') : []
    return (
      <div className={indexStyles.popover_content}>
        <div className={`${indexStyles.pop_elem} ${globalStyles.global_vertical_scrollbar}`}>
          <div>
            <p>标题:</p>
            <Input value={property_name} onChange={this.propertyNameChange.bind(this)} />
          </div>
          <div>
            <p>限制附件上传数量(0为不限制）:</p>
            <InputNumber precision="0.1" onChange={this.limitFileNumValueChange.bind(this)} min={0} value={limit_file_num} style={{ width: '330px' }} /><span style={{ marginLeft: '8px', fontSize: '16px' }}>个</span>
          </div>
          <div>
            <p>限制附件上传大小（0为不限制）:</p>
            <InputNumber precision="0.1" onChange={this.limitFileSizeValueChange.bind(this)} min={0} style={{ width: '322px' }} value={limit_file_size} /><span style={{ marginLeft: '8px', fontSize: '16px' }}>MB</span>
          </div>
          <div>
            <p>限制附件上传格式&nbsp;:</p>
            <Checkbox.Group value={limit_file_type_default} onChange={this.limilFileTypeValueChange.bind(this)}>
              <Checkbox value="1" style={{ color: '#262626' }}>文档</Checkbox>
              <Checkbox value="2" style={{ color: '#262626' }}>图像</Checkbox>
              <Checkbox value="3" style={{ color: '#262626' }}>音频</Checkbox>
              <Checkbox value="4" style={{ color: '#262626' }}>视频</Checkbox>
            </Checkbox.Group>
          </div>
          <div className={indexStyles.layout_style}>
            <p style={{ marginRight: '16px' }}>是否为必填项:</p>
            <Radio.Group value={is_required} onChange={this.isRequiredCheck.bind(this)}>
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
    const { itemKey, itemValue } = this.props
    const { property_name, limit_file_num, limit_file_type, limit_file_size, is_required } = itemValue
    const fileTypeArray = limit_file_type.split(',') //文档类型
    let fileTypeArrayText = [] //文档类型转化中文
    for (let i = 0; i < fileTypeArray.length; i++) {
      if (fileTypeArray[i] === '1') {
        fileTypeArrayText.push('文档')
      } else if (fileTypeArray[i] === '2') {
        fileTypeArrayText.push('图像')
      } else if (fileTypeArray[i] === '3') {
        fileTypeArrayText.push('音频')
      } else if (fileTypeArray[i] === '4') {
        fileTypeArrayText.push('视频')
      }
    }
    return (
      <div>
        <div className={indexStyles.text_form}>
          <p>{property_name}:&nbsp;&nbsp;{is_required == '1' && <span style={{ color: '#F5222D' }}>*</span>}</p>
          {/* <div className={indexStyles.text_fillOut}></div> */}
          <div className={indexStyles.upload_static}>
            <span style={{ color: '#1890FF', fontSize: '28px', marginTop: '-6px' }} className={`${globalStyles.authTheme}`}>&#xe692;</span>
            <div style={{ flex: 1, marginLeft: '12px' }}>
              <div className={indexStyles.file_drap_tips}>点击或拖拽文件到此开始上传</div>
              <div className={indexStyles.file_layout}>{limit_file_size == 0 ? `不限制大小` : `${limit_file_size}MB以内`}、{limit_file_num == 0 ? `不限制数量` : `最多${limit_file_num}个`}、 {this.renderFileTypeArrayText()}格式</div>
            </div>
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
