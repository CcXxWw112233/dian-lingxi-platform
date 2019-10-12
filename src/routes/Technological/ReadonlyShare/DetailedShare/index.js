import React from 'react'
import TaskDetailShare from './TaskDetailShare/DrawerContent'
import FileDetailModal from './FileDetailShare/FileDetail/FileDetailContent'
// import ProccessDetailShare from './ProccessDetailShare/index'
import { connect } from 'dva'

@connect()
class DetailedShare extends React.Component {
    state = {
        rela_type: '',  //当前对象弹框类型type, 4=里程碑 3=文件 2=流程 1=任务
    }

    componentDidMount() {
        var query = this.props.history.location.search.substring(1);
        const paramr = this.getUrlParamr(query)
        const { rela_type, rela_id } = paramr
        this.setState({
            rela_type: rela_type
        })
        const { dispatch } = this.props

        if (rela_type === '1') {
            dispatch({
                type: 'projectDetailTask/getCardDetail',
                payload: {
                    id: rela_id
                }
            })
        } else if (rela_type === '2') {

        } else if (rela_type === '3') {
            dispatch({
                type: 'projectDetailFile/previewFileByUrl',
                payload: {
                    file_id: rela_id,
                }
            })
            dispatch({
                type: 'projectDetailFile/getCardCommentListAll',
                payload: {
                    id: rela_id,
                }
            })
        } else if (rela_type === '4') {

        }
    }

    getUrlParamr(query, key) {

        var vars = query.split("&");
        var obj = {};
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            obj[pair[0]] = pair[1]
        }
        if (key)
            return obj[key];
        else
            return obj;
    }

    render() {
        const { rela_type } = this.state
        return (
            <div>
                {
                    rela_type === '1' ? <div><TaskDetailShare /></div> : ''
                }
                {
                    rela_type === '2' ? <div><ProccessDetailShare /></div> : ''
                }
                {
                    rela_type === '3' ? <div><FileDetailModal {...this.props} /></div> : ''
                }
            </div>
        )
    }
}
export default DetailedShare
