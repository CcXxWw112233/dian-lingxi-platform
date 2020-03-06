import React, { Component } from 'react'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Popover, Input, Button, Radio, Select, InputNumber, Checkbox } from 'antd'

export default class ConfigureStepOne_three extends Component {

  state = {
    popoverVisible: false
  }

  handelPopoverVisible = () => {
    this.setState({
      popoverVisible: !this.state.popoverVisible
    })
  }

  renderContent = () => {
    return (
      <div className={indexStyles.popover_content}>
        <div className={`${indexStyles.pop_elem} ${globalStyles.global_vertical_scrollbar}`}>
          <div>
            <p>标题:</p>
            <Input />
          </div>
          <div>
            <p>限制附件上传数量(0为不限制）:</p>
            <Input />
          </div>
          <div>
            <p>限制附件上传大小（0为不限制）:</p>
            <Input />
          </div>
          <div>
            <p>限制附件上传格式:</p>
            <Checkbox.Group>
              <Checkbox value="1" style={{ color: '#262626' }}>文档</Checkbox>
              <Checkbox value="2" style={{ color: '#262626' }}>图像</Checkbox>
              <Checkbox value="3" style={{ color: '#262626' }}>音频</Checkbox>
              <Checkbox value="4" style={{ color: '#262626' }}>视频</Checkbox>
            </Checkbox.Group>
          </div>
          <div className={indexStyles.layout_style}>
            <p style={{ marginRight: '16px' }}>是否为必填项:</p>
            <Radio.Group>
              <Radio>是</Radio>
              <Radio>否</Radio>
            </Radio.Group>
          </div>
        </div>
        <div className={indexStyles.pop_btn}>
          <Button style={{ width: '100%' }} type="primary">确定</Button>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        <div className={indexStyles.text_form}>
          <p>日期选择:</p>
          <div className={indexStyles.text_fillOut}></div>
          <span className={`${indexStyles.delet_iconCircle}`}>
            <span className={`${globalStyles.authTheme} ${indexStyles.deletet_icon}`}>&#xe68d;</span>
          </span>
          <div className={indexStyles.popoverContainer} style={{ position: 'absolute', right: 0, top: 0 }}>
            <Popover
              title={<div className={indexStyles.popover_title}>配置表项</div>}
              trigger="click"
              visible={this.state.popoverVisible}
              content={this.renderContent()}
              // getPopupContainer={triggerNode => triggerNode.parentNode}
              placement="topRight"
              zIndex={1100}
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
