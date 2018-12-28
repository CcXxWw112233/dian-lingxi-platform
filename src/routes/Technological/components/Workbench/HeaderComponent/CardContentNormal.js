import { Card, Icon, Dropdown } from 'antd'
import indexstyles from './index.less'
import TaskItem from './TaskItem'
import ProcessItem from './ProcessItem'
import FileItem from './FileItem'
import MeetingItem from "./MeetingItem";
import ProjectCountItem from './ProjectCountItem'
import MapItem from './MapItem'
import React from 'react'
import CollectionProjectItem from './CollectionProjectItem'
import MyCircleItem from './MyCircleItem'
import MyShowItem from './MyShowItem'
import ArticleItem from './ArticleItem'

export default class CardContentNormal extends React.Component{

  render(){
    const {  itemValue={} } = this.props
    const { code, name,  } = itemValue
    const filterItem = (code) => {
      let contanner = (<div></div>)
      switch (code) {
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
          <div>{name}</div>
          {'YINYI_MAP' === code || 'TEAM_SHOW' === code? (''): (
            <div>
              <Icon type="ellipsis" style={{color: '#8c8c8c', fontSize: 20}} />
            </div>
          )}
        </div>
        <div className={indexstyles.contentBody}>
          {filterItem(code)}
        </div>

      </div>
    )
  }


}

