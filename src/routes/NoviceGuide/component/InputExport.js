import React, { Component } from 'react'
import { Input } from 'antd'

export default class InputExport extends Component {
  render() {
    console.log(this.props, 'sssss')
    return (
      <div>
        <Input placeholder="(选填)" />
      </div>
    )
  }
}
