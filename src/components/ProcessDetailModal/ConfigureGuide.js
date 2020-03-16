import React, { Component } from 'react'
import indexStyles from './index.less'
import { Button } from 'antd'
import globalStyles from '@/globalset/css/globalClassName.less'

export default class ConfigureGuide extends Component {
  render() {
    const { visible } = this.props
    return (
      <div style={{display: !visible ? 'block' : 'none'}} onClick={(e) => e && e.stopPropagation()} className={`${indexStyles.configure_guide} ${indexStyles.guide_position_1}`} >
        <div className={indexStyles.top}>
          <span className={`${globalStyles.authTheme} ${indexStyles.smile}`}>&#xe847;</span>
          <span className={indexStyles.title}>点击此处可以新建流程步骤～</span>
        </div>
        <div className={indexStyles.bottom}>
          <div className={indexStyles.bottom_right}>
            <Button type={'primary'} size={'small'} onClick={this.quit} >我知道了</Button>
          </div>
        </div>
        <div className={indexStyles.triangle}></div>
      </div>
    )
  }
}
