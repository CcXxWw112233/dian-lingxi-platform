import React from 'react';
import { Button } from 'antd'
let interval = null
const initTimeValue = 60
let initTime = initTimeValue

//参见登陆界面验证码
export default class VerificationCodeTwo extends React.Component{

  constructor(props) {
    super(props)
  }
  state = {
    initTimeText: '获取验证码',
    buttonDisabled: false, //初始设置按钮是可以点击的
  }

  buttonClick = () => {
    this.buttonClickAction()
  }
  buttonClickAction = () => {
    if(this.state.buttonDisabled) {
      return false
    }
    const that = this
    this.setState({
      initTimeText: --initTime,
      buttonDisabled: true
    })
    interval = setInterval(function () {
      initTime --
      that.setState({
        initTimeText: initTime,
        buttonDisabled: true
      })
      if(initTime === 0) {
        initTime = initTimeValue
        clearInterval(interval)
        that.setState({
          initTimeText: '重新获取',
          buttonDisabled: false,
        })
      }
    }, 1000)
  }
  render() {
    const { text, style, getVerifyCode } = this.props
    const buttonDisabled = this.state.buttonDisabled
    return (
      <divc className={this.props.className} style={{...style,}} onClick={getVerifyCode.bind(null, this.buttonClick)}>{this.state.initTimeText}</divc>
    // color: !buttonDisabled ? '#bfbfbf' : 'rgba(0,0,0,.25)'
    );
  }

};

VerificationCodeTwo.propTypes = {
};
