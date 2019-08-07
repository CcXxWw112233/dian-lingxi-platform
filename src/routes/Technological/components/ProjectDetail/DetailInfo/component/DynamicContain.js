// 动态列表
import React, { Component } from 'react'
import DrawDetailInfoStyle from '../DrawDetailInfo.less'
import { connect } from 'dva'
import { Icon } from 'antd'
import globalStyles from '@/globalset/css/globalClassName.less'
import {currentNounPlanFilterName, getOrgNameWithOrgIdFilter, checkIsHasPermission, checkIsHasPermissionInBoard} from "@/utils/businessFunction";
import {ORGANIZATION, TASKS, FLOWS, DASHBOARD, PROJECTS, FILES, MEMBERS, CATCH_UP, ORG_TEAM_BOARD_QUERY, NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME, PROJECT_TEAM_CARD_INTERVIEW,
  PROJECT_FILES_FILE_INTERVIEW,
  PROJECT_FLOW_FLOW_ACCESS,
} from "@/globalset/js/constant";
import {newsDynamicHandleTime, timestampToTime, timestampToHM} from '@/utils/util'

@connect(({projectDetail: { datas: { projectDynamicsList = [], p_next_id } } }) => ({
  projectDynamicsList, p_next_id
}))
export default class DynamicContain extends Component {

  componentDidMount() {
    const { board_id } = this.props
    this.props.getDispatchDynamicList(board_id)
  }

  routingJump(path) {
    this.props.dispatch({
      type: 'projectDetail/routingJump',
      payload: {
        route: path
      }
    })
  }

   // 去任务详情
   goToTask({board_id, content}) {
    if(!checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_INTERVIEW, board_id)){
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    this.routingJump(`/technological/projectDetail?board_id=${content && content.board && content.board.id}&appsSelectKey=3&card_id=${content && content.card && content.card.id}`)
  }

  render() {
    const { projectDynamicsList } = this.props

    //过滤消息内容
    const filterTitleContain = (activity_type, messageValue) => {
      let contain = ''
      let messageContain = (<div></div>)
      let jumpToTask = (
        <span 
          style={{color: '#1890FF', cursor: 'pointer'}} 
          onClick={ () => { this.goToTask({board_id: messageValue.content.board.id, content: messageValue.content}) } }
        >{messageValue.content && messageValue.content.card && messageValue.content.card.name}</span>
      )

      switch (activity_type) {
        case 'board.card.create':
          messageContain = (
              <div style={{maxWidth: 500}} className={DrawDetailInfoStyle.news_text}>
                {messageValue.creator.name} 创建了{currentNounPlanFilterName(TASKS)}「{jumpToTask}」 
                <div className={DrawDetailInfoStyle.news_time}>{timestampToHM(messageValue.created)}</div>
              </div>
           )
           contain = `创建${currentNounPlanFilterName(TASKS)}`
           break;
        default:
          break;
      }
      return { contain, messageContain }
    }
     //任务动态
     const taskNews = (value) =>{
      const { content = {}, org_id, action, creator} = value
      const { avatar } = creator
      const { board = {}, card = {}, lists = {} } = content
      const card_name = card['name']
      const card_id = card['id']
      const list_name = lists['name']
      const board_name = board['name']
      const board_id = board['id']
      return (
        <div style={{display:'flex'}}>
            <div className={DrawDetailInfoStyle.left}>
             {
               avatar ? (
                 <img src={avatar} />
               ) : (
                <div style={{width: 32, height: 32, borderRadius: 32, backgroundColor: '#f2f2f2', textAlign: 'center'}}>
                  <Icon type={'user'} style={{fontSize: 20, color: '#8c8c8c', marginTop: 5}}/>
                </div>
               )
             }
            </div>
            <div className={DrawDetailInfoStyle.right}>
              {filterTitleContain(action, value).messageContain}
            </div>
        </div>
      )
    }

     //具体详细信息
     const filterNewsType = (type, value,childrenKey) => {
      //  console.log(type, value, 'ssssss')
      let containner = (<div></div>)
      switch (type) {
        case '11':
          containner = ( taskNews(value) )
          break
        default:
          break
      }
      return containner
    }

    return (
      <ul>   
        {
          projectDynamicsList && projectDynamicsList.length ? projectDynamicsList.map((item, childrenKey) => {
            const { rela_type } = item
            return (
              <li key={childrenKey}>{filterNewsType(rela_type, item, childrenKey)}</li>
            )
          }) : (
            <li>
              <div style={{margin: 'auto', textAlign: 'center'}}>
                <div style={{fontSize: 48, color: 'rgba(0,0,0,0.15)'}} className={`${globalStyles.authTheme}`}>&#xe683;</div>
                <span style={{color: 'rgba(217,217,217,1)'}}>暂无动态</span>
              </div>
            </li>
          )
        }
        {/* <li>
          <div className={DrawDetailInfoStyle.left}>
            <img />
          </div>
          <div className={DrawDetailInfoStyle.right}>
            <div className={DrawDetailInfoStyle.news_text}>
              xxx 修改了原项目名 「xxx」为「xxx」名称。
            </div>
            <div className={DrawDetailInfoStyle.news_time}>xxxx时间</div>
          </div>
        </li> */}
      </ul>
    )
  }
}
