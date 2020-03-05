import React, { Component } from 'react'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import NameChangeInput from '@/components/NameChangeInput'
import { Radio } from 'antd'

export default class ConfigureProcessStepInfoOne extends Component {
  render() {
    const { itemKey, itemValue } = this.props
    let node_amount = this.props && this.props.processInfo && this.props.processInfo.node_amount
    let stylLine, stylCircle
    if (this.props.processInfo.completed_amount >= itemKey + 1) { //0 1    1  2 | 1 3 | 1 4
      stylLine = indexStyles.line
      stylCircle = indexStyles.circle
    } else if (this.props.processInfo.completed_amount == itemKey) {
      stylLine = indexStyles.doingLine
      stylCircle = indexStyles.doingCircle
    } else {
      stylLine = indexStyles.hasnotCompetedLine
      stylCircle = indexStyles.hasnotCompetedCircle
    }
    let juge = {
      bordered: false
    }
    return (
      <div className={indexStyles.configureProcessOut_1}>
        <div style={{ display: 'flex' }}>
          {node_amount <= itemKey + 1 ? null : <div className={stylLine}></div>}
          <div className={stylCircle}> {itemKey + 1}</div>
          <div className={indexStyles.popover_card}>
            {/* 步骤名称 */}
            <div style={{ marginBottom: '16px' }}>
              <NameChangeInput
                autosize
                // onBlur={this.titleTextAreaChangeBlur}
                // onClick={this.setTitleEdit}
                // setIsEdit={this.setTitleEdit}
                autoFocus={true}
                goldName={''}
                placeholder={'步骤名称(必填)'}
                maxLength={101}
                nodeName={'textarea'}
                style={{ display: 'block', fontSize: 20, color: '#262626', resize: 'none', height: '44px', background: 'rgba(255,255,255,1)', boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.15)', borderRadius: '4px', border: 'none' }}
              />
            </div>
            <div style={{paddingLeft: '14px', paddingRight: '14px'}}>
              {/* 步骤类型 */}
              <div style={{marginBottom: '14px'}}>
                <span className={globalStyles.authTheme}>&#xe7f4; 步骤类型:&nbsp;&nbsp;&nbsp;</span>
                <Radio>资料收集</Radio>
              </div>
              <div className={indexStyles.check_line}></div>
              {/* 填写人 */}
              {/* 更多选项 */}
            </div>
            {/* <span className={indexStyles.dynamicTime}></span> */}
          </div>
        </div>
      </div>
    )
  }
}
