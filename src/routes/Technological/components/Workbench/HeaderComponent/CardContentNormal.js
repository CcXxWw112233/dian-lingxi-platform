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

export default class CardContentNormal extends React.Component{

  render(){
    const { datas = {} } = this.props.model
    const { responsibleTaskList=[], uploadedFileList=[], joinedProcessList=[], backLogProcessList=[], meetingLsit= [], projectList=[] } = datas
    const { title, CardContentType, itemValue={}, itemKey } = this.props
    const { selected_board_data = [] } = itemValue //已选board id

    const filterItem = (CardContentType) => {
      let contanner = (<div></div>)
      switch (CardContentType) {
        //设计师
        case 'RESPONSIBLE_TASK':
          contanner = (
            responsibleTaskList.length? (
              responsibleTaskList.map((value, key)=> (
                <TaskItem {...this.props} key={key} itemValue={value}itemKey={key} />
              ))
            ):(
              <div style={{marginTop: 12}}>暂无数据</div>
            )

          )
          break
        case 'EXAMINE_PROGRESS': //待处理的流程
          contanner = (
            backLogProcessList.length? (
              backLogProcessList.map((value, key)=> (
                <ProcessItem  {...this.props} key={key}  itemValue={value} />
              ))
            ):(
              <div style={{marginTop: 12}}>暂无数据</div>
            )

          )
          break
        case 'joinedFlows': //参与的流程
          contanner = (
            joinedProcessList.length?(
              joinedProcessList.map((value, key)=> (
                <ProcessItem {...this.props} key={key}  itemValue={value}  />
              ))
            ):(
              <div style={{marginTop: 12}}>暂无数据</div>
            )
          )
          break
        case 'MY_DOCUMENT':
          contanner = (
            uploadedFileList.length? (
              uploadedFileList.map((value, key)=> (
                <FileItem  {...this.props}  key={key}  itemValue={value} setPreviewFileModalVisibile={this.setPreviewFileModalVisibile.bind(this)}/>
              ))
            ):(
              <div style={{marginTop: 12}}>暂无数据</div>
            )
          )
          break
        case 'MEETIMG_ARRANGEMENT':
          contanner = (
            meetingLsit.length? (
              meetingLsit.map((value2, key2)=> {
                return(
                  <MeetingItem {...this.props} key={key2} itemKey={key2}  itemValue={value2}  />
                )})
            ):(
              <div style={{marginTop: 12}}>暂无数据</div>
            )
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
            <div ><Icon type="ellipsis" style={{color: '#8c8c8c', fontSize: 20}} /></div>
          )}
        </div>
        <div className={indexstyles.contentBody}>
          {filterItem(CardContentType)}
        </div>

      </div>
    )
  }


}

