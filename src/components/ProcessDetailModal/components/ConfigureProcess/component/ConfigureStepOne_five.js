import React, { Component } from 'react'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Popover, Input, Button, Radio, Select, InputNumber } from 'antd'

export default class ConfigureStepOne_five extends Component {

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
            <p>校验规则:</p>
            <Select style={{width: '100%'}}/>
          </div>
          <div>
            <p>限制字数:</p>
            <InputNumber min={1} style={{ width: 174, marginRight: '8px' }} /> ~ <InputNumber maxLength={100} style={{ width: 174, marginLeft: '8px' }}/>
          </div>
          <div className={indexStyles.layout_style}>
            <p style={{marginRight: '16px'}}>是否为必填项:</p>
            <Radio.Group>
              <Radio>是</Radio>
              <Radio>否</Radio>
            </Radio.Group>
          </div>
        </div>
        <div className={indexStyles.pop_btn}>
          <Button style={{width: '100%'}} type="primary">确定</Button>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        <div className={indexStyles.text_form}>
          <p>附件上传:</p>
          {/* <div className={indexStyles.text_fillOut}></div> */}
          <div className={indexStyles.upload_static}>
            <span style={{color: '#1890FF', fontSize: '28px',marginTop: '-6px'}} className={`${globalStyles.authTheme}`}>&#xe692;</span>
            <div style={{flex: 1, marginLeft: '12px'}}>
              <div className={indexStyles.file_drap_tips}>点击或拖拽文件到此开始上传</div>
              <div className={indexStyles.file_layout}>20MB以内、最多10个文件、文档、图像、音频、视频格式</div>
            </div>
          </div>
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
