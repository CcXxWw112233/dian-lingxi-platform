import React, { Component } from 'react'
export default class BasicFieldContainer extends Component {

  render() {
    const { BasicFieldUIComponent, boardFolderTreeData, milestoneList } = this.props
    return (
      <BasicFieldUIComponent 
        LogicWithMainContent={this.props.LogicWithMainContent}
        boardFolderTreeData={boardFolderTreeData} 
        milestoneList={milestoneList} 
      />
    )
  }
}

