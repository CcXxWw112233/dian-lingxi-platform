import React from 'react'
import { Icon, Modal, message } from 'antd'
import indexStyles from './index.less'
import { connect } from 'dva'
import InformRemind from '@/components/InformRemind'

@connect(mapStateToProps)
export default class Header extends React.Component {
  state = {
  }

  cancleModal = () => {
    this.props.onCancel && this.props.onCancel()
  }

  render() {
    const { headerContent = <div></div> } = this.props
    const { projectDetailInfoData = {}, milestone_detail = {}} = this.props
    const { id } = milestone_detail
    const { data = [] } = projectDetailInfoData //任务执行人列表

    return (
      <div className={indexStyles.header_out}>
        <div className={indexStyles.header_out_left}>
          {headerContent}
        </div>
        <InformRemind className={indexStyles.remind_icon} rela_id={id} rela_type='5' user_remind_info={data} />
        <div className={indexStyles.header_out_right}>
          <Icon type="close" onClick={this.cancleModal} />
        </div>
      </div>
    )
  }
}

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ milestoneDetail: { milestone_detail = {} }, projectDetail: { datas: { projectDetailInfoData = {} } } }) {
  return { milestone_detail, projectDetailInfoData }
}
