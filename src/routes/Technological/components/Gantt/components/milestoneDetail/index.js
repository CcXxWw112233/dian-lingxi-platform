import React from 'react'
import PublicDetailModal from '../../../../../../components/PublicDetailModal'
import MainContent from './MainContent'
import { connect } from 'dva'
import HeaderContent from './HeaderContent'
@connect(mapStateToProps)
export default class GanttDetail extends React.Component {

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  onCancel = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'milestoneDetail/updateDatas',
      payload: {
        milestone_detail: {}
      }
    })
    this.props.set_miletone_detail_modal_visible && this.props.set_miletone_detail_modal_visible()
  }
  render() {
    const { miletone_detail_modal_visible, set_miletone_detail_modal_visible } = this.props
    const { users } = this.props
    return(
      <div>
        <PublicDetailModal
          modalVisible={miletone_detail_modal_visible}
          onCancel={this.onCancel}
          mainContent={<MainContent users={users}/>}
          headerContent={<HeaderContent />}
        />
      </div>
    )
  }
}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ workbench: { datas: { currentSelectedProjectMembersList = [] }} }) {
  return {currentSelectedProjectMembersList }
}
