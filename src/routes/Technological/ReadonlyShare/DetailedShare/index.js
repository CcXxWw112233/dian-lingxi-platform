import React from 'react'
import FileDetailModal from './FileDetailShare/FileDetailModal'
import TaskDetailShare from './TaskDetailShare/CreateTask'
import { connect } from 'dva'

@connect()
class DetailedShare extends React.Component {
    state = {

    }

    render() {
        const rela_type = window.location.hash.slice(-1)
        console.log(rela_type, 'dddd', window.location);

        return (
            <div>
                {
                    rela_type === '1' ? <div><TaskDetailShare /></div> : ''
                }
                {
                    rela_type === '2' ? <div><ProccessDetailShare /></div> : ''
                }
                {
                    rela_type === '3' ? <div><FileDetailModal {...this.props} visible={true} /></div> : ''
                }
            </div>
        )
    }
}
export default DetailedShare
