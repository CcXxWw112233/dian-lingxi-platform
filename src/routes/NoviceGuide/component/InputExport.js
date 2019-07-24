import React, { Component } from 'react'
import { Input } from 'antd'
import glabalStyles from '@/globalset/css/globalClassName.less'
import styles from '../index.less'

export default class InputExport extends Component {

  chgVal = (e) => {
    console.log(e, 'sss')
  }

  render() {
    // console.log(this.props, 'sssss')
    const { itemVal } = this.props
    const { index, } = itemVal
    return (
      <div style={{borderBottom:1, borderBottomStyle: 'solid', borderColor: 'rgba(0,0,0,0.25)', marginBottom: 32}}>
        <Input key={index} onChange={this.chgVal} placeholder="(选填)" />
        <span className={styles.proof}>
          <i className={`${glabalStyles.authTheme}`}>&#xe77e;</i>
          <b style={{ display: 'inline-block',marginLeft: 5}}>格式错误</b>
        </span>
      </div>
    )
  }
}
