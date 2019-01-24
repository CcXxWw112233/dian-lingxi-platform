import { Card, Icon, Dropdown, Input, Menu } from 'antd'
import indexstyles from '../index.less'
import TaskItem from './TaskItem'
import ProcessItem from './ProcessItem'
import FileItem from './FileItem'
import MeetingItem from "./MeetingItem";
import ProjectCountItem from './ProjectCountItem'
import MapItem from './MapItem'
import React from 'react'
import MenuSearchMultiple from  '../CardContent/MenuSearchMultiple'
import SchedulingItem from './School/SchedulingItem'
import Journey from './School/Journey'
import Todo from './School/Todo'
import SchoolWork from './School/SchoolWork'
import MyShowItem from './MyShowItem'
import TeachingEffect from './School/TeachingEffect'
import PreviewFileModal from '../PreviewFileModal.js'
import CollectionProjectItem from './CollectionProjectItem'
import MyCircleItem from './MyCircleItem'
import TaskDetailModal from './Modal/TaskDetailModal'
import FileDetailModal from './Modal/FileDetailModal'

const TextArea = Input.TextArea
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default class CardContent extends React.Component{
  state={
    dropDonwVisible: false, //下拉菜单是否可见
    previewFileModalVisibile: false,

    //修改项目名称所需state
    localTitle: '',
    isInEditTitle: false,
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
      case 'MY_CIRCLE':
        this.props.getProjectUserList()
        this.props.getOrgMembers()
        break
      case 'PROJECT_TRCKING':
        this.props.getProjectStarList()
        break
      //老师
      case 'MY_SCHEDULING': //我的排课 --会议
        this.props.getSchedulingList({id: boxId})
        break
      case 'JOURNEY': //行程安排 --会议
        this.props.getJourneyList({id: boxId})
        break
      case 'TO_DO':  //代办事项 --任务
        this.props.getTodoList({id: boxId})
        break
      case 'SCHOOLWORK_CORRECTION': //作业批改
        break
      case 'TEACHING_EFFECT': //教学计划
        break
      default:
        break
    }
    this.initSet(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.initSet(nextProps)
  }
  //初始化根据props设置state
  initSet(props) {
    const { title } = props
    this.setState({
      localTitle: title
    })
  }
  //项目操作----------------start
  //设置项目名称---start
  setIsInEditTitle() {
    this.setState({
      isInEditTitle: !this.state.isInEditTitle,
    })
  }
  localTitleChange(e) {
    this.setState({
      localTitle: e.target.value
    })
  }
  editTitleComplete(e) {
    this.setIsInEditTitle()
    const { boxId } = this.props
    this.props.updateBox({
      box_id: boxId,
      name: this.state.localTitle,
    })
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
  handleMenuClick(e) {
    const key = e.key
    switch (key) {
      case 'rename':
        this.setIsInEditTitle()
        break
      case 'remove':
        const { itemValue } = this.props
        const { box_type_id } = itemValue
        this.props.deleteBox({box_type_id: box_type_id})
        break
      default:
        break
    }
  }

  setPreviewFileModalVisibile() {
    this.setState({
      previewFileModalVisibile: !this.state.previewFileModalVisibile
    })
  }
  setTaskDetailModalVisibile(){
    this.setState({
      TaskDetailModalVisibile: !this.state.TaskDetailModalVisibile
    })
  }
  render(){
    const { datas = {} } = this.props.model
    const { projectStarList = [], responsibleTaskList=[], uploadedFileList=[], joinedProcessList=[], backLogProcessList=[], meetingLsit= [], projectList=[], schedulingList = [],journeyList = [], todoList =[]} = datas
    const { title, CardContentType, itemValue={} } = this.props
    const { selected_board_data = [] } = itemValue //已选board id

    const { localTitle, isInEditTitle } = this.state

    const filterItem = (CardContentType) => {
      let contanner = (<div></div>)
      switch (CardContentType) {
        //设计师
        case 'RESPONSIBLE_TASK':
          contanner = (
            responsibleTaskList.length? (
              responsibleTaskList.map((value, key)=> (
                <TaskItem {...this.props} key={key} itemValue={value}itemKey={key} setTaskDetailModalVisibile={this.setTaskDetailModalVisibile.bind(this)}/>
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
                  <MeetingItem {...this.props} key={key2} itemKey={key2}  itemValue={value2} setTaskDetailModalVisibile={this.setTaskDetailModalVisibile.bind(this)} />
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
        case 'PROJECT_TRCKING':
          contanner = (
            projectStarList.length? (
              projectStarList.map((value2, key2)=> {
                return(
                  <CollectionProjectItem {...this.props} key={key2} itemKey={key2}  itemValue={value2}  />
                )})
            ):(
              <div style={{marginTop: 12}}>暂无数据</div>
            )
          )
          break
        case 'MY_SHOW':
          contanner = (
            <MyShowItem   {...this.props} />
          )
          break
        case 'MY_CIRCLE':
          contanner = (
            <MyCircleItem   {...this.props} />
          )
          break
        //老师
        case 'MY_SCHEDULING':
          contanner = (
            schedulingList.length? (
              schedulingList.map((value, key)=> {
                return(
                  <SchedulingItem {...this.props} key={key} itemValue={value}itemKey={key} setTaskDetailModalVisibile={this.setTaskDetailModalVisibile.bind(this)} />
                )})
            ):(
              <div style={{marginTop: 12}}>暂无数据</div>
            )
          )
          break
        case 'JOURNEY':
          contanner = (
            journeyList.length? (
              journeyList.map((value, key)=> {
                return(
                  <Journey {...this.props} key={key} itemValue={value}itemKey={key} setTaskDetailModalVisibile={this.setTaskDetailModalVisibile.bind(this)} />
                )})
            ):(
              <div style={{marginTop: 12}}>暂无数据</div>
            )
          )
          break
        case 'TO_DO':
          contanner = (
            todoList.length? (
              todoList.map((value, key)=> {
                return(
                  <Todo {...this.props} key={key} itemValue={value}itemKey={key} setTaskDetailModalVisibile={this.setTaskDetailModalVisibile.bind(this)}/>
                )})
            ):(
              <div style={{marginTop: 12}}>暂无数据</div>
            )
          )
          break
        case 'SCHOOLWORK_CORRECTION':
          contanner = (
            <SchoolWork />
          )
          break
        case 'TEACHING_EFFECT':
          contanner = (
            <TeachingEffect />
          )
          break

        default:
          break
      }
      return contanner
    }

    const menu = ()=> {
      return (
        <Menu
          onClick={this.handleMenuClick.bind(this)}
          // selectedKeys={[this.state.current]}
          // mode="horizontal"
        >
          <Menu.Item key="rename">
             重命名
          </Menu.Item>
          {'YINYI_MAP' === CardContentType || 'TEAM_SHOW' === CardContentType? (''): (
            <SubMenu title={'选择项目'}>
              <MenuSearchMultiple keyCode={'board_id'} onCheck={this.selectMultiple.bind(this)} selectedKeys={selected_board_data} menuSearchSingleSpinning={false} Inputlaceholder={'搜索项目'} searchName={'board_name'} listData={projectList} />
            </SubMenu>
          )}

          <Menu.Item key="remove">
            移除
          </Menu.Item>

        </Menu>
      )
    }

    return (
      <div className={indexstyles.cardDetail}>
        <div className={indexstyles.contentTitle}>
          {/*<div>{title}</div>*/}

          {!isInEditTitle?(
            <div className={indexstyles.titleDetail} >{localTitle}</div>
          ) : (
            <Input value={localTitle}
                   // className={indexStyle.projectName}
                     style={{resize: 'none',color: '#595959', fontSize: 16}}
                      maxLength={30}
                     autoFocus
                     onChange={this.localTitleChange.bind(this)}
                     onPressEnter={this.editTitleComplete.bind(this)}
                     onBlur={this.editTitleComplete.bind(this)} />
          )}
          {/*<MenuSearchMultiple keyCode={'board_id'} onCheck={this.selectMultiple.bind(this)} selectedKeys={selected_board_data} menuSearchSingleSpinning={false} Inputlaceholder={'搜索项目'} searchName={'board_name'} listData={projectList} />*/}
          <Dropdown
            // trigger={['click']}
            // visible={this.state.dropDonwVisible}
            // onVisibleChange={this.onVisibleChange.bind(this)}
            overlay={menu()}>

            <div className={indexstyles.operate}><Icon type="ellipsis" style={{color: '#8c8c8c', fontSize: 20}} /></div>
          </Dropdown>

        </div>
        <div className={indexstyles.contentBody}>
          {filterItem(CardContentType)}
          {/*<MyShowItem />*/}
           {/*<CollectionProjectItem />*/}
           {/*<MyCircleItem />*/}
        </div>
        <FileDetailModal  {...this.props}  modalVisible={this.state.previewFileModalVisibile} setPreviewFileModalVisibile={this.setPreviewFileModalVisibile.bind(this)}   />
        <TaskDetailModal {...this.props}  modalVisible={this.state.TaskDetailModalVisibile} setTaskDetailModalVisibile={this.setTaskDetailModalVisibile.bind(this)} setPreviewFileModalVisibile={this.setPreviewFileModalVisibile.bind(this)} />

        {/*{('MY_DOCUMENT' === CardContentType || 'RESPONSIBLE_TASK' === CardContentType || 'TO_DO' === CardContentType )? (*/}
          {/*<FileDetailModal  {...this.props}  modalVisible={this.state.previewFileModalVisibile} setPreviewFileModalVisibile={this.setPreviewFileModalVisibile.bind(this)}   />*/}
        {/*) : ('')}*/}
        {/*{'RESPONSIBLE_TASK' === CardContentType || 'TO_DO' === CardContentType?(*/}
          {/*<TaskDetailModal {...this.props}  modalVisible={this.state.TaskDetailModalVisibile} setTaskDetailModalVisibile={this.setTaskDetailModalVisibile.bind(this)} setPreviewFileModalVisibile={this.setPreviewFileModalVisibile.bind(this)} />*/}
        {/*):('')}*/}
      </div>
    )
  }


}

