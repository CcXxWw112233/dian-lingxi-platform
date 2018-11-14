//分组列表
import React from 'react'
import CreateTaskStyle from './CreateTask.less'
import { Icon, Checkbox, Collapse, Input, message, Dropdown, Menu, Modal } from 'antd'
import QueueAnim from  'rc-queue-anim'
import ItemOne from  './ItemOne'
import ItemTwo from  './ItemTwo'
import {
  MESSAGE_DURATION_TIME, PROJECT_TEAM_CARD_GROUP, NOT_HAS_PERMISION_COMFIRN, PROJECT_TEAM_CARD_CREATE,
  ORG_UPMS_ORGANIZATION_GROUP
} from "../../../../../globalset/js/constant";
import {checkIsHasPermission, checkIsHasPermissionInBoard} from "../../../../../utils/businessFunction";

const Panel = Collapse.Panel

export default class TaskItem extends React.Component {

  state = {
    isAddEdit: false,
    isInEditName: false
  }
  gotoAddItem() {
    if(!checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_CREATE)){
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    this.setState({
      isAddEdit:true,
    })
  }
  addItem(data,e) {
    const name =  e.target.value
    if(name){
      const obj = Object.assign(data,{name})
      this.props.addTask(obj)
    }
    this.setState({
      isAddEdit:false,
    })
  }

  //点击分组操作
  handleMenuClick(e ) {
    e.domEvent.stopPropagation();
    if(!checkIsHasPermission(ORG_UPMS_ORGANIZATION_GROUP)){
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    const { key } = e
    switch (key) {
      case '1':
        this.setIsInEditAdd()
        break
      case '2':
        this.deleteConfirm()
        break
      default:
        break
    }
  }
  deleteConfirm( ) {
    const that = this
    Modal.confirm({
      title: '确认删除？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        that.deleteGroupItem()
      }
    });
  }
  deleteGroupItem() {
    const { taskItemValue = {}, itemKey } = this.props
    const { list_id } = taskItemValue
    this.props.deleteTaskGroup({
      id: list_id,
      itemKey
    })
  }

  //  修改分组名称
  setIsInEditAdd() {
    this.setState({
      isInEditName: true
    })
  }
  inputEditOk(e) {
    this.setState({
      isInEditName: false,
      inputValue: '',
    })
    if(!this.state.inputValue) {
      return false
    }
    //  caozuo props
    const { taskItemValue = {}, itemKey } = this.props
    const { list_id } = taskItemValue

    this.props.updateTaskGroup({
      id: list_id,
      name: this.state.inputValue,
      itemKey
    })
  }
  inputChange(e) {
    this.setState({
      inputValue: e.target.value
    })
  }


  render() {
    const { isAddEdit, isInEditName } = this.state
    const { taskItemValue = {} } = this.props
    const { projectDetailInfoData = {} } = this.props.model.datas
    const { board_id } = projectDetailInfoData
    const { list_name, list_id, card_data = [] } = taskItemValue

    const operateMenu = () => {
      return (
        <Menu onClick={this.handleMenuClick.bind(this)}>
          <Menu.Item key={'1'}  style={{textAlign: 'center',padding:0,margin: 0}}>
            <div className={CreateTaskStyle.elseProjectMemu}>
              重命名
            </div>
          </Menu.Item>
          {card_data.length ? (''): (
            <Menu.Item key={'2'}  style={{textAlign: 'center',padding:0,margin: 0}}>
              <div className={CreateTaskStyle.elseProjectDangerMenu}>
                删除
              </div>
            </Menu.Item>
          )}
        </Menu>
      );
    }


    return (
      <div className={CreateTaskStyle.taskItem}>
        {/*<div className={CreateTaskStyle.title}>*/}
          {/*/!*{list_name}<Icon type="right" className={[CreateTaskStyle.nextIcon]}/>*!/*/}
        {/*</div>*/}
          {!isInEditName?(
            <div className={CreateTaskStyle.title}>
              <div className={CreateTaskStyle.title_l}>
                <div className={CreateTaskStyle.title_l_name}>{list_name}</div>
                <div><Icon type="right" className={[CreateTaskStyle.nextIcon]}/></div>
                <Dropdown overlay={operateMenu()}>
                  <div className={CreateTaskStyle.titleOperate}>
                    <Icon type="ellipsis" theme="outlined" />
                  </div>
                </Dropdown>
              </div>
              <div className={CreateTaskStyle.title_r}>
              </div>
            </div>
          ) : (
            <div>
              <Input autoFocus defaultValue={list_name}  placeholder={'修改名称'} className={CreateTaskStyle.createTaskItemInput} onChange={this.inputChange.bind(this)} onPressEnter={this.inputEditOk.bind(this)} onBlur={this.inputEditOk.bind(this)}/>
            </div>
          )}

        <QueueAnim >
          {card_data.map((value,key) => {
            return(
              <ItemTwo itemValue={value} {...this.props}
                       taskGroupListIndex_index={key}
                       key={key} {...this.props} />
            )
          })}
          {!isAddEdit ? (
            <div  key={'add'} className={CreateTaskStyle.addItem} onClick={this.gotoAddItem.bind(this)}>
              <Icon type="plus-circle-o" />
            </div>
          ) : (
            <div  key={'add'} className={CreateTaskStyle.addItem} >
              <Input  onPressEnter={this.addItem.bind(this,{board_id, list_id})} onBlur={this.addItem.bind(this,{board_id, list_id})} autoFocus={true}/>
            </div>
          )}
        </QueueAnim>
      </div>
    )
  }
}
