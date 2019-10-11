import React from 'react'
import FileDetailModal from './FileDetailShare/FileDetailModal'
import TaskDetailShare from './TaskDetailShare/CreateTask'

export default class index extends React.Component {
    state = {

    }

    render() {
        return (
            <FileDetailModal {...this.props} visible={true} />

            // <ProccessDetailShare />
            // <TaskDetailShare />
        )
    }
}
