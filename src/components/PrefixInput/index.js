import React, { FormEvent, ReactNode } from 'react'
import styles from './index.less'

/** 一个公用的前面是label，后面是可输入文字的input */
export default class PrefixInput extends React.Component {
  state = {
    showError: false
  }
  /**
   * 键盘输入
   * @param e
   */
  setInputValue = e => {
    const { reg, onChange } = this.props
    e.persist()
    let { target } = e
    let value = target.value
    if (reg) {
      let regExp = new RegExp()
      let flag = regExp.test(value)
      onChange && onChange(value, flag)
      this.setState({
        showError: !flag
      })
    } else {
      onChange && onChange(value)
      this.setState({
        showError: false
      })
    }
  }
  render() {
    const {
      label,
      errTip,
      type,
      prefixWidth,
      suffix,
      value,
      maxLength
    } = this.props
    const { showError } = this.state
    return (
      <div className={styles.form_detail}>
        <span className={styles.prefix} style={{ width: prefixWidth }}>
          {label}
        </span>
        <div className={styles.input_box}>
          <input
            readOnly={this.props.readOnly}
            placeholder={this.props.placeholder}
            type={type}
            onInput={this.setInputValue}
            value={value}
            maxLength={maxLength}
          />
          {showError && <span className={styles.warn_text}>{errTip}</span>}
          {suffix}
        </div>
      </div>
    )
  }
}
