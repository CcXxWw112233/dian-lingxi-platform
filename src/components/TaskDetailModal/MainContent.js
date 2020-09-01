import React, { Component } from 'react'
import CommonComponent from './CommonComponent'
import UIDefaultComponent from './UIComponent'

export default class MainContent extends Component {

  render() {
    const { UIComponent, handleRelyUploading, handleTaskDetailChange, handleChildTaskChange } = this.props    
    return (
      <CommonComponent
        handleRelyUploading={handleRelyUploading} 
        handleTaskDetailChange={handleTaskDetailChange} 
        handleChildTaskChange={handleChildTaskChange} 
        UIComponent={UIComponent ? UIComponent : UIDefaultComponent}  />
    )
  }
}

