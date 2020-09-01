import React, { Component } from 'react'
export default class DragDropContentComponent extends Component {

  render() {
    const { DragDropUIComponent, boardFolderTreeData, milestoneList } = this.props
    return (
      <DragDropUIComponent 
        LogicWithMainContent={this.props.LogicWithMainContent}
        boardFolderTreeData={boardFolderTreeData} 
        milestoneList={milestoneList} 
      />
    )
  }
}

