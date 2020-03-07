import React, { Component } from 'react'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Popover, Input, Button, Radio, Select, InputNumber, Icon } from 'antd'

export default class ConfigureStepOne_two extends Component {

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
            <p>提示内容:</p>
            <Input />
          </div>
          <div>
            <p>添加选项: <span style={{color:'#1890FF',marginLeft: '5px',cursor: 'pointer',fontSize: '16px'}} className={`${globalStyles.authTheme}`}>&#xe846;</span></p>
            <Input />
          </div>
          <div className={indexStyles.layout_style}>
            <p style={{marginRight: '16px'}}>是否为必填项:</p>
            <Radio.Group>
              <Radio>是</Radio>
              <Radio>否</Radio>
            </Radio.Group>
          </div>
          <div className={indexStyles.layout_style}>
            <p style={{ marginRight: '16px' }}>是否支持多选:</p>
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
        <div className={`${indexStyles.text_form}`}>
          <p>下拉选择:</p>
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
