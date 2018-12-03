import { Card, Icon, Dropdown } from 'antd'
import indexstyles from '../index.less'
import TaskItem from './TaskItem'
import ProcessItem from './ProcessItem'
import FileItem from './FileItem'
import MeetingItem from "./MeetingItem";
import ProjectCountItem from './ProjectCountItem'
import MapItem from './MapItem'
import React from 'react'
import MenuSearchMultiple from  '../../../../../components/MenuSearchMultiple'

export default class CardContent extends React.Component{
  state={
    dropDonwVisible: false, //下拉菜单是否可见
  }
  componentWillMount() {
    const { CardContentType, boxId } = this.props
    switch (CardContentType) {
      case 'RESPONSIBLE_TASK':
        this.props.getResponsibleTaskList({id:boxId})
        break
      case 'EXAMINE_PROGRESS': //待处理的流程
        this.props.getBackLogProcessList({id:boxId})
        break
      case 'joinedFlows': //参与的流程
        this.props.getJoinedProcessList({id:boxId})
        break
      case 'MY_DOCUMENT':
        this.props.getUploadedFileList({id:boxId})
        break
      case 'MEETIMG_ARRANGEMENT':
        this.props.getMeetingList({id:boxId})
        break
      case 'PROJECT_STATISTICS':
        break
      case 'YINYI_MAP':
        break
      default:
        break
    }
  }
  selectMultiple(data) {
    this.setState({
      dropDonwVisible: false
    })

    const { boxId, itemKey } = this.props

    this.props.getItemBoxFilter({
      id: boxId,
      board_ids: data.join(','),
      selected_board_data:data,
      itemKey
    })
  }
  onVisibleChange(e,a){
    this.setState({
      dropDonwVisible: e
    })
  }
  render(){
    const { datas = {} } = this.props.model
    const { responsibleTaskList=[], uploadedFileList=[], joinedProcessList=[], backLogProcessList=[], meetingLsit= [], projectList=[] } = datas
    const { title, CardContentType, itemValue={}, itemKey } = this.props
    const { selected_board_data = [] } = itemValue //已选board id

    const filterItem = (CardContentType) => {
      let contanner = (<div></div>)
      switch (CardContentType) {
        case 'RESPONSIBLE_TASK':
          contanner = (
            responsibleTaskList.length? (
              responsibleTaskList.map((value, key)=> (
                <TaskItem key={key} itemValue={value}itemKey={key} {...this.props}/>
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
                <ProcessItem key={key}  itemValue={value} {...this.props} />
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
                <ProcessItem key={key}  itemValue={value} {...this.props} />
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
                <FileItem key={key}  itemValue={value} {...this.props} />
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
          break
      }
      return contanner
    }
    return (
      <div className={indexstyles.cardDetail}>
        <div className={indexstyles.contentTitle}>
          <div>{title}</div>
          {'YINYI_MAP' === CardContentType? (''): (
            <Dropdown trigger={['click']}
                      visible={this.state.dropDonwVisible}
                      onVisibleChange={this.onVisibleChange.bind(this)}
                      overlay={<MenuSearchMultiple keyCode={'board_id'} onCheck={this.selectMultiple.bind(this)} selectedKeys={selected_board_data} menuSearchSingleSpinning={false} Inputlaceholder={'搜索项目'} searchName={'board_name'} listData={projectList} />}>
               <div ><Icon type="ellipsis" style={{color: '#8c8c8c', fontSize: 20}} /></div>
            </Dropdown>
          )}
        </div>
        <div className={indexstyles.contentBody}>
          {filterItem(CardContentType)}
        </div>
      </div>
    )
  }


}

