import React, { Component } from 'react'
import { Spin, Progress } from 'antd'
import globalStyles from '@/globalset/css/globalClassName.less'
import styles from './index.less';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default class CirclePreviewLoadingComponent extends Component {
  render() {
    const { is_loading = false, style, loading_text, delay } = this.props

    return (
      <div style={{width: '100%', background: 'rgba(0,0,0,0.15)'}}>
        <Spin size="large" spinning={is_loading} tip={
              <div>
                <span style={{display: 'block', margin: '12px 0 24px', fontSize: '16px'}}>{loading_text}</span>
                <Progress percent={60} />
              </div>
            } delay={delay} style={{...style}}/>
      </div>
    )
  }
}

CirclePreviewLoadingComponent.defaultProps = {
  is_loading: false, // 是否正在加载ing, 状态
  style: {}, // 需要自定义传入的样式,
  loading_text: '正在进入圈评, 请稍等...', // 加载的文本内容
  delay: 500, // 延时加载.
}
