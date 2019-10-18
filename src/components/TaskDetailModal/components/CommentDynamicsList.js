import React, { Component } from 'react'
import { connect } from 'dva'
import { TASKS } from '@/globalset/js/constant'
import { timestampToTimeNormal, judgeTimeDiffer, judgeTimeDiffer_ten } from "@/utils/util";
import { currentNounPlanFilterName, getOrgNameWithOrgIdFilter, checkIsHasPermission, checkIsHasPermissionInBoard } from "@/utils/businessFunction";
import commentDynamicsListStyles from './commentDynamicsList.less'

@connect(mapStateToProps)
export default class CommentDynamicsList extends Component {
  render() {
    const { comment_list } = this.props
    const filterIssues = (data) => {
      const { action, create_time } = data
      let container = ''
      let messageContainer = (<div></div>)
      switch (action) {
        case 'board.card.create':// 创建卡片
          messageContainer = (
            <div className={commentDynamicsListStyles.news_item}>
              <span className={commentDynamicsListStyles.news_text}>
                <span className={commentDynamicsListStyles.news_creator}>{data.creator && data.creator.name}</span>
                <span>创建了一条</span>
                <span>{data.content && data.content.card_type && data.content.card_type == '0' ? currentNounPlanFilterName(TASKS) : '会议'}</span>
                <span className={commentDynamicsListStyles.news_card_name}>{(data.content && data.content.card && data.content.card.name) && data.content.card.name}</span>
              </span>
              <span>{judgeTimeDiffer(create_time)}</span>
            </div>
          )
          break
        case 'board.card.delete':// 删除卡片
          messageContainer = (
            <div className={commentDynamicsListStyles.news_item}>
              <span className={commentDynamicsListStyles.news_text}>
                <span className={commentDynamicsListStyles.news_creator}>{data.creator && data.creator.name}</span>
                <span>删除了一条</span>
                <span>{data.content && data.content.card_type && data.content.card_type == '0' ? currentNounPlanFilterName(TASKS) : '会议'}</span>
                <span className={commentDynamicsListStyles.news_card_name}>{(data.content && data.content.card && data.content.card.name) && data.content.card.name}</span>
              </span>
              <span>{judgeTimeDiffer(create_time)}</span>
            </div>
          )
          break
        case 'board.card.update.name':// 更新任务名
            messageContainer = (
              <div className={commentDynamicsListStyles.news_item}>
                <span className={commentDynamicsListStyles.news_text}>
                  <span className={commentDynamicsListStyles.news_creator}>{data.creator && data.creator.name}</span>
                  <span>将</span>
                  <span className={commentDynamicsListStyles.news_card_name}>{(data.content && data.content.rela_data && data.content.rela_data.name) && data.content.rela_data.name}</span>
                  <span>的{currentNounPlanFilterName(TASKS)}的名称修改为</span>
                  <span className={commentDynamicsListStyles.news_card_name}>{(data.content && data.content.card && data.content.card.name) && data.content.card.name}</span>
                </span>
                <span>{judgeTimeDiffer(create_time)}</span>
              </div>
            )
          break
        case 'board.card.update.executor.add':// 添加任务执行人
          messageContainer = (
            <div className={commentDynamicsListStyles.news_item}>
              <span className={commentDynamicsListStyles.news_text}>
                <span className={commentDynamicsListStyles.news_creator}>{data.creator && data.creator.name}</span>
                <span>将</span>
                <span>{data.content && data.content.card_type && data.content.card_type == '0' ? currentNounPlanFilterName(TASKS) : '会议'}</span>
                <span className={commentDynamicsListStyles.news_card_name}>{(data.content && data.content.card && data.content.card.name) && data.content.card.name}</span>
                <span>指派给</span>
                <span className={commentDynamicsListStyles.news_creator}>{(data.content && data.content.rela_data && data.content.rela_data.name) && data.content.rela_data.name}</span>
              </span>
              <span>{judgeTimeDiffer(create_time)}</span>
            </div>
          )
          break
        case 'board.card.update.executor.remove':// 移除任务执行人
          messageContainer = (
            <div className={commentDynamicsListStyles.news_item}>
              <span className={commentDynamicsListStyles.news_text}>
                <span className={commentDynamicsListStyles.news_creator}>{data.creator && data.creator.name}</span>
                <span>在</span>
                <span className={commentDynamicsListStyles.news_card_name}>{(data.content && data.content.card && data.content.card.name) && data.content.card.name}</span>
                <span>{data.content && data.content.card_type && data.content.card_type == '0' ? currentNounPlanFilterName(TASKS) : '会议'}</span>
                <span>中移除了执行人</span>
                <span className={commentDynamicsListStyles.news_creator}>{(data.content && data.content.rela_data && data.content.rela_data.name) && data.content.rela_data.name}</span>
              </span>
              <span>{judgeTimeDiffer(create_time)}</span>
            </div>
          )
          break
        case 'board.card.update.finish':// 完成任务
          messageContainer = (
            <div className={commentDynamicsListStyles.news_item}>
              <span className={commentDynamicsListStyles.news_text}>
                <span className={commentDynamicsListStyles.news_creator}>{data.creator && data.creator.name}</span>
                <span>完成了</span>
                <span className={commentDynamicsListStyles.news_card_name}>{(data.content && data.content.card && data.content.card.name) && data.content.card.name}</span>
                <span>{data.content && data.content.card_type && data.content.card_type == '0' ? currentNounPlanFilterName(TASKS) : '会议'}</span>
              </span>
              <span>{judgeTimeDiffer(create_time)}</span>
            </div>
          )
          break
        case 'board.card.update.cancel.finish':// 取消完成任务
          messageContainer = (
            <div className={commentDynamicsListStyles.news_item}>
              <span className={commentDynamicsListStyles.news_text}>
                <span className={commentDynamicsListStyles.news_creator}>{data.creator && data.creator.name}</span>
                <span>重做了</span>
                <span className={commentDynamicsListStyles.news_card_name}>{(data.content && data.content.card && data.content.card.name) && data.content.card.name}</span>
                <span>{data.content && data.content.card_type && data.content.card_type == '0' ? currentNounPlanFilterName(TASKS) : '会议'}</span>
              </span>
              <span>{judgeTimeDiffer(create_time)}</span>
            </div>
          )
          break
        default:
          break
      }
      return messageContainer
    }
    return (
      <div style={{marginTop: '12px'}}>
        {
          comment_list.map((item, key) => {
            return <div key={key}>{filterIssues(item)}</div>
          })
        }
      </div>
    )
  }
}

//  只关联public中弹窗内的数据
function mapStateToProps({ publicModalComment: { comment_list = [] } } ) {
  return { comment_list }
}
