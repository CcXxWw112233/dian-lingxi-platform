import React, { Component } from 'react'

export default class DetailContent extends Component {
  render() {
    const { mainContent = (<div></div>), componentWidth, componentHeight } = this.props
    return (
      <div style={{ width: componentWidth + 'px', height: componentHeight + 'px'}}>
        {mainContent}
      </div>
    )
  }
}
