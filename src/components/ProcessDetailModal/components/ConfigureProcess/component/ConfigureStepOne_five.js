import React, { Component } from 'react'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Popover, Input, Button, Radio, Select, InputNumber, Checkbox } from 'antd'
import { connect } from 'dva'
import ConfigureNapeGuide from '../../../ConfigureNapeGuide'
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

  updateEdit = (data, key) => {
    const { itemKey, parentKey, processEditDatas = [] } = this.props
    const { forms = [] } = processEditDatas[parentKey]
    forms[itemKey][key] = data.value
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: forms }, 'forms')
  }
  propertyNameChange = (e) => {
    this.updateEdit({ value: e.target.value }, 'title')
  }
  limitFileNumValueChange = (value) => {
    if (!value) {
      this.updateEdit({ value: '0' }, 'limit_file_num')
      return
    }
    this.updateEdit({ value: value.toString() }, 'limit_file_num')
  }
  limitFileSizeValueChange = (value) => {
    if (!value) {
      this.updateEdit({ value: '0' }, 'limit_file_size')
      return
    }
    this.updateEdit({ value: value.toString() }, 'limit_file_size')
  }
  limilFileTypeValueChange = (values) => {
    this.updateEdit({ value: values }, 'limit_file_type')
  }
  isRequiredCheck = (e) => {
    this.updateEdit({ value: e.target.value }, 'is_required')
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

  renderFileTypeArrayText = () => {
    const { itemValue } = this.props
    const { limit_file_type = [] } = itemValue
    const fileTypeArray = [...limit_file_type]
    let fileTypeArrayText = [] //文档类型转化中文
    if (!fileTypeArray || !fileTypeArray.length) {
      let text = '不限制'
      return text
    }
    for (let i = 0; i < fileTypeArray.length; i++) {
      if (fileTypeArray[i] === 'document') {
        fileTypeArrayText.push('文档')
      } else if (fileTypeArray[i] === 'image') {
        fileTypeArrayText.push('图像')
      } else if (fileTypeArray[i] === 'audio') {
        fileTypeArrayText.push('音频')
      } else if (fileTypeArray[i] === 'video') {
        fileTypeArrayText.push('视频')
      }
    }
    return fileTypeArrayText.join('、')
  }

  renderContent = () => {
    const { itemKey, itemValue, processEditDatas = [], parentKey } = this.props
    const { title, limit_file_num, limit_file_type = [], limit_file_size, is_required } = itemValue
    const limit_file_type_default = limit_file_type ? limit_file_type : []
    return (
      <div className={indexStyles.popover_content}>
        <div className={`${indexStyles.pop_elem} ${globalStyles.global_vertical_scrollbar}`}>
          <div>
            <p>标题:</p>
            <Input value={title} onChange={this.propertyNameChange} />
          </div>
          <div>
            <p>限制附件上传数量(0为不限制）:</p>
            <InputNumber precision="0.1" onChange={this.limitFileNumValueChange} min={0} value={limit_file_num} style={{ width: '330px' }} /><span style={{ marginLeft: '8px', fontSize: '16px' }}>个</span>
          </div>
          <div>
            <p>限制附件上传大小（0为不限制）:</p>
            <InputNumber precision="0.1" onChange={this.limitFileSizeValueChange} min={0} style={{ width: '322px' }} value={limit_file_size} /><span style={{ marginLeft: '8px', fontSize: '16px' }}>MB</span>
          </div>
          <div>
            <p>限制附件上传格式&nbsp;:</p>
            <Checkbox.Group value={limit_file_type_default} onChange={this.limilFileTypeValueChange}>
              <Checkbox value="document" style={{ color: '#262626' }}>文档</Checkbox>
              <Checkbox value="image" style={{ color: '#262626' }}>图像</Checkbox>
              <Checkbox value="audio" style={{ color: '#262626' }}>音频</Checkbox>
              <Checkbox value="video" style={{ color: '#262626' }}>视频</Checkbox>
            </Checkbox.Group>
          </div>
          <div className={indexStyles.layout_style}>
            <p style={{ marginRight: '16px' }}>是否为必填项:</p>
            <Radio.Group value={is_required} onChange={this.isRequiredCheck}>
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
    const { itemKey, itemValue } = this.props
    const { title, limit_file_num, limit_file_type, limit_file_size, is_required, is_click_currentTextForm } = itemValue
    return (
      <div>
        <div className={indexStyles.text_form} style={{ background: is_click_currentTextForm ? 'rgba(230,247,255,1)' : 'rgba(0,0,0,0.02)' }} onClick={this.handleChangeTextFormColor}>
          <p>{title}:&nbsp;&nbsp;{is_required == '1' && <span style={{ color: '#F5222D' }}>*</span>}</p>
          {/* <div className={indexStyles.text_fillOut}></div> */}
          <div className={indexStyles.upload_static}>
            <span style={{ color: '#1890FF', fontSize: '28px', marginTop: '-6px' }} className={`${globalStyles.authTheme}`}>&#xe692;</span>
            <div style={{ flex: 1, marginLeft: '12px' }}>
              <div className={indexStyles.file_drap_tips}>点击或拖拽文件到此开始上传</div>
              <div className={indexStyles.file_layout}>{limit_file_size == 0 ? `不限制大小` : `${limit_file_size}MB以内`}、{limit_file_num == 0 ? `不限制数量` : `最多${limit_file_num}个`}、 {this.renderFileTypeArrayText()}格式</div>
            </div>
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
          { itemKey == '0' && <ConfigureNapeGuide visible={false} /> }
        </div>
      </div>

    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [] } }) {
  return { processEditDatas }
}
