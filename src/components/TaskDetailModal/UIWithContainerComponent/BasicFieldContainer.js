import React, { Component } from 'react'
export default class BasicFieldContainer extends Component {

  render() {
    const { BasicFieldUIComponent, boardFolderTreeData, milestoneList, whetherUpdateParentTaskTime, handleTaskDetailChange, handleChildTaskChange, updateParentPropertiesList } = this.props
    return (
      <BasicFieldUIComponent 
        LogicWithMainContent={this.props.LogicWithMainContent}
        boardFolderTreeData={boardFolderTreeData} 
        milestoneList={milestoneList}
        whetherUpdateParentTaskTime={whetherUpdateParentTaskTime}
        handleTaskDetailChange={handleTaskDetailChange}
        handleChildTaskChange={handleChildTaskChange}
        updateParentPropertiesList={updateParentPropertiesList}
      />
    )
  }
}
