import React from 'react'
import { Dropdown, Input, Icon, Cascader } from 'antd'
import RaletionDrop from './RaletionDrop'

export default class ContentRaletion extends React.Component {
  state = {

  }

  render() {
    return(
      <div>
        <RaletionDrop {...this.props} />
      </div>
    )
  }
}
