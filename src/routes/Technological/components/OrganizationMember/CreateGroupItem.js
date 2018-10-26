//分组列表
import React from 'react'
import CreateTaskStyle from './CreateTask.less'
import { Icon, Checkbox, Collapse, Input, message, Menu, Modal, Dropdown } from 'antd'
import QueueAnim from  'rc-queue-anim'
import ItemTwo from  './ItemTwo'
import ItemOne from './ItemOne'
import {MESSAGE_DURATION_TIME} from "../../../../globalset/js/constant";
import ShowAddMenberModal from './ShowAddMenberModal'
import TreeGroupModal from  './TreeGroupModal'

const Panel = Collapse.Panel

export default class TaskItem extends React.Component {

  state = {
    isInEditAdd: false,
    inputValue: '',
    ShowAddMenberModalVisibile: false,
  }
  //添加成员
  gotoAddItem() {
    this.setShowAddMenberModalVisibile()
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
    const { itemValue = {} } = this.props
    const { id } = itemValue
    this.props.deleteGroup({
      id
    })
  }

  //  修改分组名称
  setIsInEditAdd() {
    this.setState({
      isInEditAdd: true
    })
  }
  inputEditOk(e) {
    this.setState({
      isInEditAdd: false,
      inputValue: '',
    })
    if(!this.state.inputValue) {
      return false
    }
  //  caozuo props
    const { itemValue = {} } = this.props
    const { id } = itemValue
    this.props.updateGroup({
      group_id: id,
      name: this.state.inputValue
    })
  }
  inputChange(e) {
    this.setState({
      inputValue: e.target.value
    })
  }

//添加分组成员操作
  setShowAddMenberModalVisibile() {
    this.setState({
      ShowAddMenberModalVisibile: !this.state.ShowAddMenberModalVisibile
    })
  }
  addMembers(data) {
    const { itemValue = {} } = this.props
    const { id } = itemValue
  }

  render() {
    const { isInEditAdd, inputValue } = this.state
    const { itemValue = {} } = this.props
    const { name , is_default, members = [] } = itemValue //is_default ==='1' 默认分组不可操作

    const operateMenu = () => {
      return (
        <Menu onClick={this.handleMenuClick.bind(this)}>
          <Menu.Item key={'1'}  style={{textAlign: 'center',padding:0,margin: 0}}>
            <div className={CreateTaskStyle.elseProjectMemu}>
              重命名
            </div>
          </Menu.Item>
          <Menu.Item key={'2'}  style={{textAlign: 'center',padding:0,margin: 0}}>
            <div className={CreateTaskStyle.elseProjectDangerMenu}>
              删除
            </div>
          </Menu.Item>
        </Menu>
      );
    }

    return (
      <div className={CreateTaskStyle.taskItem}>
        {!isInEditAdd?(
          <div className={CreateTaskStyle.title}>
            <div className={CreateTaskStyle.title_l}>
              <div>{name}</div>
              <div style={{marginRight: 4, marginLeft: 4}}>·</div>
              <div>{members.length}</div>
              {is_default === '0'?(
                <Dropdown overlay={operateMenu()}>
                  <div className={CreateTaskStyle.titleOperate}>
                    <Icon type="ellipsis" theme="outlined" />
                  </div>
                </Dropdown>
              ):('')}
            </div>
            <div className={CreateTaskStyle.title_r}>
              {/*暂时未开放*/}
              {/*<div>子分组</div><div style={{marginRight: 4, marginLeft: 4}}>·</div>2 <Icon type="down" style={{marginLeft:6}} theme="outlined" />*/}
            </div>
          </div>
        ) : (
          <div>
            <Input autoFocus defaultValue={name}  placeholder={'修改名称'} className={CreateTaskStyle.createTaskItemInput} onChange={this.inputChange.bind(this)} onPressEnter={this.inputEditOk.bind(this)} onBlur={this.inputEditOk.bind(this)}/>
          </div>
        )}

        <QueueAnim >
          {members.map((value,key) => {
            const { status } = value
            let contain
            if(status === '2') {
              contain = (
                <ItemOne {...this.props} itemValue={value}
                         parentItemValue={itemValue}
                         itemKey={key}
                         key={key}  />
               )
            }else if (status === '1'){
              contain = (
                <ItemTwo {...this.props} itemValue={value}
                         parentItemValue={itemValue}
                         itemKey={key}
                         key={key}  />
               )
            }else {

            }
            return contain
          })}
          {is_default === '0'? (
            <div  key={'add'} className={CreateTaskStyle.addItem} onClick={this.gotoAddItem.bind(this)}>
              <Icon type="plus-circle-o" />
            </div>
          ) : ('')}

        </QueueAnim>
        <ShowAddMenberModal {...this.props} addMembers={this.addMembers.bind(this)}  modalVisible={this.state.ShowAddMenberModalVisibile} setShowAddMenberModalVisibile={this.setShowAddMenberModalVisibile.bind(this)}/>
        <TreeGroupModal  {...this.props}/>
      </div>
    )
  }
}
