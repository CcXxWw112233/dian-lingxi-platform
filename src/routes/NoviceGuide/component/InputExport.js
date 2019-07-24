import React, { Component } from 'react'
import { Input } from 'antd'
import glabalStyles from '@/globalset/css/globalClassName.less'
import styles from '../index.less'
import { validateTel, validateEmail } from '@/utils/verify.js'
let timer;

export default class InputExport extends Component {

  state = {
    timer: null,
    phone_val: '',
    email_val: '',
    is_show_tips: 'none', // 是否显示小图标 默认为none不显示
    is_verify_tips: false, // 验证提示小图标是否成功, 默认为false,验证失败 true 表示成功
  }

  chgVal = (e) => {
    console.log(e.target.value, 'sss')
    let val = e.target.value
    // console.log(validateTel(val), 'ssss')
    if (timer) {
      clearTimeout(timer)
    }
    // this.setState({
    //   timer: setTimeout(() => {
    //     let phone_val_verify = validateTel(val)
    //     console.log(phone_val_verify, 'sss')
    //   }, 500)
    // })


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
