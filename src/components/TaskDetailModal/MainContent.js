import React, { Component } from 'react'
import DepositMainComponent from './DepositMainComponent'
import UIDefaultComponent from './UIComponent/MainContentUIComponent'

export default class MainContent extends Component {

  render() {
    const { UIComponent, handleRelyUploading, handleTaskDetailChange, handleChildTaskChange } = this.props    
    return (
      <DepositMainComponent
        handleRelyUploading={handleRelyUploading} 
        handleTaskDetailChange={handleTaskDetailChange} 
        handleChildTaskChange={handleChildTaskChange} 
        UIComponent={UIComponent ? UIComponent : UIDefaultComponent}  />
    )
  }
}

