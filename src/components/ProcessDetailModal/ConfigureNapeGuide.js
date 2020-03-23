import React, { Component } from 'react'
import indexStyles from './index.less'
import { Button } from 'antd'
import globalStyles from '@/globalset/css/globalClassName.less'

export default class ConfigureNapeGuide extends Component {
  render() {
    const { visible } = this.props
    return (
      <div style={{display: !visible ? 'block' : 'none', padding: '16px'}} onClick={(e) => e && e.stopPropagation()} className={`${indexStyles.configure_guide} ${indexStyles.guide_position_2}`} >
        <div className={indexStyles.top}>
          <span className={`${globalStyles.authTheme} ${indexStyles.smile}`}>&#xe847;</span>
          <span className={indexStyles.title}>点击此处可以配置表项的要求</span>
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
