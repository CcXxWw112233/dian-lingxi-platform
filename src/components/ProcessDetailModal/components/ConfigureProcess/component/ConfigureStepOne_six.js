import React, { Component } from 'react'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Popover, Input, Button, Radio, Select, InputNumber } from 'antd'
import Sheet from '../../../../Sheet/Sheet'

export default class ConfigureStepOne_six extends Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.sheet = null
  }

  render() {
    const { children } = this.props
    return (
      <div>
        {/* <Sheet ref={el => this.sheet = el} /> */}
        {children}
      </div>

    )
  }
}
