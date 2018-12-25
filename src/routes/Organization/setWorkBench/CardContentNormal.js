import { Card, Icon, Dropdown } from 'antd'
import indexstyles from './index.less'
import TaskItem from './../../Technological/components/Workbench/HeaderComponent/TaskItem'
import ProcessItem from './../../Technological/components/Workbench/HeaderComponent/ProcessItem'
import FileItem from './../../Technological/components/Workbench/HeaderComponent/FileItem'
import MeetingItem from "./../../Technological/components/Workbench/HeaderComponent/MeetingItem";
import ProjectCountItem from './../../Technological/components/Workbench/HeaderComponent/ProjectCountItem'
import MapItem from './../../Technological/components/Workbench/HeaderComponent/MapItem'
import React from 'react'
import CollectionProjectItem from './../../Technological/components/Workbench/HeaderComponent/CollectionProjectItem'
import MyCircleItem from './../../Technological/components/Workbench/HeaderComponent/MyCircleItem'
import MyShowItem from './../../Technological/components/Workbench/HeaderComponent/MyShowItem'
import ArticleItem from './../../Technological/components/Workbench/HeaderComponent/ArticleItem'

export default class CardContentNormal extends React.Component{

  render(){
    const { datas = {} } = this.props.model
    const {  CardContentType, itemValue={} } = this.props
    const filterItem = (CardContentType) => {
      let contanner = (<div></div>)
      switch (CardContentType) {
        //设计师
        case 'RESPONSIBLE_TASK':
          contanner = (
            <TaskItem />
          )
          break
        case 'EXAMINE_PROGRESS': //待处理的流程
          contanner = (
            <ProcessItem />
          )
          break
        case 'MY_DOCUMENT':
          contanner = (
            <FileItem />
          )
          break
        case 'MEETIMG_ARRANGEMENT':
          contanner = (
            <MeetingItem />
          )
          break
        case 'PROJECT_STATISTICS':
          contanner = (
            <ProjectCountItem />
          )
          break
        case 'YINYI_MAP':
          contanner = (
            <MapItem />
          )
          break
        default:
          contanner = (
           <TaskItem />
          )
          break
      }
      return contanner
    }
    return (
      <div className={indexstyles.cardDetail}>
        <div className={indexstyles.contentTitle}>
          <div>{'我的项目'}</div>
          {'YINYI_MAP' === CardContentType || 'TEAM_SHOW' === CardContentType? (''): (
            <div>
              <Icon type="ellipsis" style={{color: '#8c8c8c', fontSize: 20}} />
            </div>
          )}
        </div>
        <div className={indexstyles.contentBody}>
          {filterItem(CardContentType)}
        </div>

      </div>
    )
  }


}

