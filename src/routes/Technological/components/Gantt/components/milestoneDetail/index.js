import React from 'react'
import PublicDetailModal from '../../../../../../components/PublicDetailModal'
import MainContent from './MainContent'
import { connect } from 'dva'
import HeaderContent from './HeaderContent'
@connect(mapStateToProps)
export default class GanttDetail extends React.Component {

  state = {
    milestone_id_local: ''
  }
  componentDidMount() {
    this.getMilestoneDetail(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.getMilestoneDetail(nextProps)
  }

  //获取里程碑详情
  getMilestoneDetail = (props) => {
    const { dispatch, milestone_id } = props
    const { milestone_id_local } = this.state
    if(!milestone_id || milestone_id_local == milestone_id) {
      return
    }
    dispatch({
      type: 'milestoneDetail/getMilestoneDetail',
      payload: {
        id: milestone_id
      }
    })
    this.setState({
      milestone_id_local: milestone_id
    })
  }

  onCancel = () => {
    const { dispatch } = this.props
    this.setState({
      milestone_id_local: ''
    })
    dispatch({
      type: 'milestoneDetail/updateDatas',
      payload: {
        milestone_detail: {},
        milestone_id: '',
      }
    })
    this.props.set_miletone_detail_modal_visible && this.props.set_miletone_detail_modal_visible()
  }

  //评论
  commentSubmitPost = (data) => {
    const { text } = data
    const { dispatch, milestone_id } = this.props
    dispatch({
      type: 'publicModalComment/submitPublicModalDetailComment',
      payload: {
        origin_type: '4',
        comment: text,
        id: milestone_id,
        flag: '0',
      }
    })
  }
  deleteComment = (data) => {
    const { id } = data
    const { dispatch, milestone_id } = this.props
    dispatch({
      type: 'publicModalComment/deletePublicModalDetailComment',
      payload: {
        id,
        milestone_id,
        flag: '0',
      }
    })
  }
  render() {
    const { miletone_detail_modal_visible, milestone_id } = this.props
    const { users } = this.props
    const commentUseParams = { //公共评论模块所需要的参数
      commentSubmitPost: this.commentSubmitPost,
      deleteComment: this.deleteComment,
      content_detail_use_id: milestone_id,
      origin_type: '4', //	string评论来源类型 1=任务 2=流程 3=文件 4=里程碑
      flag: '0', //0或不传：评论和动态，1只显示评论，2只动态
    }
    return(
      <div>
        <PublicDetailModal
          modalVisible={miletone_detail_modal_visible}
          onCancel={this.onCancel}
          commentUseParams={commentUseParams}
          mainContent={<MainContent users={users} />}
          headerContent={<HeaderContent />}
        />
      </div>
    )
  }
}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ milestoneDetail: { milestone_id } }) {
  return { milestone_id }
}
