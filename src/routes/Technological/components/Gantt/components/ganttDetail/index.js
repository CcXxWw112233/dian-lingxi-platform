import React from 'react'
import PublicDetailModal from '../../../../../../components/PublicDetailModal'
import MainContent from './MainContent'
import { connect } from 'dva'

@connect(mapStateToProps)
export default class GanttDetail extends React.Component {

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  render() {
    const { miletone_detail_modal_visible, set_miletone_detail_modal_visible } = this.props
    const { currentSelectedProjectMembersList } = this.props
    return(
      <div>
        <PublicDetailModal
          modalVisible={miletone_detail_modal_visible}
          onCancel={set_miletone_detail_modal_visible}
          mainContent={<MainContent users={currentSelectedProjectMembersList}/>}
        />
      </div>
    )
  }
}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ workbench: { datas: { currentSelectedProjectMembersList = [] }} }) {
  return {currentSelectedProjectMembersList }
}
